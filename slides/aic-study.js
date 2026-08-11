/* aic-study.js —— WaytoAIC「学-讲-练」页共享交互
   1) .aic-opt 点开揭晓卡
   2) .aic-feynman 对照要点展开
   3) .aic-check 练习清单勾选（localStorage 按页持久） */
(function(){
  'use strict';
  var PAGE = location.pathname.split('/').pop().replace(/\.html.*/, '');

  function init(){
    document.querySelectorAll('.aic-opt').forEach(function(el){
      el.addEventListener('click', function(){ el.classList.toggle('open'); });
    });

    document.querySelectorAll('.aic-feynman').forEach(function(card){
      var btn = card.querySelector('.aic-fy-check-btn');
      if(btn) btn.addEventListener('click', function(){ card.classList.toggle('open'); });
    });

    document.querySelectorAll('.aic-check').forEach(function(list, li_i){
      var key = 'aic_check_' + PAGE + '_' + li_i;
      var saved = {};
      try{ saved = JSON.parse(localStorage.getItem(key) || '{}'); }catch(e){}
      list.querySelectorAll('li').forEach(function(li, i){
        if(saved[i]) li.classList.add('done');
        li.addEventListener('click', function(){
          li.classList.toggle('done');
          saved[i] = li.classList.contains('done');
          try{ localStorage.setItem(key, JSON.stringify(saved)); }catch(e){}
        });
      });
    });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

/* ── prompt 卡复制按钮（追加于 2026-08-11） ── */
(function(){
  'use strict';
  function initPrompt(){
    document.querySelectorAll('.aic-prompt').forEach(function(card){
      var btn = card.querySelector('.aic-pm-copy');
      var pre = card.querySelector('pre');
      if(!btn || !pre) return;
      btn.addEventListener('click', function(){
        var txt = pre.innerText;
        (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject())
          .then(function(){ btn.textContent = '已复制 ✓'; setTimeout(function(){ btn.textContent = '复制'; }, 1600); })
          .catch(function(){
            var ta = document.createElement('textarea');
            ta.value = txt; document.body.appendChild(ta); ta.select();
            try{ document.execCommand('copy'); btn.textContent = '已复制 ✓'; }catch(e){}
            document.body.removeChild(ta);
            setTimeout(function(){ btn.textContent = '复制'; }, 1600);
          });
      });
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initPrompt);
  else initPrompt();
})();
