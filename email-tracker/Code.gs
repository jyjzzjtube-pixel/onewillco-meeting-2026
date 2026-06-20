/**
 * ============================================================
 *  Email Read-Receipt Tracker (Gmail + Google Sheets)
 * ------------------------------------------------------------
 *  동작 원리
 *  1) 이메일 본문에 1x1 투명 픽셀(<img>)을 삽입한다.
 *  2) 픽셀 URL 은 이 스크립트의 Web App(doGet) 을 가리킨다.
 *  3) 수신자가 메일을 "열람"하면 브라우저/메일 클라이언트가
 *     픽셀 이미지를 요청 -> doGet 이 실행됨.
 *  4) doGet 은 열람 시간/추적ID/IP/UserAgent 를
 *     Google Sheets 에 자동으로 한 줄 기록한다.
 *  5) 응답으로 진짜 1x1 투명 GIF 바이트를 돌려준다.
 *
 *  주의 (정직하게)
 *  - Gmail 은 이미지를 프록시(googleusercontent)로 캐싱하므로
 *    수신자 IP 가 아닌 Google 프록시 IP 가 찍힐 수 있다.
 *  - 이미지 자동 로드를 끈 수신자는 추적되지 않는다.
 *  - "프록시 첫 호출" 이후 캐시되면 재열람이 안 잡힐 수 있다.
 *  - 본인이 보낸 메일의 수신 여부 확인 용도로만 사용할 것.
 * ============================================================
 */

// ── 설정값 ────────────────────────────────────────────────
// 처음 1회만: setup() 실행 -> 스프레드시트 자동 생성 & ID 저장.
// 또는 기존 시트를 쓰려면 아래에 직접 ID 를 넣어도 된다.
const SHEET_NAME = 'OpenLog';

// 1x1 투명 GIF (base64) — 표준 GIF89a 투명 픽셀
const TRANSPARENT_GIF_BASE64 =
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

/**
 * 최초 1회 실행: 로그용 스프레드시트를 만들고 ID 를 저장한다.
 * (Apps Script 편집기에서 setup 함수를 선택해 실행)
 */
function setup() {
  const props = PropertiesService.getScriptProperties();
  let sheetId = props.getProperty('SHEET_ID');

  if (!sheetId) {
    const ss = SpreadsheetApp.create('Email Open Tracker - Log');
    sheetId = ss.getId();
    props.setProperty('SHEET_ID', sheetId);

    const sheet = ss.getActiveSheet();
    sheet.setName(SHEET_NAME);
    sheet
      .getRange(1, 1, 1, 6)
      .setValues([['열람 시간(KST)', '추적 ID', '수신자(라벨)', '제목', 'IP', 'User-Agent']])
      .setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, 6);
  }

  Logger.log('SHEET_ID = ' + sheetId);
  Logger.log(
    'Spreadsheet URL = https://docs.google.com/spreadsheets/d/' + sheetId
  );
  return sheetId;
}

/**
 * 로그 시트 핸들 반환 (없으면 생성).
 */
function getLogSheet_() {
  const props = PropertiesService.getScriptProperties();
  let sheetId = props.getProperty('SHEET_ID');
  if (!sheetId) {
    sheetId = setup(); // 안전장치: 미설정 시 자동 setup
  }
  const ss = SpreadsheetApp.openById(sheetId);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet
      .getRange(1, 1, 1, 6)
      .setValues([['열람 시간(KST)', '추적 ID', '수신자(라벨)', '제목', 'IP', 'User-Agent']])
      .setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * ★ Web App 엔드포인트 ★
 * 픽셀이 로드될 때 호출된다.
 * 예) https://script.google.com/macros/s/XXXX/exec?tid=abc&to=kim&subj=hello
 */
