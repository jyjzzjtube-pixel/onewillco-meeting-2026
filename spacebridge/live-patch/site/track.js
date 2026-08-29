/* 공간브릿지 유입 추적: 개인정보 없이 최초/최근 접점과 CTA 이벤트를 보관한다. */
(function () {
  'use strict';

  var ATTR_KEY = 'sb_attribution_v2';
  var LEGACY_FIRST_KEY = 'sb_first';
  var EVENT_KEY = 'sb_attribution_events_v1';
  var SESSION_KEY = 'sb_sid';
  var LEGACY_PII_KEY = 'spacebridgeLeadDraftInbox';
  var MAX_VALUE_LENGTH = 120;
  var ATTR_TTL_MS = 90 * 24 * 60 * 60 * 1000;
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];

  function clean(value) {
    return String(value || '')
      .replace(/[\r\n\t]/g, ' ')
      .replace(/[^0-9A-Za-z가-힣._~\- ]/g, '')
      .trim()
      .slice(0, MAX_VALUE_LENGTH);
  }

  function cleanPath(value) {
    return String(value || '/')
      .replace(/[^0-9A-Za-z가-힣._~\/-]/g, '')
      .slice(0, MAX_VALUE_LENGTH) || '/';
  }

  function cleanOrigin(url) {
    return [url.protocol, '//', url.host].join('').slice(0, MAX_VALUE_LENGTH);
  }

  function readJson(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  function getSessionId() {
    var sid = '';
    try { sid = sessionStorage.getItem(SESSION_KEY) || ''; } catch (e) {}
    if (!sid) {
      sid = (window.crypto && window.crypto.randomUUID)
        ? window.crypto.randomUUID()
        : 's' + Date.now() + Math.random().toString(36).slice(2, 10);
      try { sessionStorage.setItem(SESSION_KEY, sid); } catch (e) {}
    }
    return sid;
  }

  function getUtm() {
    var result = {};
    try {
      var params = new URLSearchParams(window.location.search);
      UTM_KEYS.forEach(function (key) {
        var value = clean(params.get(key));
        if (value) result[key] = value.toLowerCase();
      });
    } catch (e) {}
    return result;
  }

  function getReferrer() {
    if (!document.referrer) return { origin: '', host: '', external: false };
    try {
      var ref = new URL(document.referrer);
      var external = ref.host !== window.location.host;
      return {
        origin: external ? cleanOrigin(ref) : '',
        host: external ? clean(ref.hostname.toLowerCase()) : '',
        external: external
      };
    } catch (e) {
      return { origin: '', host: '', external: false };
    }
  }

  function inferSource(utm, referrer) {
    if (utm.utm_source) return utm.utm_source;
    var host = referrer.host || '';
    if (/blog\.naver\.com$/.test(host)) return 'naver_blog';
    if (/search\.naver\.com$/.test(host)) return 'naver_search';
    if (/instagram\.com$/.test(host)) return 'instagram';
    if (/kakao\.com$/.test(host)) return 'kakao_channel';
    if (/google\./.test(host)) return 'google_search';
    return host || 'direct';
  }

  function inferMedium(source, utm) {
    if (utm.utm_medium) return utm.utm_medium;
    if (source === 'naver_search' || source === 'google_search') return 'organic_search';
    if (source === 'naver_blog') return 'organic_blog';
    if (source === 'instagram') return 'organic_social';
    if (source === 'kakao_channel') return 'owned_messaging';
    return source === 'direct' ? 'none' : 'referral';
  }

  function sourceLabel(source) {
    var labels = {
      naver_blog: '네이버 블로그',
      naver_search: '네이버 검색',
      naver_place: '네이버 플레이스',
      instagram: '인스타그램',
      kakao_channel: '카카오톡 채널',
      google_search: '구글 검색',
      offline_qr: '오프라인 QR',
      direct: '직접 방문'
    };
    return labels[source] || source || '직접 방문';
  }

  function makeTouch(utm, referrer) {
    var source = inferSource(utm, referrer);
    return {
      source: source,
      sourceLabel: sourceLabel(source),
      medium: inferMedium(source, utm),
      campaign: utm.utm_campaign || '',
      content: utm.utm_content || '',
      referrerOrigin: referrer.origin || '',
      landingPath: cleanPath(window.location.pathname || '/'),
      capturedAt: new Date().toISOString()
    };
  }

  function isExpired(state) {
    if (!state) return true;
    var expires = Date.parse(state.expiresAt || '');
    if (expires) return Date.now() >= expires;
    var firstCaptured = Date.parse(state.firstTouch && state.firstTouch.capturedAt || '');
    return !firstCaptured || Date.now() - firstCaptured >= ATTR_TTL_MS;
  }

  function clearExpiredState() {
    try {
      localStorage.removeItem(ATTR_KEY);
      localStorage.removeItem(LEGACY_FIRST_KEY);
      localStorage.removeItem(EVENT_KEY);
    } catch (e) {}
  }

  function readState() {
    var state = readJson(ATTR_KEY, null);
    if (isExpired(state)) {
      if (state) clearExpiredState();
      return null;
    }
    return state;
  }

  function capture() {
    /* 이전 버전이 남긴 상담 PII 임시함은 추적과 분리하고 즉시 제거한다. */
    try { localStorage.removeItem(LEGACY_PII_KEY); } catch (e) {}
    var utm = getUtm();
    var referrer = getReferrer();
    var touch = makeTouch(utm, referrer);
    var state = readState();
    var hasCampaignSignal = Boolean(utm.utm_source || referrer.external);

    if (!state) {
      state = {
        version: 2,
        firstTouch: touch,
        lastTouch: touch,
        expiresAt: new Date(Date.now() + ATTR_TTL_MS).toISOString()
      };
    } else if (hasCampaignSignal) {
      state.lastTouch = touch;
    }
    state.updatedAt = new Date().toISOString();
    writeJson(ATTR_KEY, state);

    /* 구형 계산기와 이전 코드의 first-touch 계약을 유지한다. */
    if (!readJson(LEGACY_FIRST_KEY, null)) {
      writeJson(LEGACY_FIRST_KEY, {
        ref: touch.referrerOrigin,
        utm: utm,
        landing: touch.landingPath,
        t: Date.now()
      });
    }
    return state;
  }

  function leadContext() {
    var state = readState() || capture();
    var first = state.firstTouch || {};
    var last = state.lastTouch || first;
    return {
      attributionVersion: 2,
      firstSource: first.source || 'direct',
      firstMedium: first.medium || 'none',
      firstCampaign: first.campaign || '',
      firstContent: first.content || '',
      lastSource: last.source || first.source || 'direct',
      lastMedium: last.medium || first.medium || 'none',
      lastCampaign: last.campaign || '',
      lastContent: last.content || '',
      referrerOrigin: last.referrerOrigin || first.referrerOrigin || '',
      landingPath: first.landingPath || '/',
      sourceLabel: last.sourceLabel || first.sourceLabel || '직접 방문',
      sourceCode: [last.source || 'direct', last.content || 'always_on'].join('/')
    };
  }

  function track(eventName, detail) {
    var event = {
      event: clean(eventName),
      path: cleanPath(window.location.pathname || '/'),
      source: leadContext().lastSource,
      content: leadContext().lastContent,
      detail: clean(detail || ''),
      at: new Date().toISOString()
    };
    var events = readJson(EVENT_KEY, []);
    events.push(event);
    writeJson(EVENT_KEY, events.slice(-100));

    /* GA4가 사장님 승인 후 연결되면 같은 이벤트 계약을 그대로 사용한다. */
    if (typeof window.gtag === 'function') {
      window.gtag('event', event.event, {
        sb_source: event.source,
        sb_content: event.content,
        page_path: event.path
      });
    }
    try { window.dispatchEvent(new CustomEvent('sb:attribution-event', { detail: event })); } catch (e) {}
    return event;
  }

  function classifyClick(target) {
    if (!target) return '';
    var id = target.id || '';
    if (id === 'lf-submit') return 'lead_submit_click';
    if (id === 'lf-sms') return 'sms_consult_click';
    if (id === 'lf-kakao') return 'kakao_consult_click';
    if (id === 'lf-copy') return 'consult_copy_click';
    var href = target.getAttribute && target.getAttribute('href');
    if (!href) return '';
    if (href.indexOf('blog.naver.com') !== -1) return 'outbound_naver_blog';
    if (href.indexOf('instagram.com') !== -1) return 'outbound_instagram';
    if (href.indexOf('pf.kakao.com') !== -1) return 'outbound_kakao';
    if (href.indexOf('tel:') === 0) return 'phone_click';
    return '';
  }

  var state = capture();
  var sid = getSessionId();
  window.SB = {
    sid: sid,
    first: readJson(LEGACY_FIRST_KEY, {}),
    attribution: state,
    getLeadContext: leadContext,
    track: track
  };

  document.addEventListener('click', function (event) {
    var target = event.target && event.target.closest ? event.target.closest('a,button') : null;
    var eventName = classifyClick(target);
    if (eventName) track(eventName, target && (target.id || target.textContent));
  }, { passive: true });

  /* 정적 호스팅이 아닌 환경에서만 1차 수집 API를 사용한다. */
  if (!window.SB_STATIC) {
    var payload = JSON.stringify({ sid: sid, path: window.location.pathname, attribution: leadContext() });
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', new Blob([payload], { type: 'application/json' }));
    } else if (window.fetch) {
      window.fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true
      }).catch(function () {});
    }
  }
})();
