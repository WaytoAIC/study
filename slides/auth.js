/**
 * auth.js — WaytoAIC 过渡版（Phase B 占位，Phase C 接火山 Supabase 时整体重写）。
 *
 * 上游原实现依赖米羊 OAuth 后端（/auth/*），含登录 UI、郑重声明弹窗、
 * 渠道推广位，均属原站品牌与服务，后端不在开源仓内，故整体置换。
 * 原实现见 upstream: https://github.com/itshen/learn-ai
 *
 * 本版契约（调用方 learn.html / home.html / certificate.html / exam-all.html）：
 *   ready        Promise<state>；立即以未登录态 resolve
 *   state        {loggedIn:false, nickname:''}
 *   isFree(file) 恒为 true —— 账号系统上线前全部课程开放，不做锁课
 *   openLoginModal / openGroupModal / mount 均为空操作
 */
(function () {
  'use strict';
  var state = { loggedIn: false, nickname: '' };
  window.XueaiAuth = {
    ready: Promise.resolve(state),
    get state() { return state; },
    isFree: function () { return true; },
    openLoginModal: function () {},
    openGroupModal: function () {},
    mount: function () {}
  };
})();