function doGet(e) {
  try {
    const params = (e && e.parameter) || {};
    const tid = params.tid || '(no-id)';
    const to = params.to || '(unknown)';
    const subj = params.subj || '';

    // Gmail 이미지 프리페치(스팸봇/스캐너) 1차 호출을 거르고 싶다면
    // params 에 토큰을 둬서 필터링할 수도 있다. 여기선 전부 기록.
    const tz = 'Asia/Seoul';
    const now = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HH:mm:ss');

    const headers = (e && e.headers) || {};
    const ua = headers['User-Agent'] || headers['user-agent'] || '';
    // Apps Script 는 클라이언트 IP 를 직접 제공하지 않는다.
    // (X-Forwarded-For 가 있을 때만 시도)
    const ip = headers['X-Forwarded-For'] || headers['x-forwarded-for'] || '';

    getLogSheet_().appendRow([now, tid, to, subj, ip, ua]);
  } catch (err) {
    // 로깅 실패해도 픽셀은 정상 반환 (수신자 경험 보호)
    console.error('tracker log error: ' + err);
  }

  // 실제 1x1 투명 GIF 바이트 반환
  const bytes = Utilities.base64Decode(TRANSPARENT_GIF_BASE64);
  const blob = Utilities.newBlob(bytes, 'image/gif', 'pixel.gif');
  return blob; // Apps Script 가 image/gif 로 응답
}

/**
 * 추적 픽셀 URL 을 만들어 준다.
 * @param {string} trackingId  고유 추적 ID (수신자별/메일별)
 * @param {string} toLabel     수신자 라벨(이름/메모)
 * @param {string} subject     메일 제목
 * @return {string} <img> 태그 문자열
 */
function buildPixelTag_(trackingId, toLabel, subject) {
  const props = PropertiesService.getScriptProperties();
  const webAppUrl = props.getProperty('WEBAPP_URL');
  if (!webAppUrl) {
    throw new Error(
      'WEBAPP_URL 미설정: 웹앱 배포 후 setWebAppUrl("https://.../exec") 실행 필요'
    );
  }
  const url =
    webAppUrl +
    '?tid=' + encodeURIComponent(trackingId) +
    '&to=' + encodeURIComponent(toLabel) +
    '&subj=' + encodeURIComponent(subject) +
    '&cb=' + Date.now(); // 캐시 무력화용 cache-buster

  return (
    '<img src="' + url + '" width="1" height="1" ' +
    'alt="" style="display:none;border:0;width:1px;height:1px;" />'
  );
}

/**
 * 배포 후 1회: 발급된 웹앱 /exec URL 을 저장한다.
 */
function setWebAppUrl(url) {
  PropertiesService.getScriptProperties().setProperty('WEBAPP_URL', url);
  Logger.log('WEBAPP_URL saved: ' + url);
}

/**
 * 추적 픽셀이 포함된 메일을 발송한다.
 * @param {string} recipient  받는사람 이메일
 * @param {string} subject    제목
 * @param {string} htmlBody   HTML 본문
 * @param {string} toLabel    로그용 라벨(선택)
 */
function sendTrackedEmail(recipient, subject, htmlBody, toLabel) {
  const trackingId = Utilities.getUuid();
  const pixel = buildPixelTag_(trackingId, toLabel || recipient, subject);

  GmailApp.sendEmail(recipient, subject, '', {
    htmlBody: htmlBody + pixel,
    name: Session.getActiveUser().getEmail(),
  });

  Logger.log('Sent. trackingId=' + trackingId + ' -> ' + recipient);
  return trackingId;
}

/**
 * 사용 예시 (테스트용). 발송 전 본문/주소를 바꿔서 실행.
 */
function demoSend() {
  const html =
    '<p>안녕하세요,</p>' +
    '<p>요청하신 자료 공유드립니다. 확인 후 회신 부탁드립니다.</p>' +
    '<p>감사합니다.</p>';
  sendTrackedEmail('test@example.com', '[테스트] 수신확인 메일', html, '테스트수신자');
}
