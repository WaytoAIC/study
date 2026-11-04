import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../slides/auth.js', import.meta.url), 'utf8');
const copy = value => JSON.parse(JSON.stringify(value));
const flush = async () => { for (let i = 0; i < 16; i++) await Promise.resolve(); };
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};

function waStub({ status = 'user', fetch, ready = Promise.resolve(), authReady = Promise.resolve() } = {}) {
  let current = { status, nickname: status === 'user' ? 'learner' : '', email: 'learner@example.test' };
  const calls = [], logins = [], listeners = [];
  let signOuts = 0;
  const WA = {
    ready,
    auth: {
      ready: authReady,
      state: () => current,
      user: () => current.status === 'user' ? { id: 'user-42', email: current.email } : null,
      fetch: (path, options) => {
        calls.push([path, copy(options)]);
        return fetch ? fetch(path, options) : Promise.resolve([]);
      },
      openLoginModal: options => { logins.push(copy(options)); },
      signOut: () => { signOuts++; return Promise.resolve(); },
      onChange: fn => { listeners.push(fn); return () => listeners.splice(listeners.indexOf(fn), 1); }
    }
  };
  return {
    WA, calls, logins,
    get signOuts() { return signOuts; },
    change(next) { current = next; listeners.forEach(fn => fn(next)); }
  };
}

