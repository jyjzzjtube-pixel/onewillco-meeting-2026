/* 공간브릿지 유입 추적 — 방문 채널·검색어·최초 유입(첫 접점) 기록 */
(function () {
  try {
    var sid = localStorage.getItem('sb_sid');
    if (!sid) {
      sid = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : 's' + Date.now() + Math.random().toString(36).slice(2, 10);
      localStorage.setItem('sb_sid', sid);
    }
    var utm = {};
    var sp = new URLSearchParams(location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (k) {
      if (sp.get(k)) utm[k] = sp.get(k);
    });
    var ref = document.referrer || '';
    var internal = false;
    try { internal = ref && new URL(ref).host === location.host; } catch (e) {}

    /* 최초 유입(첫 접점) 저장 — 견적 문의 시 "어디서 온 고객인지" 귀속에 사용 */
    if (!localStorage.getItem('sb_first')) {
      localStorage.setItem('sb_first', JSON.stringify({
        ref: internal ? '' : ref, utm: utm, landing: location.pathname + location.search, t: Date.now()
      }));
    }

    /* 정적 호스팅 모드(window.SB_STATIC)에서는 서버 수집 생략 — 첫 접점 기록만 유지 */
    if (!window.SB_STATIC) {
      var payload = JSON.stringify({
        sid: sid, path: location.pathname, ref: internal ? '' : ref, utm: utm
      });
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/track', new Blob([payload], { type: 'application/json' }));
      } else {
        fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true });
      }
    }

    /* 견적 폼에서 사용할 수 있게 노출 */
    window.SB = {
      sid: sid,
      first: (function () { try { return JSON.parse(localStorage.getItem('sb_first')); } catch (e) { return {}; } })()
    };
  } catch (e) { /* 추적 실패가 사이트를 깨면 안 됨 */ }
})();
