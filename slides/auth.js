/**
 * auth.js — WaytoAIC 登录状态与登录 UI（learn / home / certificate / exam 共用）
 *
 * 后端：火山引擎 Supabase 独立工作区 waytoaic-study（与其他业务库完全隔离）。
 * 直连 Auth(GoTrue) 与 Data API(PostgREST) 的 REST 接口，零 SDK 依赖。
 * ANON_KEY 是设计上公开的前端钥匙，数据边界由服务端 RLS 保证（只能读写自己的行）。
 *
 * 对外契约 window.XueaiAuth（沿用上游命名，调用方不用改）：
 *   ready          Promise<state>
 *   state          {loggedIn, nickname}
 *   isFree(file)   登录墙口径（维正 2026-08-10 拍板）：prologue 篇章整章免费，
 *                  其余每篇章前 2 节免费，更多内容需注册登录。
 *                  注：站点开源，此墙是注册转化机制而非内容保密墙。
 *   openLoginModal(next)  弹出邮箱登录/注册弹窗
 *   openGroupModal()      预留，空操作
 *   mount(slotEl)  渲染 登录按钮 / 昵称+退出
 *   getProgress()  Promise<{ok, progress}>  云端进度（{file:1,...,__last}）
 *   pushProgress(progressMap)  整包上推（upsert 行 + profile.last_file）
 */