function harness({ WA, cookie = '', storage = {}, hostname = 'study.waytoaic.com', lang = 'zh', blockedStorage = false, failAppend = false } = {}) {
  let now = 0, timerId = 0;
  const timers = new Map(), values = new Map(Object.entries(storage));
  const appended = [], alerts = [], accesses = [], writes = [];
  const document = {
    get cookie() { accesses.push(context.WA_AUTH_ADAPTER); return cookie; },
    head: { appendChild(el) {
      accesses.push(context.WA_AUTH_ADAPTER);
      if (failAppend) throw new Error('script blocked');
      appended.push(el);
    } },
    createElement: tag => ({ tagName: tag, style: {} }),
    getElementById: id => appended.find(el => el.id === id) || null
  };
  const context = {
    WA, document,
    location: { hostname, pathname: '/slides/learn.html' },
    XUEAI_I18N: { lang },
    localStorage: {
      getItem(key) {
        accesses.push(context.WA_AUTH_ADAPTER);
        if (blockedStorage) throw new Error('storage blocked');
        return values.get(key) ?? null;
      },
      setItem(key, value) { if (blockedStorage) throw new Error('storage blocked'); writes.push([key, value]); values.set(key, value); },
      removeItem(key) { throw new Error('adapter must not remove ' + key); }
    },
    alert: text => alerts.push(text),
    setTimeout(fn, delay) { const id = ++timerId; timers.set(id, { fn, at: now + delay }); return id; },
    clearTimeout: id => timers.delete(id),
    Date: class extends Date { constructor() { super('2026-11-05T12:34:56.000Z'); } }
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(source, context, { filename: 'slides/auth.js' });
  return {
    context, document, appended, alerts, values, accesses, writes, timers,
    adapter: context.XueaiAuth,
    async advance(ms) {
      const end = now + ms;
      await flush();
      for (;;) {
        const next = [...timers].filter(([, t]) => t.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
        if (!next) break;
        now = next[1].at;
        timers.delete(next[0]);
        next[1].fn();
        await flush();
      }
      now = end;
      await flush();
    }
  };
}

function slot() {
  const nodes = {};
  return {
    innerHTML: '',
    querySelector(selector) { return nodes[selector] ||= { textContent: '', onclick: null }; }
  };
}

const legacy = JSON.stringify({ user: { id: 'old-user', email: 'old.learner@example.test' } });

test('public contract and adapter flag precede storage, cookies and script injection', () => {
  const h = harness();
  assert.equal(source.split('\n')[0], 'window.WA_AUTH_ADAPTER = true;');
  assert.deepEqual(Object.keys(h.adapter).sort(), [
    'ready', 'state', 'isFree', 'openLoginModal', 'openGroupModal', 'mount', 'getProgress', 'pushProgress'
  ].sort());
  assert.equal(typeof Object.getOwnPropertyDescriptor(h.adapter, 'state').get, 'function');
  assert.ok(h.accesses.length > 0 && h.accesses.every(Boolean));
  assert.doesNotThrow(() => h.adapter.openGroupModal());
});

for (const [name, options, nickname] of [
  ['cookie', { cookie: 'other=1; wa_rt=refresh-cookie' }, ''],
  ['legacy session', { storage: { wa_session_v1: legacy } }, 'old.learner'],
  ['paywall flag', { storage: { xa_auth: '1' } }, ''],
  ['malformed legacy session', { storage: { wa_session_v1: '{bad', xa_auth: '1' } }, '']
]) {
  test('synchronous loggedIn from ' + name, () => {
    const h = harness(options);
    assert.deepEqual(copy(h.adapter.state), { loggedIn: true, nickname });
    assert.deepEqual(h.writes, []);
  });
}

test('no clues stay anonymous; blocked storage still allows cookie detection', () => {
  assert.deepEqual(copy(harness().adapter.state), { loggedIn: false, nickname: '' });
  assert.equal(harness({ cookie: 'wa_rt=value', blockedStorage: true }).adapter.state.loggedIn, true);
  assert.equal(harness({ cookie: 'not_wa_rt=value; wa_rt=', blockedStorage: true }).adapter.state.loggedIn, false);
});

test('ready waits for WA.ready then auth.ready; onChange syncs state and paywall flag', async () => {
  const waReady = deferred(), authReady = deferred();
  const wa = waStub({ ready: waReady.promise, authReady: authReady.promise });
  const h = harness({ WA: wa.WA });
  let resolved = false;
  h.adapter.ready.then(() => { resolved = true; });
  await flush();
  assert.equal(resolved, false);
  waReady.resolve();
  await flush();
  assert.equal(resolved, false);
  authReady.resolve();
  assert.deepEqual(copy(await h.adapter.ready), { loggedIn: true, nickname: 'learner' });
  assert.equal(h.values.get('xa_auth'), '1');
  assert.equal(h.timers.size, 0);
  wa.change({ status: 'anon' });
  assert.deepEqual(copy(h.adapter.state), { loggedIn: false, nickname: '' });
  assert.equal(h.values.get('xa_auth'), '0');
  wa.change({ status: 'user', email: 'another@example.test' });
  assert.deepEqual(copy(h.adapter.state), { loggedIn: true, nickname: 'another' });
  assert.equal(h.values.get('xa_auth'), '1');
});

test('ready reads authoritative anonymous status without clearing the existing flag on startup', async () => {
  const h = harness({ WA: waStub({ status: 'anon' }).WA, storage: { xa_auth: '1' } });
  assert.equal(h.adapter.state.loggedIn, true);
  assert.equal((await h.adapter.ready).loggedIn, false);
  assert.equal(h.values.get('xa_auth'), '1');
});

for (const kind of ['no WA', 'WA.ready hangs', 'auth.ready hangs', 'auth missing']) {
  test('4 second deadline preserves session, flag and progress when ' + kind, async () => {
    const never = new Promise(() => {});
    const wa = kind === 'no WA' ? undefined : waStub({
      ready: kind === 'WA.ready hangs' ? never : Promise.resolve(),
      authReady: kind === 'auth.ready hangs' ? never : Promise.resolve()
    }).WA;
    if (kind === 'auth missing') delete wa.auth;
    const stored = { wa_session_v1: legacy, xa_auth: '1', ai_course_progress_v1: '{"lesson.html":1}' };
    const h = harness({ WA: wa, storage: stored });
    let resolved = false;
    h.adapter.ready.then(() => { resolved = true; });
    await h.advance(3999);
    assert.equal(resolved, false);
    await h.advance(1);
    assert.equal(resolved, true);
    assert.deepEqual(copy(await h.adapter.ready), { loggedIn: true, nickname: 'old.learner' });
    assert.deepEqual(Object.fromEntries(h.values), stored);
    await h.advance(30000);
    assert.equal(h.timers.size, 0);
    assert.deepEqual(copy(await h.adapter.getProgress()), { ok: false, progress: {} });
    await h.adapter.pushProgress({ 'lesson.html': 1 });
  });
}

for (const stage of ['WA.ready', 'auth.ready', 'script', 'append']) {
  test('ready resolves safely after failure in ' + stage, async () => {
    const failure = deferred();
    const WA = stage.endsWith('ready') ? waStub({
      ready: stage === 'WA.ready' ? failure.promise : Promise.resolve(),
      authReady: stage === 'auth.ready' ? failure.promise : Promise.resolve()
    }).WA : undefined;
    const h = harness({ WA, failAppend: stage === 'append', storage: { xa_auth: '1' } });
    if (stage === 'script') h.appended[0].onerror();
    else if (stage.endsWith('ready')) failure.reject(new Error('unavailable'));
    assert.equal((await h.adapter.ready).loggedIn, true);
    assert.equal(h.values.get('xa_auth'), '1');
    assert.equal(h.timers.size, 0);
  });
}

test('WA may arrive asynchronously; late auth completion after timeout cannot clear initial state', async () => {
  const h = harness({ storage: { xa_auth: '1' } });
  await h.advance(200);
  h.context.WA = waStub().WA;
  await h.advance(100);
  assert.equal((await h.adapter.ready).nickname, 'learner');

  const delayed = deferred();
  const late = harness({ WA: waStub({ status: 'anon', authReady: delayed.promise }).WA, storage: { xa_auth: '1' } });
  await late.advance(4000);
  delayed.resolve();
  await flush();
  assert.equal(late.adapter.state.loggedIn, true);
  assert.equal(late.values.get('xa_auth'), '1');
});

test('shared script arriving after the 4 second deadline still syncs progress', async () => {
  const paths = [];
  const h = harness({ storage: { wa_session_v1: legacy, xa_auth: '1' } });
  await h.advance(4000);
  await h.adapter.ready;
  h.context.WA = waStub({ fetch: path => { paths.push(path); return Promise.resolve([]); } }).WA;
  await h.advance(100);
  await flush();
  assert.equal((await h.adapter.getProgress()).ok, true);
  assert.equal(paths.length, 2);
});

test('script loader matches nav version; only localhost honors wa_ui_src', () => {
  for (const hostname of ['localhost', '127.0.0.1', 'study.waytoaic.com']) {
    const h = harness({ hostname, storage: { wa_ui_src: '/local/waytoaic-ui.js' } });
    assert.equal(h.appended[0].src, hostname === 'study.waytoaic.com'
      ? 'https://www.waytoaic.com/ui/v1/waytoaic-ui.js?v=20261105' : '/local/waytoaic-ui.js');
    assert.equal(h.appended[0].async, true);
  }
  assert.equal(harness({ WA: waStub().WA }).appended.length, 0);
});

test('getProgress preserves original queries, filters done and maps profile.__last', async () => {
  const wa = waStub({ fetch: path => Promise.resolve(path.includes('/progress?') ? [
    { lesson_file: 'done.html', done: true }, { lesson_file: 'pending.html', done: false },
    { lesson_file: 'also-done.html', done: 1 }
  ] : [{ last_file: 'pending.html' }]) });
  const h = harness({ WA: wa.WA });
  await h.adapter.ready;
  assert.deepEqual(copy(await h.adapter.getProgress()), {
    ok: true, progress: { 'done.html': 1, 'also-done.html': 1, __last: 'pending.html' }
  });
  assert.deepEqual(wa.calls, [
    ['/rest/v1/progress?select=lesson_file,done', { auth: true, method: 'GET' }],
    ['/rest/v1/profile?select=last_file', { auth: true, method: 'GET' }]
  ]);
  const empty = harness({ WA: waStub({ fetch: () => Promise.resolve(null) }).WA });
  await empty.adapter.ready;
  assert.deepEqual(copy(await empty.adapter.getProgress()), { ok: true, progress: {} });
});

test('pushProgress preserves original bodies, paths, timestamp and Prefer values', async () => {
  const wa = waStub();
  const h = harness({ WA: wa.WA });
  await h.adapter.ready;
  await h.adapter.pushProgress({ 'one.html': 1, 'two.html': true, 'skip.html': 0, __last: 'two.html' });
  assert.deepEqual(wa.calls, [
    ['/rest/v1/progress', { auth: true, method: 'POST', prefer: 'resolution=merge-duplicates', body: [
      { user_id: 'user-42', lesson_file: 'one.html' }, { user_id: 'user-42', lesson_file: 'two.html' }
    ] }],
    ['/rest/v1/profile', { auth: true, method: 'POST', prefer: 'resolution=merge-duplicates', body: [
      { user_id: 'user-42', updated_at: '2026-11-05T12:34:56.000Z', last_file: 'two.html' }
    ] }]
  ]);
  wa.calls.length = 0;
  await h.adapter.pushProgress({ 'skip.html': false });
  assert.deepEqual(wa.calls, [
    ['/rest/v1/profile', { auth: true, method: 'POST', prefer: 'resolution=merge-duplicates', body: [
      { user_id: 'user-42', updated_at: '2026-11-05T12:34:56.000Z' }
    ] }]
  ]);
});

test('anonymous and missing user skip progress requests; push request failures stay silent', async () => {
  const wa = waStub({ status: 'anon' });
  const h = harness({ WA: wa.WA });
  await h.adapter.ready;
  assert.deepEqual(copy(await h.adapter.getProgress()), { ok: false, progress: {} });
  await h.adapter.pushProgress({ 'one.html': 1 });
  assert.deepEqual(wa.calls, []);
  wa.change({ status: 'user', nickname: 'learner' });
  wa.WA.auth.user = () => null;
  await h.adapter.pushProgress({ 'one.html': 1 });
  assert.deepEqual(wa.calls, []);
  const failing = harness({ WA: waStub({ fetch: () => Promise.reject(new Error('offline')) }).WA });
  await failing.adapter.ready;
  await assert.doesNotReject(failing.adapter.pushProgress({ 'one.html': 1 }));
});

test('isFree keeps no-course, prologue, freeAll and first-two-per-part rules', () => {
  const h = harness();
  assert.equal(h.adapter.isFree('unknown.html'), true);
  const topic = files => ({ lessons: files.map(file => ({ file })) });
  h.context.COURSE = { parts: [
    { prologue: true, topics: [topic(['p1', 'p2', 'p3'])] },
    { freeAll: true, topics: [topic(['f1', 'f2', 'f3'])] },
    { topics: [topic(['a1']), topic(['a2', 'a3'])] },
    { topics: [topic(['b1', 'b2', 'b3'])] }
  ] };
  for (const file of ['p3', 'f3', 'a1', 'a2', 'b1', 'b2']) assert.equal(h.adapter.isFree(file), true);
  for (const file of ['a3', 'b3', 'unknown']) assert.equal(h.adapter.isFree(file), false);
});

for (const [lang, login, logout] of [['zh', '登录', '退出'], ['en', 'Sign in', 'Sign out'], ['ko', '로그인', '로그아웃']]) {
  test('mount preserves DOM, CSS and button delegation in ' + lang, async () => {
    for (const status of ['user', 'anon']) {
      const wa = waStub({ status });
      const h = harness({ WA: wa.WA, lang });
      const el = slot();
      h.adapter.mount(el);
      h.adapter.mount(null);
      await h.adapter.ready;
      await flush();
      if (status === 'user') {
        assert.equal(el.innerHTML, '<span class="wa-userchip"><span class="wa-nick"></span><button class="wa-linkbtn" id="waLogout">' + logout + '</button></span>');
        assert.equal(el.querySelector('.wa-nick').textContent, 'learner');
        await el.querySelector('#waLogout').onclick();
        assert.equal(wa.signOuts, 1);
      } else {
        assert.equal(el.innerHTML, '<button class="wa-loginbtn" id="waLogin">' + login + '</button>');
        el.querySelector('#waLogin').onclick();
        assert.deepEqual(wa.logins, [{ reason: 'lock' }]);
      }
      const css = h.document.getElementById('wa-auth-css').textContent;
      assert.ok(css.includes('.wa-userchip') && css.includes('.wa-nick') && css.includes('.wa-linkbtn') && css.includes('.wa-loginbtn'));
      assert.equal(css.includes('wa-modal'), false);
    }
  });
}

test('openLoginModal forwards next/reason and handles unavailable or rejected services in three languages', async () => {
  const wa = waStub();
  const h = harness({ WA: wa.WA });
  await h.adapter.ready;
  await h.adapter.openLoginModal('/slides/learn.html#one.html');
  assert.deepEqual(wa.logins, [{ next: '/slides/learn.html#one.html', reason: 'lock' }]);
  wa.WA.auth.openLoginModal = () => Promise.reject(new Error('script unavailable'));
  await assert.doesNotReject(Promise.resolve(h.adapter.openLoginModal()));
  assert.equal(h.alerts.length, 1);
  wa.WA.auth.openLoginModal = () => { throw new Error('unavailable'); };
  assert.doesNotThrow(() => h.adapter.openLoginModal());
  assert.equal(h.alerts.length, 2);
  for (const [lang, message] of [
    ['zh', '登录服务暂时不可用，请稍后再试'],
    ['en', 'Sign-in service is temporarily unavailable, try again later'],
    ['ko', '로그인 서비스를 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해 주세요']
  ]) {
    const unavailable = harness({ lang });
    assert.doesNotThrow(() => unavailable.adapter.openLoginModal('/next'));
    assert.deepEqual(unavailable.alerts, [message]);
    assert.deepEqual(copy(await unavailable.adapter.getProgress()), { ok: false, progress: {} });
    await unavailable.adapter.pushProgress({ 'one.html': 1 });
  }
});

const navSource = readFileSync(new URL('../slides/nav-inject.js', import.meta.url), 'utf8');
const homeSource = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const navCount = navSource.slice(navSource.indexOf('// ── WaytoAIC 访问人数'), navSource.indexOf('// ── WaytoAIC 知识点关联网络'));
const homeCount = '(function(){' + homeSource.slice(homeSource.indexOf('  /* 学习人数'), homeSource.indexOf('  if(!window.COURSE) return;')) + '})();';

function counterHarness(kind, privacy = {}) {
  let now = 0, nextId = 0;
  const calls = [], intervals = [], timers = new Map(), events = {}, elements = {};
  const context = {
    navigator: privacy,
    document: {
      visibilityState: 'visible',
      getElementById: id => elements[id] ||= { hidden: true, appendChild: () => {} },
      createElement: () => ({ style: {} }),
      addEventListener: (type, fn) => { events[type] = fn; }
    },
    location: { origin: 'https://study.waytoaic.com' },
    I18N: { lang: 'en' }, EMBED_MODE: false,
    localStorage: { getItem: () => 'abcdef0123456789abcdef0123456789', setItem: () => {} },
    fetch: (url, options) => {
      calls.push([url, copy(options)]);
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ total: 12, month: 3, today: 1, live: 2 }) });
    },
    setTimeout(fn, delay) { const id = ++nextId; timers.set(id, { fn, at: now + delay }); return id; },
    setInterval: (fn, delay) => { intervals.push({ fn, delay }); }
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(kind === 'nav' ? navCount : homeCount, context);
  return {
    context, calls, intervals, timers, events, elements,
    async advance(ms) {
      const end = now + ms;
      for (;;) {
        const next = [...timers].filter(([, t]) => t.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
        if (!next) break;
        now = next[1].at;
        timers.delete(next[0]);
        next[1].fn();
        await flush();
      }
      now = end;
      await flush();
    }
  };
}

