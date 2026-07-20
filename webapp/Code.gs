/**
 * 원윌앤코 브랜드 M&A 플랫폼 — 공유 서버 (Google Apps Script)
 *
 * - doGet: index.html(플랫폼 화면)을 서비스
 * - 데이터: 배포자 구글 드라이브의 JSON 파일 1개 (onewillco_mna_db.json)
 * - 동시 편집: LockService로 직렬화 → 두 사람이 동시에 써도 데이터가 덮어써지지 않음
 * - 클라이언트는 개별 작업(op) 단위로 보내고, 서버가 병합 후 전체 DB를 돌려줌
 */

var DB_FILE_NAME = 'onewillco_mna_db.json';

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('원윌앤코x구름랩스 브랜드 M&A 플랫폼')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * 자동화 API (클로드코드·코덱스·curl용)
 * - 스크립트 속성에 API_TOKEN을 설정해야 작동 (프로젝트 설정 → 스크립트 속성)
 * - POST <웹앱 /exec 주소>  body: {"token":"...","action":"getAll"}
 *   또는 {"token":"...","action":"applyOp","op":{...}}  (op 형식은 applyOp_ 참고)
 */
function doPost(e) {
  var out;
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var token = PropertiesService.getScriptProperties().getProperty('API_TOKEN');
    if (!token || body.token !== token) {
      out = { error: 'unauthorized: API_TOKEN 불일치 (스크립트 속성에 API_TOKEN 설정 필요)' };
    } else if (body.action === 'getAll') {
      out = apiGetAll();
    } else if (body.action === 'applyOp' && body.op) {
      out = apiApplyOp(body.op);
    } else {
      out = { error: 'unknown action: getAll | applyOp 중 하나를 보내세요' };
    }
  } catch (err) {
    out = { error: String(err) };
  }
  return ContentService.createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}

function getDbFile_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('DB_FILE_ID');
  if (id) {
    try { return DriveApp.getFileById(id); } catch (e) { /* 파일이 지워졌으면 새로 생성 */ }
  }
  var init = { rev: 1, brands: [], listings: [] };
  var f = DriveApp.createFile(DB_FILE_NAME, JSON.stringify(init), 'application/json');
  props.setProperty('DB_FILE_ID', f.getId());
  return f;
}

function readDb_(f) {
  try {
    var d = JSON.parse(f.getBlob().getDataAsString());
    if (d && Array.isArray(d.brands) && Array.isArray(d.listings)) return d;
  } catch (e) { /* 손상 시 초기화 */ }
  return { rev: 1, brands: [], listings: [] };
}

function apiGetAll() {
  var d = readDb_(getDbFile_());
  return { rev: d.rev || 1, db: { brands: d.brands, listings: d.listings } };
}

function apiApplyOp(op) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var f = getDbFile_();
    var d = readDb_(f);
    applyOp_(d, op);
    d.rev = (d.rev || 1) + 1;
    f.setContent(JSON.stringify(d));
    return { rev: d.rev, db: { brands: d.brands, listings: d.listings } };
  } finally {
    lock.releaseLock();
  }
}

function coll_(d, kind) { return kind === 'brand' ? d.brands : d.listings; }

function applyOp_(d, op) {
  switch (op.type) {
    case 'upsertBrand': {
      var eb = d.brands.filter(function (x) { return x.id === op.brand.id; })[0];
      if (eb) { for (var k in op.brand) eb[k] = op.brand[k]; }
      else d.brands.push(op.brand);
      break;
    }
    case 'deleteBrand':
      d.brands = d.brands.filter(function (x) { return x.id !== op.id; });
      d.listings.forEach(function (l) { if (l.brandId === op.id) l.brandId = ''; });
      break;
    case 'upsertListing': {
      var el = d.listings.filter(function (x) { return x.id === op.listing.id; })[0];
      if (el) { for (var k2 in op.listing) el[k2] = op.listing[k2]; }
      else d.listings.push(op.listing);
      break;
    }
    case 'deleteListing':
      d.listings = d.listings.filter(function (x) { return x.id !== op.id; });
      break;
    case 'addComment': {
      var oc = coll_(d, op.kind).filter(function (x) { return x.id === op.id; })[0];
      if (oc) {
        oc.comments = oc.comments || [];
        var dup = oc.comments.some(function (c) { return c.id === op.comment.id; });
        if (!dup) oc.comments.push(op.comment);
      }
      break;
    }
    case 'delComment': {
      var od = coll_(d, op.kind).filter(function (x) { return x.id === op.id; })[0];
      if (od) od.comments = (od.comments || []).filter(function (c) { return c.id !== op.commentId; });
      break;
    }
    case 'addDoc': {
      var oe = coll_(d, op.kind).filter(function (x) { return x.id === op.id; })[0];
      if (oe) {
        oe.docs = oe.docs || [];
        var dup2 = oe.docs.some(function (x2) { return x2.id === op.doc.id; });
        if (!dup2) oe.docs.push(op.doc);
      }
      break;
    }
    case 'delDoc': {
      var of_ = coll_(d, op.kind).filter(function (x) { return x.id === op.id; })[0];
      if (of_) of_.docs = (of_.docs || []).filter(function (x2) { return x2.id !== op.docId; });
      break;
    }
    case 'setCheck': {
      var og = coll_(d, op.kind).filter(function (x) { return x.id === op.id; })[0];
      if (og) {
        og.checks = og.checks || [];
        var exk = og.checks.filter(function (x) { return x.id === op.check.id; })[0];
        if (exk) { for (var k4 in op.check) exk[k4] = op.check[k4]; }
        else og.checks.push(op.check);
      }
      break;
    }
    case 'delCheck': {
      var oh = coll_(d, op.kind).filter(function (x) { return x.id === op.id; })[0];
      if (oh) oh.checks = (oh.checks || []).filter(function (x) { return x.id !== op.checkId; });
      break;
    }
    case 'replaceAll':
      if (op.db && Array.isArray(op.db.brands) && Array.isArray(op.db.listings)) {
        d.brands = op.db.brands;
        d.listings = op.db.listings;
      }
      break;
    default:
      throw new Error('알 수 없는 작업: ' + op.type);
  }
}