(function(){
  'use strict';

  var BASE = 'https://br-swift-pike-062ca892.supabase.aidap-global.cn-beijing.volces.com';
  var ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1wbGF0Zm9ybSIsInJvbGUiOiJhbm9uIiwiZXhwIjozNjgzNzE4MDQxfQ.OERqJGita64opa5WnjU4WjTg8nafjAeTnMUkZLwbG1U';
  var SESSION_KEY = 'wa_session_v1';

  /* ── 三语文案 ── */
  var _lang = (window.XUEAI_I18N && window.XUEAI_I18N.lang)
    || (location.pathname.match(/\.en\.html?$/) ? 'en'
       : location.pathname.match(/\.ko\.html?$/) ? 'ko' : 'zh');
  var _T = {
    zh: { login:'登录', logout:'退出', signup:'注册', email:'邮箱', password:'密码（至少 6 位）',
          title:'登录 WaytoAIC 学习站', sub:'登录后学习进度云端同步，换设备接着学。',
          toSignup:'没有账号？注册一个', toLogin:'已有账号？去登录',
          submitLogin:'登录', submitSignup:'注册并登录', close:'关闭',
          errCred:'邮箱或密码不对', errExists:'这个邮箱已经注册过了，直接登录即可',
          errWeak:'密码至少 6 位', errNet:'网络不给力，稍后再试',
          legal:'注册或登录即表示同意 <a href="/terms.html" target="_blank">《用户协议》</a>与 <a href="/privacy.html" target="_blank">《隐私政策》</a>' },
    en: { login:'Sign in', logout:'Sign out', signup:'Sign up', email:'Email', password:'Password (6+ chars)',
          title:'Sign in to WaytoAIC Study', sub:'Your learning progress syncs across devices.',
          toSignup:'No account? Sign up', toLogin:'Have an account? Sign in',
          submitLogin:'Sign in', submitSignup:'Sign up & sign in', close:'Close',
          errCred:'Wrong email or password', errExists:'Already registered — just sign in',
          errWeak:'Password needs 6+ characters', errNet:'Network error, try again',
          legal:'By signing up or in, you agree to the <a href="/terms.html" target="_blank">Terms</a> and <a href="/privacy.html" target="_blank">Privacy Policy</a>' },
    ko: { login:'로그인', logout:'로그아웃', signup:'가입', email:'이메일', password:'비밀번호(6자 이상)',
          title:'WaytoAIC Study 로그인', sub:'학습 진도가 기기 간에 동기화됩니다.',
          toSignup:'계정이 없나요? 가입하기', toLogin:'계정이 있나요? 로그인',
          submitLogin:'로그인', submitSignup:'가입 후 로그인', close:'닫기',
          errCred:'이메일 또는 비밀번호가 올바르지 않습니다', errExists:'이미 가입된 이메일입니다. 로그인해 주세요',
          errWeak:'비밀번호는 6자 이상이어야 합니다', errNet:'네트워크 오류입니다. 다시 시도해 주세요',
          legal:'가입 또는 로그인 시 <a href="/terms.html" target="_blank">이용약관</a> 및 <a href="/privacy.html" target="_blank">개인정보 처리방침</a>에 동의하는 것으로 간주됩니다' }
  };
  var T = _T[_lang] || _T.zh;

  /* ── 会话存取 ── */
  function loadSession(){
    try{ return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }catch(e){ return null; }
  }
  function saveSession(s){
    try{ s ? localStorage.setItem(SESSION_KEY, JSON.stringify(s)) : localStorage.removeItem(SESSION_KEY); }catch(e){}
  }
  function nickFromEmail(email){ return (email || '').split('@')[0] || 'WaytoAIC User'; }

  var session = loadSession();
  var state = { loggedIn: false, nickname: '' };

  /* ── HTTP 小工具 ── */
  function req(path, opts){
    opts = opts || {};
    var headers = { 'apikey': ANON, 'Content-Type': 'application/json' };
    if(opts.auth && session) headers['Authorization'] = 'Bearer ' + session.access_token;
    if(opts.prefer) headers['Prefer'] = opts.prefer;
    return fetch(BASE + path, {
      method: opts.method || 'GET',
      headers: headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined
    }).then(function(r){
      if(r.status === 204) return null;
      return r.json().catch(function(){ return null; }).then(function(d){
        if(!r.ok){ var e = new Error((d && (d.msg || d.message || d.error_description || d.error)) || ('HTTP ' + r.status)); e.status = r.status; e.body = d; throw e; }
        return d;
      });
    });
  }

  /* xa_auth：给 paywall.js 与内容页 head 内联脚本用的登录标记（同源共享） */
  function setPaywallFlag(on){
    try{ localStorage.setItem('xa_auth', on ? '1' : '0'); }catch(e){}
  }

  function setFromTokenResp(d){
    session = {
      access_token: d.access_token,
      refresh_token: d.refresh_token,
      expires_at: Date.now() + ((d.expires_in || 3600) - 60) * 1000,
      user: { id: (d.user && d.user.id) || '', email: (d.user && d.user.email) || '' }
    };
    saveSession(session);
    state.loggedIn = true;
    state.nickname = nickFromEmail(session.user.email);
    setPaywallFlag(true);
  }

  function refreshIfNeeded(){
    if(!session) return Promise.resolve();
    if(session.expires_at && session.expires_at > Date.now()) {
      state.loggedIn = true;
      state.nickname = nickFromEmail(session.user && session.user.email);
      setPaywallFlag(true);
      return Promise.resolve();
    }
    return req('/auth/v1/token?grant_type=refresh_token', { method:'POST', body:{ refresh_token: session.refresh_token } })
      .then(setFromTokenResp)
      .catch(function(){ session = null; saveSession(null); state.loggedIn = false; state.nickname = ''; setPaywallFlag(false); });
  }

  /* ── 进度同步（契约与上游 /auth/progress 对齐：{file:1,...,__last}） ── */
  function getProgress(){
    if(!state.loggedIn) return Promise.resolve({ ok:false, progress:{} });
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
    if(!state.loggedIn || !session || !session.user.id) return Promise.resolve();
    var uid = session.user.id;
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

  /* ── 登录弹窗 ── */
  var CSS = [
    '.wa-modal-mask{position:fixed;inset:0;background:rgba(15,23,42,.5);z-index:9000;display:flex;align-items:center;justify-content:center;padding:20px;}',
    '.wa-modal{background:var(--card,#fff);color:var(--text,#0f172a);border-radius:16px;max-width:400px;width:100%;padding:28px 26px;box-shadow:0 24px 64px rgba(0,0,0,.25);font-size:14px;}',
    '.wa-modal h3{font-size:19px;font-weight:800;margin:0 0 6px;}',
    '.wa-modal .wa-sub{color:var(--sub,#64748b);margin:0 0 18px;line-height:1.6;}',
    '.wa-modal label{display:block;font-weight:700;font-size:13px;margin:12px 0 5px;}',
    '.wa-modal input{width:100%;box-sizing:border-box;border:1.5px solid var(--border,#e2e8f0);border-radius:10px;padding:10px 12px;font-size:14px;background:var(--bg,#fff);color:inherit;}',
    '.wa-modal input:focus{outline:none;border-color:var(--accent,#0066ff);}',
    '.wa-err{color:#dc2626;font-size:13px;min-height:18px;margin-top:10px;}',
    '.wa-submit{width:100%;margin-top:12px;background:var(--accent,#0066ff);color:#fff;border:none;border-radius:10px;padding:11px 0;font-size:15px;font-weight:800;cursor:pointer;}',
    '.wa-submit[disabled]{opacity:.6;cursor:wait;}',
    '.wa-alt{display:block;text-align:center;margin-top:14px;color:var(--accent,#0066ff);cursor:pointer;font-size:13px;text-decoration:none;}',
    '.wa-close{position:absolute;top:14px;right:16px;background:none;border:none;font-size:20px;color:var(--sub,#94a3b8);cursor:pointer;}',
    '.wa-modal-box{position:relative;}',
    '.wa-userchip{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:700;}',
    '.wa-userchip .wa-nick{max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
    '.wa-linkbtn{background:none;border:none;color:var(--accent,#0066ff);cursor:pointer;font-size:13px;font-weight:700;padding:0;}',
    '.wa-loginbtn{background:var(--accent,#0066ff);color:#fff;border:none;border-radius:10px;padding:8px 16px;font-size:13px;font-weight:800;cursor:pointer;}',
    '.wa-legal{margin-top:14px;font-size:12px;color:var(--sub,#94a3b8);text-align:center;line-height:1.6;}',
    '.wa-legal a{color:var(--sub,#94a3b8);text-decoration:underline;}'
  ].join('\n');
  function injectCss(){
    if(document.getElementById('wa-auth-css')) return;
    var st = document.createElement('style');
    st.id = 'wa-auth-css'; st.textContent = CSS;
    document.head.appendChild(st);
  }

  function openLoginModal(){
    injectCss();
    var old = document.getElementById('waLoginMask');
    if(old) old.remove();
    var mask = document.createElement('div');
    mask.className = 'wa-modal-mask'; mask.id = 'waLoginMask';
    mask.innerHTML =
      '<div class="wa-modal wa-modal-box">' +
        '<button class="wa-close" aria-label="' + T.close + '">&times;</button>' +
        '<h3>' + T.title + '</h3>' +
        '<p class="wa-sub">' + T.sub + '</p>' +
        '<label>' + T.email + '</label><input id="waEmail" type="email" autocomplete="email">' +
        '<label>' + T.password + '</label><input id="waPass" type="password" autocomplete="current-password">' +
        '<div class="wa-err" id="waErr"></div>' +
        '<button class="wa-submit" id="waSubmit">' + T.submitLogin + '</button>' +
        '<a class="wa-alt" id="waSwitch">' + T.toSignup + '</a>' +
        '<div class="wa-legal">' + T.legal + '</div>' +
      '</div>';
    document.body.appendChild(mask);
    var mode = 'login';
    var $ = function(id){ return document.getElementById(id); };
    function setMode(m){
      mode = m;
      $('waSubmit').textContent = m === 'login' ? T.submitLogin : T.submitSignup;
      $('waSwitch').textContent = m === 'login' ? T.toSignup : T.toLogin;
      $('waErr').textContent = '';
    }
    mask.querySelector('.wa-close').onclick = function(){ mask.remove(); };
    mask.onclick = function(e){ if(e.target === mask) mask.remove(); };
    $('waSwitch').onclick = function(){ setMode(mode === 'login' ? 'signup' : 'login'); };
    $('waSubmit').onclick = function(){
      var email = $('waEmail').value.trim(), pass = $('waPass').value;
      if(!email || pass.length < 6){ $('waErr').textContent = T.errWeak; return; }
      $('waSubmit').disabled = true; $('waErr').textContent = '';
      var p = mode === 'login'
        ? req('/auth/v1/token?grant_type=password', { method:'POST', body:{ email:email, password:pass } })
        : req('/auth/v1/signup', { method:'POST', body:{ email:email, password:pass } });
      p.then(function(d){
        setFromTokenResp(d);
        location.reload();   /* 让锁课/进度同步逻辑按登录态重跑 */
      }).catch(function(e){
        $('waSubmit').disabled = false;
        var msg = String((e && e.message) || '');
        if(e && e.status === 400 && /already|registered/i.test(msg)) $('waErr').textContent = T.errExists;
        else if(e && (e.status === 400 || e.status === 401)) $('waErr').textContent = T.errCred;
        else if(/password/i.test(msg)) $('waErr').textContent = T.errWeak;
        else $('waErr').textContent = T.errNet;
      });
    };
    setTimeout(function(){ $('waEmail').focus(); }, 50);
  }

  function logout(){
    var t = session && session.access_token;
    session = null; saveSession(null);
    state.loggedIn = false; state.nickname = '';
    setPaywallFlag(false);
    if(t){ fetch(BASE + '/auth/v1/logout', { method:'POST', headers:{ 'apikey': ANON, 'Authorization': 'Bearer ' + t } }).catch(function(){}); }
    location.reload();
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

  var ready = refreshIfNeeded().then(function(){ return state; });

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
      var freeAll = !!part.prologue;
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