for (const kind of ['nav', 'home']) {
  test(kind + ' counters wait for WA.ready and read config before requests or intervals', async () => {
    const h = counterHarness(kind), gate = deferred();
    const config = { supabaseUrl: 'https://backend.example.test', supabaseAnonKey: 'public-test-key' };
    h.context.WA_CONFIG = config;
    await h.advance(200);
    assert.deepEqual(h.calls, []);
    h.context.WA = { ready: gate.promise };
    await h.advance(100);
    assert.deepEqual(h.calls, []);
    gate.resolve();
    await flush();
    assert.deepEqual(h.calls.map(([url]) => url), kind === 'nav' ? [
      'https://backend.example.test/rest/v1/rpc/pv_hit', 'https://backend.example.test/rest/v1/rpc/pv_ping'
    ] : ['https://backend.example.test/rest/v1/rpc/pv_stats']);
    for (const [, options] of h.calls) {
      assert.equal(options.method, 'POST');
      assert.deepEqual(options.headers, { apikey: 'public-test-key', 'Content-Type': 'application/json' });
      assert.deepEqual(JSON.parse(options.body), kind === 'nav' ? { vid: 'abcdef0123456789abcdef0123456789' } : {});
    }
    assert.equal(h.intervals.length, 1);
    assert.equal(h.intervals[0].delay, 60000);
    const requests = h.calls.length;
    h.context.document.visibilityState = 'hidden';
    h.intervals[0].fn();
    assert.equal(h.calls.length, requests);
    if (kind === 'home') assert.equal(h.elements.live.hidden, false);
    else {
      h.context.document.visibilityState = 'visible';
      h.events.visibilitychange();
      assert.equal(h.calls.length, requests + 1);
    }
  });

  test(kind + ' counters silently skip absent/incomplete config, rejected ready or missing WA after 10s', async () => {
    for (const config of [undefined, {}, { supabaseUrl: 'https://backend.example.test' }, { supabaseAnonKey: 'public-test-key' }]) {
      const h = counterHarness(kind);
      h.context.WA = { ready: Promise.resolve() };
      h.context.WA_CONFIG = config;
      await h.advance(100);
      assert.deepEqual(h.calls, []);
      assert.deepEqual(h.intervals, []);
    }
    const rejected = counterHarness(kind), gate = deferred();
    rejected.context.WA = { ready: gate.promise };
    await rejected.advance(100);
    gate.reject(new Error('config unavailable'));
    await flush();
    assert.deepEqual(rejected.calls, []);
    const absent = counterHarness(kind);
    await absent.advance(10000);
    assert.equal(absent.timers.size, 0);
    assert.deepEqual(absent.calls, []);
    assert.deepEqual(absent.intervals, []);
  });
}

test('nav DNT/GPC gates all visitor requests, timers and heartbeat setup', async () => {
  for (const privacy of [{ doNotTrack: '1' }, { msDoNotTrack: '1' }, { globalPrivacyControl: true }]) {
    const h = counterHarness('nav', privacy);
    h.context.WA = { ready: Promise.resolve() };
    h.context.WA_CONFIG = { supabaseUrl: 'https://backend.example.test', supabaseAnonKey: 'public-test-key' };
    await h.advance(10000);
    assert.deepEqual(h.calls, []);
    assert.deepEqual(h.intervals, []);
    assert.equal(h.timers.size, 0);
  }
});
