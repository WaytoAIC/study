window.WA_AUTH_ADAPTER = true;
/**
 * auth.js — 学习站 XueaiAuth 兼容适配层。
 * WA.auth 统一负责会话迁移、登录、退出与 REST 请求；本层保留同步登录态、
 * xa_auth 登录墙标记、三语挂载按钮、免费节口径与原有云端进度协议。
 * 共享脚本不可用时 ready 最多等待 4 秒，保留已有登录线索与解锁标记。
 * 对外契约：ready、state（getter）、isFree、openLoginModal、openGroupModal、
 * mount、getProgress、pushProgress。
 */
(function(){
  'use strict';

  var _lang = (window.XUEAI_I18N && window.XUEAI_I18N.lang)
    || (location.pathname.match(/\.en\.html?$/) ? 'en'
       : location.pathname.match(/\.ko\.html?$/) ? 'ko' : 'zh');
  var _T = {
    zh: { login:'登录', logout:'退出', errSvc:'登录服务暂时不可用，请稍后再试' },
    en: { login:'Sign in', logout:'Sign out', errSvc:'Sign-in service is temporarily unavailable, try again later' },
    ko: { login:'로그인', logout:'로그아웃', errSvc:'로그인 서비스를 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해 주세요' }
  };
  var T = _T[_lang] || _T.zh;

  /* learn*.html 同步读取 state，不能等共享脚本或会话迁移。只读旧会话。 */
  var state = { loggedIn: false, nickname: '' };
  try{ state.loggedIn = /(?:^|;\s*)wa_rt=([^;]+)/.test(document.cookie || ''); }catch(e){}
  try{
    var legacy = localStorage.getItem('wa_session_v1');
    if(legacy){
      state.loggedIn = true;
      var saved = JSON.parse(legacy);
      state.nickname = ((saved && saved.user && saved.user.email) || '').split('@')[0];
    }
  }catch(e){}
  try{ if(localStorage.getItem('xa_auth') === '1') state.loggedIn = true; }catch(e){}

  /* xa_auth：给 paywall.js 与内容页 head 内联脚本用的登录标记（同源共享） */
  function setPaywallFlag(on){
    try{ localStorage.setItem('xa_auth', on ? '1' : '0'); }catch(e){}
  }

  var auth = null;
  function syncState(changed){
    var current = auth.state();
    state.loggedIn = current.status === 'user';
    state.nickname = state.loggedIn ? (current.nickname || (current.email || '').split('@')[0]) : '';
    if(state.loggedIn || changed) setPaywallFlag(state.loggedIn);
  }

  /* ready 最多等 4 秒，失败保留同步初值；共享脚本来晚了（30 秒内）照样接上，后面的进度同步不丢。 */
  var ready = new Promise(function(resolve){
    var settled = false, poll, tries = 0;
    var timeout = setTimeout(finish, 4000);
    function finish(){
      if(settled) return;
      settled = true;
      clearTimeout(timeout);
      resolve(state);
    }
    function giveUp(){ tries = 300; clearTimeout(poll); finish(); }
    function waitAuth(){
      var candidate = window.WA && window.WA.auth;
      if(!candidate || !candidate.ready){ if(++tries < 300) poll = setTimeout(waitAuth, 100); return; }
      Promise.resolve(candidate.ready).then(function(){
        auth = candidate;
        // 超时后才到的「匿名」不改同步初值：已展示的登录态不倒退，下次打开页面再校正
        if(!settled || auth.state().status === 'user') syncState(false);
        auth.onChange(function(){ try{ syncState(true); }catch(e){} });
        finish();
      }).catch(function(){ auth = null; finish(); });
    }
    function waitWA(){
      if(!window.WA || !window.WA.ready){ if(++tries < 300) poll = setTimeout(waitWA, 100); return; }
      Promise.resolve(window.WA.ready).then(waitAuth).catch(finish);
    }
    if(!window.WA){
      try{
        var dev = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
        var override = dev ? localStorage.getItem('wa_ui_src') : null;
        var script = document.createElement('script');
        script.src = override || 'https://www.waytoaic.com/ui/v1/waytoaic-ui.js?v=20261105';
        script.async = true;
        script.onerror = giveUp;
        document.head.appendChild(script);
      }catch(e){ giveUp(); }
    }
    waitWA();
  });

  function req(path, opts){
    opts = opts || {};
    return auth.fetch(path, { auth:true, method:opts.method || 'GET', body:opts.body, prefer:opts.prefer });
  }

  /* ── 进度同步（契约与上游 /auth/progress 对齐：{file:1,...,__last}） ── */
  function getProgress(){
    if(!state.loggedIn || !auth) return Promise.resolve({ ok:false, progress:{} });
    var rows = req('/rest/v1/progress?select=lesson_file,done', { auth:true });
    var prof = req('/rest/v1/profile?select=last_file', { auth:true });
    return Promise.all([rows, prof]).then(function(rs){
      var progress = {};
      (rs[0] || []).forEach(function(row){ if(row.done) progress[row.lesson_file] = 1; });
      if(rs[1] && rs[1][0] && rs[1][0].last_file) progress.__last = rs[1][0].last_file;
      return { ok:true, progress: progress };
    });
  }

  function pushProgress(progressMap){
    if(!state.loggedIn || !auth) return Promise.resolve();
    var user = auth.user();
    if(!user || !user.id) return Promise.resolve();
    var uid = user.id;
    var rows = Object.keys(progressMap || {})
      .filter(function(k){ return k !== '__last' && progressMap[k]; })
      .map(function(k){ return { user_id: uid, lesson_file: k }; });
    var jobs = [];
    if(rows.length){
      jobs.push(req('/rest/v1/progress', { method:'POST', auth:true, prefer:'resolution=merge-duplicates', body: rows }));
    }
    var prof = { user_id: uid, updated_at: new Date().toISOString() };
    if(progressMap && progressMap.__last) prof.last_file = progressMap.__last;
    jobs.push(req('/rest/v1/profile', { method:'POST', auth:true, prefer:'resolution=merge-duplicates', body: [prof] }));
    return Promise.all(jobs).catch(function(){});
  }

  /* 挂载按钮沿用原 DOM、class 与三语文案。 */
  var CSS = [
    '.wa-userchip{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:700;}',
    '.wa-userchip .wa-nick{max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
    '.wa-linkbtn{background:none;border:none;color:var(--accent,#0066ff);cursor:pointer;font-size:13px;font-weight:700;padding:0;}',
    '.wa-loginbtn{background:var(--accent,#0066ff);color:#fff;border:none;border-radius:10px;padding:8px 16px;font-size:13px;font-weight:800;cursor:pointer;}'
  ].join('\n');
  function injectCss(){
    if(document.getElementById('wa-auth-css')) return;
    var st = document.createElement('style');
    st.id = 'wa-auth-css'; st.textContent = CSS;
    document.head.appendChild(st);
  }

  function openLoginModal(next){
    try{
      if(auth) return Promise.resolve(auth.openLoginModal({ next:next, reason:'lock' })).catch(serviceUnavailable);
    }catch(e){}
    serviceUnavailable();
  }
  function serviceUnavailable(){
    try{ window.alert(T.errSvc); }catch(e){}
  }
  function logout(){
    try{ if(auth) return Promise.resolve(auth.signOut()).catch(function(){}); }catch(e){}
  }

  function mount(slot){
    if(!slot) return;
    injectCss();
    ready.then(function(){
      if(state.loggedIn){
        slot.innerHTML = '<span class="wa-userchip"><span class="wa-nick"></span>' +
          '<button class="wa-linkbtn" id="waLogout">' + T.logout + '</button></span>';
        slot.querySelector('.wa-nick').textContent = state.nickname;
        slot.querySelector('#waLogout').onclick = logout;
      }else{
        slot.innerHTML = '<button class="wa-loginbtn" id="waLogin">' + T.login + '</button>';
        slot.querySelector('#waLogin').onclick = function(){ openLoginModal(); };
      }
    });
  }

  /* ── 登录墙：免费节集合（prologue 篇章整章 + 其余篇章前 2 节） ── */
  var _freeSet = null;
  function buildFreeSet(){
    _freeSet = {};
    var C = window.COURSE;
    if(!C || !C.parts) return;
    C.parts.forEach(function(part){
      var files = [];
      (part.topics || []).forEach(function(t){
        (t.lessons || []).forEach(function(l){ if(l && l.file) files.push(l.file); });
      });
      var freeAll = !!part.prologue || !!part.freeAll;
      files.forEach(function(f, i){ if(freeAll || i < 2) _freeSet[f] = 1; });
    });
  }

  window.XueaiAuth = {
    ready: ready,
    get state(){ return state; },
    isFree: function(file){
      if(!window.COURSE) return true;   /* 无课程数据的页面（证书/考试壳）不拦 */
      if(_freeSet === null) buildFreeSet();
      return !!_freeSet[file];
    },
    openLoginModal: openLoginModal,
    openGroupModal: function(){},
    mount: mount,
    getProgress: getProgress,
    pushProgress: pushProgress
  };
})();
