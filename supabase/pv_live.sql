-- 学习站「此刻在学」计数（2026-09-19）
--
-- 在已有的 pv_visitors 表 + pv_hit(vid) 函数（按天去重的匿名访客，阅读页顶栏「访客 累计/本月/今日」）之上：
--   · 课程页在前台可见时，每 60 秒调一次 pv_ping(vid) 报心跳（slides/nav-inject.js）；
--   · 首页调 pv_stats() 读「累计来学过的人数 + 此刻在学人数」（根路径 index.html），只读、不计访问。
-- vid 与 pv_hit 是同一个匿名随机 ID（浏览器本地生成，不含任何个人信息）。
-- 表开启 RLS 且不对 anon/authenticated 授权，只能经这两个函数访问。
--
-- 应用（可重复执行）：byted-supabase-cli db query -f supabase/pv_live.sql --workspace-id <学习站工作区 waytoaic-study>

create table if not exists public.pv_live (
  visitor_id text primary key,
  last_seen  timestamptz not null default now()
);
alter table public.pv_live enable row level security;
revoke all on table public.pv_live from anon, authenticated;

create or replace function public.pv_ping(vid text)
returns void
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  if vid is null or length(vid) < 8 or length(vid) > 64 or vid !~ '^[a-f0-9]+$' then
    raise exception 'bad vid';
  end if;
  insert into public.pv_live(visitor_id, last_seen) values (vid, now())
    on conflict (visitor_id) do update set last_seen = excluded.last_seen;
  -- 表里只留近 10 分钟的心跳，报心跳时顺手清理，免定时任务
  delete from public.pv_live where last_seen < now() - interval '10 minutes';
end $function$;

-- 「此刻在学」= 近 3 分钟内有心跳（心跳 60 秒一次，容忍漏掉一两次）
create or replace function public.pv_stats()
returns json
language sql
stable
security definer
set search_path to 'public'
as $function$
  select json_build_object(
    'total', (select count(distinct visitor_id) from public.pv_visitors),
    'live',  (select count(*) from public.pv_live where last_seen > now() - interval '3 minutes')
  );
$function$;

revoke execute on function public.pv_ping(text), public.pv_stats() from public;
grant execute on function public.pv_ping(text), public.pv_stats() to anon, authenticated;

-- 让 REST 接口立刻认出新函数
notify pgrst, 'reload schema';
