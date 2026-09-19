// 页面顺序
const SLIDE_ORDER = [
  { file: 'llm-story.html', title: '完整目录', num: 0 },
  { file: 'roadmap.html', title: '选学习路线', num: 0 },
  { file: '0-intro.html', title: '我们在哪里', num: 0 },
  { file: '0-how.html', title: '怎样学才有效', num: 0 },
  { file: '0-why.html', title: '为什么要打基础', num: 0 },
  { file: 'learn-1.html', title: '稀缺的是什么', num: 0 },
  { file: 'learn-2.html', title: '提问结构', num: 0 },
  { file: 'learn-3.html', title: '三道防线', num: 0 },
  { file: 'learn-11.html', title: '用好 Alice', num: 0 },
  { file: 'learn-4.html', title: '拆解硬材料', num: 0 },
  { file: 'learn-5.html', title: '精读源码', num: 0 },
  { file: 'learn-6.html', title: 'AI 当出题机', num: 0 },
  { file: 'learn-7.html', title: '外部记忆', num: 0 },
  { file: 'learn-8.html', title: '三级判据', num: 0 },
  { file: 'learn-9.html', title: '三个陷阱', num: 0 },
  { file: 'learn-10.html', title: '设计一门课', num: 0 },
  { file: 'zero-0.html', title: 'AI 能干哪些神奇的活', num: 0 },
  { file: 'zero-1.html', title: '它其实在玩「接话茬」', num: 0 },
  { file: 'zero-2.html', title: '它不是搜索引擎', num: 0 },
  { file: 'zero-3.html', title: '它会一本正经地胡说', num: 0 },
  { file: 'zero-4.html', title: '把它当不了解你的新同事', num: 0 },
  { file: 'zero-5.html', title: '万能开场白：先问我', num: 0 },
  { file: 'zero-q-prompt.html', title: '提示词到底怎么写才好', num: 0 },
  { file: 'zero-q-prompt-engineering.html', title: '提示词工程有什么意义', num: 0 },
  { file: 'zero-q-model-agent-app.html', title: '模型、Agent、应用的关系', num: 0 },
  { file: 'zero-q-agent.html', title: 'Agent 到底强在哪', num: 0 },
  { file: 'zero-q-skill.html', title: '最近很火的 Skill 是什么', num: 0 },
  { file: 'zero-q-vibe-coding.html', title: 'Vibe Coding 是什么', num: 0 },
  { file: 'zero-q-china-models.html', title: '国产大模型怎么选', num: 0 },
  { file: 'zero-q-companies.html', title: '还有哪些重要的 AI 公司', num: 0 },
  { file: 'zero-q-token.html', title: 'Token 是什么', num: 0 },
  { file: 'zero-q-context-window.html', title: '为什么聊久了会忘事', num: 0 },
  { file: 'zero-q-reasoning.html', title: '推理模型是什么', num: 0 },
  { file: 'zero-q-parameters.html', title: '参数越多越聪明吗', num: 0 },
  { file: 'zero-q-multimodal.html', title: '为什么有的 AI 看不懂图', num: 0 },
  { file: 'zero-q-finetune-vs-rag.html', title: '微调和喂资料的区别', num: 0 },
  { file: 'zero-q-knowledge-base.html', title: '企业知识库是什么', num: 0 },
  { file: 'zero-q-acronyms.html', title: 'AI 缩写怎么分', num: 0 },
  { file: 'zero-q-nvidia-gpu.html', title: '英伟达为什么值钱', num: 0 },
  { file: 'zero-q-train-or-prompt.html', title: '训模型还是改提示词', num: 0 },
  { file: 'zero-q-jargon-translator.html', title: 'AI 圈黑话翻译器', num: 0 },
  { file: 'zero-q-opensource-free.html', title: '开源模型等于免费吗', num: 0 },
  { file: 'zero-q-benchmark.html', title: '跑分第一为什么不行', num: 0 },
  { file: 'zero-q-ai-learning.html', title: 'AI 是在学习吗', num: 0 },
  { file: 'zero-q-ai-detector.html', title: 'AI 检测器可信吗', num: 0 },
  { file: 'zero-q-prompt-course.html', title: '提示词秘籍值得买吗', num: 0 },
  { file: 'zero-q-randomness.html', title: '为什么每次答案不一样', num: 0 },
  { file: 'zero-q-ai-customer-service.html', title: 'AI 客服为什么蠢', num: 0 },
  { file: 'zero-q-siri-vs-chatgpt.html', title: 'Siri 和 ChatGPT 的区别', num: 0 },
  { file: 'zero-q-free-vs-paid.html', title: '免费的 AI 够用吗', num: 0 },
  { file: 'zero-q-api-vs-membership.html', title: 'API 和会员的区别', num: 0 },
  { file: 'zero-q-image-cost.html', title: '生成一张图为什么贵', num: 0 },
  { file: 'zero-q-video-cost.html', title: 'AI 视频为什么按秒收费', num: 0 },
  { file: 'zero-q-relay.html', title: '什么是 API 中转站', num: 0 },
  { file: 'zero-q-reverse-proxy.html', title: '拼车号、共享号是什么', num: 0 },
  { file: 'zero-q-privacy.html', title: '聊天记录会被拿去训练吗', num: 0 },
  { file: 'zero-6.html', title: '放心用，还是要核实', num: 0 },
  { file: 'zero-final.html', title: '你的下一步', num: 0 },
  { file: 'training-data.html', title: '训练数据规模', num: 0 },
  { file: 'train-vs-infer.html', title: '训练 vs 推理', num: 0 },
  { file: '1-2-vocab.html', title: '词表与训练', num: 0 },
  { file: '1-2-base.html', title: 'Base 模型', num: 0 },
  { file: '1-2-gpt.html', title: 'GPT 的跃进', num: 0 },
  { file: '1-2-api.html', title: 'chat/completions 之谜', num: 0 },
  { file: '1-2-fake-chat.html', title: '伪造聊天记录', num: 0 },
  { file: '1-2-sft.html', title: 'Chat Template + SFT', num: 0 },
  { file: '1-2-prompt-power.html', title: '上下文窗口是关键', num: 0 },
  { file: '1-2-hallucination.html', title: '大模型幻觉', num: 0 },
  { file: '1-2-mitigation-prompt.html', title: 'Prompt Engineering', num: 0 },
  { file: '1-2-mitigation-rag.html', title: 'RAG 检索增强', num: 0 },
  { file: 'rag-advanced.html', title: 'RAG 代价与优化', num: 0 },
  { file: '1-2-mitigation-temp.html', title: 'Temperature & Top-P', num: 0 },
  { file: '1-2-mitigation-eval.html', title: '评测 + 人工审核', num: 0 },
  { file: 'summary-1.html', title: '大模型原理篇汇总（上）', num: 0 },
  { file: 'summary-1b.html', title: '大模型原理篇汇总（下）', num: 0 },
  { file: 'build-1.html', title: '把那件事定下来', num: 0 },
  { file: 'interview-1.html', title: '他们会这样考你 · 30 问', num: 0 },
  { file: '5-1.html', title: '上下文窗口', num: 0 },
  { file: '5-2.html', title: '上下文溢出策略', num: 0 },
  { file: '6-0a.html', title: '为什么选 Markdown', num: 0 },
  { file: '6-0b.html', title: 'MD 语法与工程渲染', num: 0 },
  { file: '6-1.html', title: 'Prompt 角色扮演', num: 0 },
  { file: '6-2.html', title: 'Prompt 进阶技巧', num: 0 },
  { file: '6-3.html', title: '输出格式取舍', num: 0 },
  { file: '6-4.html', title: '流式返回与格式', num: 0 },
  { file: 'prompt-attack.html', title: 'Prompt 注入原理', num: 0 },
  { file: 'prompt-attack-cases.html', title: '12 个攻击案例', num: 0 },
  { file: 'prompt-defense.html', title: 'Prompt 防御实战', num: 0 },
  { file: 'ai-safety-redlines.html', title: 'AI 安全红线', num: 0 },
  { file: 'ai-safety-governance.html', title: '风险分级与责任', num: 0 },
  { file: '7-1.html', title: 'Agent 概念', num: 0 },
  { file: '7-2.html', title: '工具调用', num: 0 },
  { file: '7-2a.html', title: '一次对话背后的5条消息', num: 0 },
  { file: '7-2b.html', title: '工具描述的学问', num: 0 },
  { file: '7-2c.html', title: '多工具编排', num: 0 },
  { file: '7-2d.html', title: 'MCP 协议', num: 0 },
  { file: '7-3.html', title: 'ReAct 实战', num: 0 },
  { file: '7-3a.html', title: '上下文窗口', num: 0 },
  { file: '7-3b.html', title: '上下文压缩四层策略', num: 0 },
  { file: '7-3c.html', title: '长期记忆', num: 0 },
  { file: 'vector-db-1.html', title: '从 Embedding 到 Milvus', num: 0 },
  { file: 'vector-db-2.html', title: 'Milvus 心智模型', num: 0 },
  { file: 'vector-db-3.html', title: 'Milvus 实操', num: 0 },
  { file: 'vector-db-4.html', title: '从检索到 RAG', num: 0 },
  { file: '7-4a.html', title: 'ReAct 循环', num: 0 },
  { file: '7-4b.html', title: 'Agent 卡死的5种模式', num: 0 },
  { file: '7-4c.html', title: '权限与安全', num: 0 },
  { file: '7-5.html', title: 'Skill 技能', num: 0 },
  { file: '7-5a.html', title: 'Skill 的本质', num: 0 },
  { file: '7-5b.html', title: '解剖一个真实 Skill', num: 0 },
  { file: '7-4.html', title: '脚手架工程', num: 0 },
  { file: '7-6a.html', title: '5道工程护栏', num: 0 },
  { file: '7-6b.html', title: '多 Agent 协作', num: 0 },
  { file: '7-6c.html', title: '可观测性', num: 0 },
  { file: '7-summary.html', title: 'Agent 工程全景图', num: 0 },
  { file: '8-1.html', title: '多轮对话成本', num: 0 },
  { file: '8-2.html', title: 'KV Cache', num: 0 },
  { file: '8-2b.html', title: '显式缓存', num: 0 },
  { file: '8-3.html', title: '动态时间戳', num: 0 },
  { file: '8-4.html', title: '综合成本优化', num: 0 },
  { file: '8-5.html', title: '图片 Token 计费', num: 0 },
  { file: '8-5b.html', title: '按任务匹配分辨率', num: 0 },
  { file: '8-6.html', title: '语法层优化', num: 0 },
  { file: '8-7.html', title: '语义层优化', num: 0 },
  { file: '8-8.html', title: '输出层+KV进阶', num: 0 },
  { file: 'cost-eval.html', title: '模型选型：能力 vs 成本', num: 0 },
  { file: 'engineering-philosophy.html', title: '大道至简', num: 0 },
  { file: 'ai-tips-boundary.html', title: '人机知识边界', num: 0 },
  { file: 'ai-tips-context.html', title: '好提问 vs 坏提问', num: 0 },
  { file: 'ai-tips-verify.html', title: 'AI 说的能信吗', num: 0 },
  { file: 'ai-tips-iterate.html', title: '迭代的艺术', num: 0 },
  { file: 'ai-tips-scenarios.html', title: '场景速查', num: 0 },
  { file: 'summary-2.html', title: 'Harness 核心篇汇总（上）', num: 0 },
  { file: 'summary-2b.html', title: 'Harness 核心篇汇总（下）', num: 0 },
  { file: 'summary-final.html', title: '课程总结', num: 0 },
  { file: 'summary-final-1.html', title: '总结（上）', num: 0 },
  { file: 'summary-final-2.html', title: '总结（下）', num: 0 },
  { file: 'build-2.html', title: '让它连跑五次都能用', num: 0 },
  { file: 'interview-2.html', title: '他们会这样考你 · 30 问', num: 0 },
  { file: '9-0.html', title: 'Alice 开发实录', num: 0 },
  { file: '9-1.html', title: '文生图 vs 垫图', num: 0 },
  { file: '9-2.html', title: '用 AI 给 AI 写 Prompt', num: 0 },
  { file: '9-3.html', title: '角色一致性', num: 0 },
  { file: '9-4.html', title: '模型会挂，然后呢', num: 0 },
  { file: '9-5.html', title: '生图产品化清单', num: 0 },
  { file: '9-6.html', title: '教科书 vs 真实 N 步', num: 0 },
  { file: '9-7.html', title: 'Agent 为什么会卡死', num: 0 },
  { file: '9-8.html', title: '防呆设计', num: 0 },
  { file: '9-9.html', title: '流式体验', num: 0 },
  { file: '9-10.html', title: '一条消息的真实成本', num: 0 },
  { file: '9-11.html', title: '越长越贵越笨', num: 0 },
  { file: '9-12.html', title: '压缩的艺术', num: 0 },
  { file: '9-13.html', title: '用户的话能删吗', num: 0 },
  { file: '9-14.html', title: '本地 vs LLM 压缩', num: 0 },
  { file: '9-15.html', title: '上下文 ≠ 记忆', num: 0 },
  { file: '9-16.html', title: '什么值得记', num: 0 },
  { file: '9-17.html', title: '记忆冲突', num: 0 },
  { file: '9-18.html', title: '记忆注入的成本', num: 0 },
  { file: '9-19.html', title: 'System Prompt 分层', num: 0 },
  { file: '9-20.html', title: '按需加载', num: 0 },
  { file: '9-21.html', title: 'Skill 模块化', num: 0 },
  { file: '9-22.html', title: '提示词与缓存', num: 0 },
  { file: '9-23.html', title: '何时需要多 Agent', num: 0 },
  { file: '9-24.html', title: '并发的代价', num: 0 },
  { file: '9-25.html', title: '脑暴模式', num: 0 },
  { file: '9-26.html', title: '定时任务成本', num: 0 },
  { file: '9-27.html', title: 'AI 的自由度', num: 0 },
  { file: '9-28.html', title: '弹窗与安全平衡', num: 0 },
  { file: '9-29.html', title: '可观测性', num: 0 },
  { file: '9-30.html', title: 'MCP 双向协议', num: 0 },
  { file: '9-31.html', title: '懒连接', num: 0 },
  { file: '9-32.html', title: 'AI 自加工具', num: 0 },
  { file: '9-summary.html', title: '实战全景图', num: 0 },
  { file: '9-final.html', title: '聊天套壳 vs Agent 产品', num: 0 },
  { file: 'build-3.html', title: '接上第一个真工具', num: 0 },
  { file: 'interview-3.html', title: '他们会这样考你 · 30 问', num: 0 },
  { file: '10-1.html', title: 'Workflow vs Agent', num: 0 },
  { file: '10-2.html', title: '五种 Workflow 模式', num: 0 },
  { file: '10-3.html', title: '上下文工程方法论', num: 0 },
  { file: '10-4.html', title: '上下文三板斧', num: 0 },
  { file: '10-5.html', title: 'ACI 工具界面设计', num: 0 },
  { file: 'vector-db-5.html', title: 'Agent 知识库工具', num: 0 },
  { file: '10-6.html', title: 'Think Tool', num: 0 },
  { file: '10-7.html', title: '用 Agent 优化工具', num: 0 },
  { file: '10-8.html', title: '评测方法论', num: 0 },
  { file: '10-9.html', title: '三种 Grader', num: 0 },
  { file: '10-10.html', title: '评测的坑', num: 0 },
  { file: '10-11.html', title: '长任务失败模式', num: 0 },
  { file: '10-12.html', title: '双角色 Harness', num: 0 },
  { file: '10-13.html', title: 'Managed Agent', num: 0 },
  { file: '10-14.html', title: 'Session vs Context', num: 0 },
  { file: '10-15.html', title: '三类安全风险', num: 0 },
  { file: '10-16.html', title: '沙箱与凭证隔离', num: 0 },
  { file: '10-17.html', title: 'Contextual Retrieval', num: 0 },
  { file: '10-summary.html', title: '进阶全景图', num: 0 },
  { file: '10-final.html', title: 'Do the simplest thing', num: 0 },
  { file: 'build-4.html', title: '搭你的第一个评测集', num: 0 },
  { file: 'interview-4.html', title: '他们会这样考你 · 30 问', num: 0 },
  { file: '11-1.html', title: '从脚手架到自我改进', num: 0 },
  { file: '11-2.html', title: 'Harness 三大设计模式', num: 0 },
  { file: '11-3.html', title: '上下文工程自动进化', num: 0 },
  { file: '11-4.html', title: '工作流自动搜索', num: 0 },
  { file: '11-5.html', title: '让 Harness 改进自己', num: 0 },
  { file: '11-6.html', title: '进化搜索', num: 0 },
  { file: '11-7.html', title: '未来挑战七道关', num: 0 },
  { file: 'build-5.html', title: '立三条长跑规矩', num: 0 },
  { file: 'interview-5.html', title: '他们会这样考你 · 30 问', num: 0 },
  { file: 'vibe-1.html', title: '为什么要给 AI 立规矩', num: 0 },
  { file: 'vibe-2.html', title: '四步流程', num: 0 },
  { file: 'vibe-3.html', title: 'PlayGround 试衣间', num: 0 },
  { file: 'vibe-3b.html', title: '样式收敛', num: 0 },
  { file: 'vibe-4.html', title: '注释三要素与代码保护', num: 0 },
  { file: 'vibe-5.html', title: '调试铁律', num: 0 },
  { file: 'vibe-6.html', title: '不接受分期交付', num: 0 },
  { file: 'vibe-7.html', title: '三份文档与方法论沉淀', num: 0 },
  { file: 'vibe-8.html', title: '把环境事实写进 Rule', num: 0 },
  { file: 'vibe-9.html', title: '破坏性操作的三道闸', num: 0 },
  { file: 'vibe-10.html', title: '长对话锚定与写作规范', num: 0 },
  { file: 'vibe-final.html', title: '规则的价值', num: 0 },
  { file: 'build-6.html', title: '沉淀你自己的协作规范', num: 0 },
  { file: 'interview-7.html', title: '他们会这样考你 · 30 问', num: 0 },
  { file: 'taste-1.html', title: '判断力开始涨价', num: 0 },
  { file: 'taste-2.html', title: 'AI 味儿从哪来', num: 0 },
  { file: 'taste-3.html', title: '层级：唯一主角', num: 0 },
  { file: 'taste-4.html', title: '留白与对齐', num: 0 },
  { file: 'taste-5.html', title: '克制：做预算', num: 0 },
  { file: 'taste-6.html', title: '一致性与系统感', num: 0 },
  { file: 'taste-7.html', title: '审美词汇表', num: 0 },
  { file: 'taste-8.html', title: '生 UI 提示词', num: 0 },
  { file: 'taste-9.html', title: '生图三件套', num: 0 },
  { file: 'taste-10.html', title: '把设计看进去', num: 0 },
  { file: 'taste-11.html', title: '把参考喂给 AI', num: 0 },
  { file: 'taste-final.html', title: '审美验收清单', num: 0 },
  { file: 'ixd-1.html', title: '能跑通不等于好用', num: 0 },
  { file: 'ixd-2.html', title: '状态三件套', num: 0 },
  { file: 'ixd-3.html', title: '防错与可逆', num: 0 },
  { file: 'ixd-4.html', title: '流程克制', num: 0 },
  { file: 'ixd-5.html', title: '习惯用法与能供性', num: 0 },
  { file: 'ixd-6.html', title: '控件怎么选', num: 0 },
  { file: 'ixd-7.html', title: '界面文案', num: 0 },
  { file: 'ixd-8.html', title: '目标导向提需求', num: 0 },
  { file: 'ixd-9.html', title: '状态机写进提示词', num: 0 },
  { file: 'ixd-final.html', title: '交互验收清单', num: 0 },
  { file: 'psy-1.html', title: '感知性能 ≠ 真实性能', num: 0 },
  { file: 'psy-2.html', title: '等待心理学三定律', num: 0 },
  { file: 'psy-3.html', title: '劳动错觉', num: 0 },
  { file: 'psy-4.html', title: '峰终定律', num: 0 },
  { file: 'psy-5.html', title: '信任校准', num: 0 },
  { file: 'psy-9.html', title: '算法厌恶', num: 0 },
  { file: 'psy-6.html', title: '防御心理三板斧', num: 0 },
  { file: 'psy-7.html', title: '心智模型错配', num: 0 },
  { file: 'psy-8.html', title: '拟人化与道歉', num: 0 },
  { file: 'psy-10.html', title: '蜜月悬崖', num: 0 },
  { file: 'psy-11.html', title: 'AI 标签折扣', num: 0 },
  { file: 'psy-12.html', title: '认知卸载', num: 0 },
  { file: 'psy-13.html', title: '情感依恋', num: 0 },
  { file: 'psy-14.html', title: '付费心理', num: 0 },
  { file: 'psy-15.html', title: '定价心理', num: 0 },
  { file: 'psy-16.html', title: '反馈心理', num: 0 },
  { file: 'psy-books.html', title: 'PM 心理学书单', num: 0 },
  { file: 'psy-final.html', title: '心理学篇收官', num: 0 },
  { file: 'psy-interview.html', title: '他们会这样考你 · 40 问', num: 0 },
  { file: 'cost-1.html', title: '和用户对赌的生意', num: 0 },
  { file: 'cost-2.html', title: 'BPE 与 Token 税', num: 0 },
  { file: 'cost-3.html', title: '报价表与三大梯队', num: 0 },
  { file: 'cost-4.html', title: '200 Token 断崖', num: 0 },
  { file: 'cost-5.html', title: '32k 红线', num: 0 },
  { file: 'cost-6.html', title: '图片 Token', num: 0 },
  { file: 'cost-7.html', title: '输入主导的 Agent', num: 0 },
  { file: 'cost-8.html', title: 'Agent 四大陷阱', num: 0 },
  { file: 'cost-9.html', title: '语法层：词法税', num: 0 },
  { file: 'cost-10.html', title: '语义层：双重蒸馏', num: 0 },
  { file: 'cost-11.html', title: '架构层：KV Cache', num: 0 },
  { file: 'cost-12.html', title: '输出层：管住嘴', num: 0 },
  { file: 'cost-final.html', title: '算力极简主义', num: 0 },
  { file: 'ds-1.html', title: '为什么还要懂数据结构', num: 0 },
  { file: 'ds-2.html', title: '数组与 message list', num: 0 },
  { file: 'ds-3.html', title: '栈：撤销与调用', num: 0 },
  { file: 'ds-4.html', title: '队列与任务调度', num: 0 },
  { file: 'ds-5.html', title: '哈希表', num: 0 },
  { file: 'ds-6.html', title: '缓存与 KV Cache', num: 0 },
  { file: 'ds-7.html', title: '树与 AST', num: 0 },
  { file: 'ds-8.html', title: '图与 DAG', num: 0 },
  { file: 'ds-9.html', title: '词表与 Trie', num: 0 },
  { file: 'ds-10.html', title: '向量与近邻搜索', num: 0 },
  { file: 'ds-summary.html', title: '数据结构篇汇总', num: 0 },
  { file: 'ds-build.html', title: '实战：验收 AI 的代码', num: 0 },
  { file: 'ds-interview.html', title: '他们会这样考你 · 30 问', num: 0 },
  { file: 'algo-1.html', title: 'Big-O 复杂度直觉', num: 0 },
  { file: 'algo-2.html', title: '注意力的 O(n²) 账单', num: 0 },
  { file: 'algo-3.html', title: '二分查找', num: 0 },
  { file: 'algo-4.html', title: '排序算法赛跑', num: 0 },
  { file: 'algo-5.html', title: 'Rerank 重排序', num: 0 },
  { file: 'algo-6.html', title: '递归', num: 0 },
  { file: 'algo-7.html', title: '分治与递归摘要', num: 0 },
  { file: 'algo-8.html', title: 'BFS 与 DFS', num: 0 },
  { file: 'algo-9.html', title: '贪心与采样', num: 0 },
  { file: 'algo-10.html', title: 'Beam Search', num: 0 },
  { file: 'algo-11.html', title: '还要刷 LeetCode 吗', num: 0 },
  { file: 'algo-12.html', title: '用 AI 学算法', num: 0 },
  { file: 'algo-summary.html', title: '算法篇汇总', num: 0 },
  { file: 'algo-build.html', title: '实战：复杂度体检', num: 0 },
  { file: 'algo-interview.html', title: '他们会这样考你 · 30 问', num: 0 },
  { file: '12-1.html', title: '79 个 Workspace 成员', num: 0 },
  { file: '12-2.html', title: 'Rust 技术选型', num: 0 },
  { file: '12-3.html', title: '从 main() 到首轮采样', num: 0 },
  { file: '12-4.html', title: 'Session Actor', num: 0 },
  { file: '12-5.html', title: 'Compaction 阈值', num: 0 },
  { file: '12-6.html', title: 'PromptContext', num: 0 },
  { file: '12-7.html', title: 'Toolset 注册表', num: 0 },
  { file: '12-8.html', title: 'ToolKind 只读语义', num: 0 },
  { file: '12-9.html', title: '实现族与动态 MCP', num: 0 },
  { file: '12-10.html', title: 'Canonical input', num: 0 },
  { file: '12-11.html', title: 'Token 估算与阈值', num: 0 },
  { file: '12-12.html', title: '混合检索排序', num: 0 },
  { file: '12-13.html', title: 'Dream 机制', num: 0 },
  { file: '12-14.html', title: 'Agent 与 Persona 合并', num: 0 },
  { file: '12-15.html', title: '子 Agent 隔离维度', num: 0 },
  { file: '12-16.html', title: '多 Agent 组织方式', num: 0 },
  { file: '12-17.html', title: '五种沙箱 Profile', num: 0 },
  { file: '12-18.html', title: '工具授权链', num: 0 },
  { file: '12-19.html', title: 'Hooks 阻断语义', num: 0 },
  { file: '12-20.html', title: 'MCP 连接与恢复', num: 0 },
  { file: '12-21.html', title: 'Marketplace 信任', num: 0 },
  { file: '12-22.html', title: 'Grok vs Claude 对照', num: 0 },
  { file: '12-23.html', title: '工程复盘与边界', num: 0 },
  { file: '12-24.html', title: '设计工作台', num: 0 },
  { file: 'interview-6.html', title: '他们会这样考你 · 30 问', num: 0 },
  { file: 'dsh-1.html', title: '一切皆插件', num: 0 },
  { file: 'dsh-6.html', title: 'Profile 与 Bundle', num: 0 },
  { file: 'dsh-2.html', title: '日志重建不变量', num: 0 },
  { file: 'dsh-3.html', title: '双队列 Inbox', num: 0 },
  { file: 'dsh-7.html', title: '取消与崩溃恢复', num: 0 },
  { file: 'dsh-8.html', title: 'Goal 与溯源鉴权', num: 0 },
  { file: 'dsh-4.html', title: 'Compaction 双路径', num: 0 },
  { file: 'dsh-9.html', title: 'Token 计量', num: 0 },
  { file: 'dsh-10.html', title: 'Spill 落盘', num: 0 },
  { file: 'dsh-11.html', title: '会话检索', num: 0 },
  { file: 'dsh-12.html', title: '工具流水线', num: 0 },
  { file: 'dsh-13.html', title: 'render intent', num: 0 },
  { file: 'dsh-14.html', title: '先读后写', num: 0 },
  { file: 'dsh-17.html', title: '独有工具面', num: 0 },
  { file: 'dsh-15.html', title: '审批与权限预设', num: 0 },
  { file: 'dsh-16.html', title: '执行世界', num: 0 },
  { file: 'dsh-5.html', title: 'Code Mode 沙箱', num: 0 },
  { file: 'dsh-18.html', title: 'Subagent seam', num: 0 },
  { file: 'dsh-19.html', title: '编排原语', num: 0 },
  { file: 'dsh-20.html', title: 'Skill 与自我修改', num: 0 },
  { file: 'dsh-21.html', title: 'MCP 与扩展', num: 0 },
  { file: 'dsh-22.html', title: 'LLM 适配层', num: 0 },
  { file: 'dsh-26.html', title: '测试基础设施', num: 0 },
  { file: 'dsh-23.html', title: '持久化治理', num: 0 },
  { file: 'dsh-24.html', title: '凭据与存储', num: 0 },
  { file: 'dsh-25.html', title: '多入口', num: 0 },
  { file: 'dsh-27.html', title: 'Agent Notes', num: 0 },
  { file: 'dsh-28.html', title: 'KV Cache 纪律', num: 0 },
  { file: 'dsh-29.html', title: '终章 · 该抄什么', num: 0 },
  { file: 'codex-01.html', title: 'crate 治理', num: 0 },
  { file: 'codex-02.html', title: '三层 Turn Loop', num: 0 },
  { file: 'codex-03.html', title: 'SSE 与工具循环', num: 0 },
  { file: 'codex-04.html', title: 'Turn 输入与 Inbox', num: 0 },
  { file: 'codex-05.html', title: '取消与错误', num: 0 },
  { file: 'codex-06.html', title: '上下文碎片', num: 0 },
  { file: 'codex-07.html', title: '上下文治理', num: 0 },
  { file: 'codex-08.html', title: '上下文压缩', num: 0 },
  { file: 'codex-09.html', title: 'JSONL 与 SQLite', num: 0 },
  { file: 'codex-10.html', title: '工具清单', num: 0 },
  { file: 'codex-11.html', title: '并行工具与锁', num: 0 },
  { file: 'codex-12.html', title: '统一执行入口', num: 0 },
  { file: 'codex-13.html', title: '沙箱管理器', num: 0 },
  { file: 'codex-14.html', title: 'macOS Seatbelt', num: 0 },
  { file: 'codex-15.html', title: 'Linux 沙箱', num: 0 },
  { file: 'codex-16.html', title: 'Windows 沙箱', num: 0 },
  { file: 'codex-17.html', title: 'execpolicy', num: 0 },
  { file: 'codex-18.html', title: '审批策略', num: 0 },
  { file: 'codex-19.html', title: 'Guardian', num: 0 },
  { file: 'codex-20.html', title: '网络与凭据代理', num: 0 },
  { file: 'codex-21.html', title: 'apply-patch', num: 0 },
  { file: 'codex-22.html', title: 'exec 与 wait', num: 0 },
  { file: 'codex-23.html', title: 'Code Mode 宿主', num: 0 },
  { file: 'codex-24.html', title: '多 Agent 图', num: 0 },
  { file: 'codex-25.html', title: 'Hooks', num: 0 },
  { file: 'codex-26.html', title: 'MCP 与 Skills', num: 0 },
  { file: 'codex-27.html', title: '插件迁移', num: 0 },
  { file: 'codex-28.html', title: 'SQ/EQ 事件语言', num: 0 },
  { file: 'codex-29.html', title: 'app-server 协议', num: 0 },
  { file: 'codex-30.html', title: 'TUI 流式渲染', num: 0 },
  { file: 'codex-31.html', title: '架构即 lint', num: 0 },
  { file: 'codex-32.html', title: '两种安全视角', num: 0 },
  { file: 'oss-1.html', title: '权重是什么', num: 0 },
  { file: 'oss-2.html', title: '真开源 vs 假开源', num: 0 },
  { file: 'oss-3.html', title: '开源是一门生意', num: 0 },
  { file: 'oss-4.html', title: '涌现', num: 0 },
  { file: 'oss-5.html', title: '为什么要把模型做小', num: 0 },
  { file: 'oss-6.html', title: '蒸馏是怎么做的', num: 0 },
  { file: 'oss-7.html', title: '蒸馏的代价', num: 0 },
  { file: 'oss-8.html', title: '你的电脑能跑多大的模型', num: 0 },
  { file: 'oss-9.html', title: 'Ollama 与 LM Studio', num: 0 },
  { file: 'exam.html', title: '自测中心', num: 0 },
  { file: 'exam-1.html', title: '大模型原理篇自测 · 50 题', num: 0 },
  { file: 'exam-2.html', title: 'Harness 核心篇自测 · 50 题', num: 0 },
  { file: 'exam-3.html', title: '动手实战篇自测 · 50 题', num: 0 },
  { file: 'exam-4.html', title: '工程进阶篇自测 · 50 题', num: 0 },
  { file: 'exam-5.html', title: '自我改进篇自测 · 50 题', num: 0 },
  { file: 'exam-7.html', title: '协作方法论篇自测 · 50 题', num: 0 },
  { file: 'exam-6.html', title: 'Grok 专题自测 · 50 题', num: 0 },
  { file: 'exam-all.html', title: '全站综合考 · 35 题', num: 0 },
  { file: 'opc-1.html', title: '六种武器', num: 0 },
  { file: 'opc-2.html', title: '确权要趁早', num: 0 },
  { file: 'opc-3.html', title: '商标类别', num: 0 },
  { file: 'opc-4.html', title: '商标被驳回', num: 0 },
  { file: 'opc-5.html', title: '域名议价', num: 0 },
  { file: 'opc-6.html', title: '软著与备案', num: 0 },
  { file: 'opc-7.html', title: '专利或商业秘密', num: 0 },
  { file: 'opc-8.html', title: 'ICP 备案与证', num: 0 },
  { file: 'opc-9.html', title: '注册资本', num: 0 },
  { file: 'opc-10.html', title: '合伙人', num: 0 },
  { file: 'opc-11.html', title: '平均分配的陷阱', num: 0 },
  { file: 'opc-12.html', title: '股权五维度', num: 0 },
  { file: 'opc-13.html', title: '代持与退出', num: 0 },
  { file: 'opc-14.html', title: '真出海与假出海', num: 0 },
  { file: 'opc-15.html', title: '长尾与选型', num: 0 },
  { file: 'opc-final.html', title: '新创业公式', num: 0 },
  { file: 'seo-1.html', title: '为什么没人来', num: 0 },
  { file: 'seo-2.html', title: 'SEO 最低可行清单', num: 0 },
  { file: 'seo-3.html', title: 'GEO 让 AI 引用你', num: 0 },
  { file: 'seo-4.html', title: '拆本站真实改造', num: 0 },
  { file: 'seo-5.html', title: '一个人的优先级', num: 0 },
  { file: 'seo-final.html', title: '被搜到验收清单', num: 0 },
  { file: 'lei-1.html', title: '谁适合创业', num: 0 },
  { file: 'lei-2.html', title: '心理准备', num: 0 },
  { file: 'lei-3.html', title: '选方向', num: 0 },
  { file: 'lei-4.html', title: '起名', num: 0 },
  { file: 'lei-5.html', title: '互联网七字诀', num: 0 },
  { file: 'lei-6.html', title: '口碑的本质', num: 0 },
  { file: 'lei-7.html', title: '第一笔钱', num: 0 },
  { file: 'lei-8.html', title: '融资时机', num: 0 },
  { file: 'lei-9.html', title: '估值的艺术', num: 0 },
  { file: 'lei-10.html', title: '股权就是拼图', num: 0 },
  { file: 'lei-11.html', title: '合伙人', num: 0 },
  { file: 'lei-12.html', title: '现金流与报酬包', num: 0 },
  { file: 'lei-final.html', title: '写给一人公司', num: 0 },
  { file: 'lei-test.html', title: '创业成功率测试', num: 0 },
];

// 嵌入模式：被 learn.html 的 iframe 加载时（?embed=1 或在 iframe 内），
// 不注入顶部浮条 / 底部翻页条 / 拍脸图广告，避免与 Wiki 外层 UI 重复。
// PV 统计仍照常上报。
const EMBED_MODE = (function(){
  try {
    if (/[?&]embed=1\b/.test(location.search)) return true;
    if (window.self !== window.top) return true; // 在 iframe 内
  } catch (e) { return true; }
  return false;
})();

// ── i18n 适配：i18n.js 未加载时按中文兜底 ──
const I18N = window.XUEAI_I18N || {
  lang: 'zh',
  t: function (k) { return ({
    toc: '目录', tocTitle: '在课程阅读器中打开，左侧带完整目录', askAuthor: '请教作者',
    today: '今日', total: '总学习', backHomeTitle: '返回首页 (Cmd+↑返回目录)',
    prevTitle: '上一页 (Cmd+←)', nextTitle: '下一页 (Cmd+→)', lastPage: '已是最后一页',
    navHint: '→ 下一步<br>⌘→ 换页', rotateTitle: '请横屏观看',
    rotateSub: '横屏后内容会按比例完整显示<br/>竖屏可关闭后继续浏览', rotateClose: '继续竖屏浏览'
  })[k] || k; },
  baseFile: function (f) { return f; },
  locFile: function (f) { return f; },
  slideTitle: function (f, zh) { return zh; }
};

// Cloudflare Pages 等托管会把 /x.html 重定向成 /x（美化 URL），
// 所有按文件名找课的逻辑都要先把扩展名补回来。
function WA_normFile(f) {
  f = String(f || '').split('?')[0];
  if (f && !/\.[a-z0-9]+$/i.test(f)) f += '.html';
  return f;
}

(function() {

  const cur = I18N.baseFile(WA_normFile(location.pathname.split('/').pop()));
  const idx = SLIDE_ORDER.findIndex(s => s.file === cur);

  // 无论是否在序列中，都注入顶部栏（请教作者 + PV）
  (function injectTopBar() {
    if (EMBED_MODE) {
      // 嵌入模式下仅静默上报 PV，不渲染浮条
      fetch('/pv').catch(() => {});
      return;
    }
    const style = document.createElement('style');
    style.textContent = `
      #nav-top-bar {
        position: fixed; top: 14px; left: 50%; transform: translateX(-50%);
        display: flex; align-items: center;
        background: rgba(255,255,255,0.82); backdrop-filter: blur(16px);
        border: 1px solid rgba(0,0,0,0.08);
        border-radius: 40px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        padding: 0;
        z-index: 9999; font-family: -apple-system, "PingFang SC", sans-serif;
        overflow: hidden;
        max-width: calc(100vw - 16px);
      }
      #nav-author-link, #nav-toc-link {
        font-size: 12px; font-weight: 600; color: #6b6b70;
        text-decoration: none;
        padding: 7px 16px;
        transition: background 0.15s, color 0.15s;
        white-space: nowrap;
        display: flex; align-items: center; gap: 5px;
      }
      #nav-author-link:hover, #nav-toc-link:hover { background: rgba(0,102,255,0.06); color: #0066ff; }
      #nav-toc-link { color: #0066ff; }
      .nav-top-sep {
        width: 1px; height: 20px; background: rgba(0,0,0,0.08); flex-shrink: 0;
      }
      #nav-pv-badge {
        display: flex; align-items: center; gap: 6px;
        padding: 7px 16px;
        font-size: 12px;
      }
      .nav-pv-label { color: #9a9a9f; font-weight: 500; }
      .nav-pv-num-today { color: #0066ff; font-weight: 800; }
      .nav-pv-sep { width:1px; height:12px; background:rgba(0,0,0,0.1); margin: 0 2px; }
      .nav-pv-num-total { color: #7c3aed; font-weight: 800; }
      @media (max-width: 768px) {
        #nav-top-bar { top: 8px; border-radius: 20px; }
        #nav-author-link, #nav-toc-link, #nav-pv-badge { padding: 6px 10px; font-size: 11px; }
        .nav-pv-sep { margin: 0; }
      }
    `;
    document.head.appendChild(style);

    const topBar = document.createElement('div');
    topBar.id = 'nav-top-bar';
    topBar.innerHTML = `
      <a id="nav-toc-link" href="${I18N.locFile('learn.html')}#${encodeURIComponent(cur)}" title="${I18N.t('tocTitle')}">☰ ${I18N.t('toc')}</a>
      <div class="nav-top-sep"></div>
      <a id="nav-author-link" href="https://www.waytoaic.com" target="_blank">${I18N.t('askAuthor')}</a>
    `;
    document.body.appendChild(topBar);
    /* WaytoAIC: 浏览量角标（/pv）随上游统计后端一并下线 */
  })();

  // 备案号：工信部要求网站底部悬挂备案号并链接备案平台。内容页被直连访问或被搜索引擎
  // 收录时它就是一张独立网页，所以跟顶栏同样条件注入；嵌在壳页里时由壳页统一显示，不重复。
  // 位置贴左下角，避开底部居中的 #slide-nav 翻页条。
  (function injectIcpBar() {
    if (EMBED_MODE) return;
    const style = document.createElement('style');
    style.textContent = `
      /* z-index 必须高于 #slide-nav-trigger(同为 9998 的底部 hover 触发区，
         它后插入所以会盖住本条，导致备案号点不动)；备案号按规必须可点转工信部。
         容器 pointer-events:none 让触发区照常收 hover，只有链接文字这一小块拦截。 */
      #wa-icp-bar {
        position: fixed; bottom: 6px; left: 10px; z-index: 10000;
        font-size: 11px; font-family: -apple-system, "PingFang SC", sans-serif;
        opacity: 0.5; transition: opacity 0.15s;
        pointer-events: none;
      }
      #wa-icp-bar a { pointer-events: auto; }
      #wa-icp-bar:hover { opacity: 1; }
      #wa-icp-bar a { color: #6b6b70; text-decoration: none; }
      #wa-icp-bar a:hover { color: #0066ff; }
      /* 窄屏下 #slide-nav 几乎占满整行，左下角避不开，只能垂直错到它上方；
         叠在内容上，所以补一层半透明底保证可读 */
      @media (max-width: 768px) {
        #wa-icp-bar {
          bottom: 92px; left: 6px; font-size: 10px; opacity: 0.75;
          background: rgba(255,255,255,0.78); backdrop-filter: blur(6px);
          padding: 2px 7px; border-radius: 7px;
        }
      }
      @media print { #wa-icp-bar { display: none; } }
    `;
    document.head.appendChild(style);

    const bar = document.createElement('div');
    bar.id = 'wa-icp-bar';
    bar.innerHTML = '<a href="https://beian.miit.gov.cn" target="_blank" rel="noopener">粤ICP备2026120136号-1</a><br><a href="https://beian.mps.gov.cn/#/query/webSearch?code=44030002017077" target="_blank" rel="noopener">粤公网安备44030002017077号</a>';
    document.body.appendChild(bar);
  })();

  // 嵌入模式 或 不在序列中：不注入底部翻页条（外层 Wiki 已有上一节/下一节）
  if (EMBED_MODE || idx < 0) return;

  const total = SLIDE_ORDER.length;
  const prev  = idx > 0           ? SLIDE_ORDER[idx - 1] : null;
  const next  = idx < total - 1   ? SLIDE_ORDER[idx + 1] : null;

  // 注入样式
  const style = document.createElement('style');
  style.textContent = `
    #slide-nav {
      position: fixed; bottom: 18px; left: 50%; transform: translateX(-50%) translateY(80px);
      display: flex; align-items: center; gap: 10px;
      background: rgba(28,28,30,0.88); backdrop-filter: blur(12px);
      border-radius: 40px; padding: 8px 14px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.18);
      z-index: 9999; font-family: -apple-system, "PingFang SC", sans-serif;
      user-select: none;
      opacity: 0;
      transition: opacity 0.25s ease, transform 0.25s ease;
      pointer-events: none;
      max-width: calc(100vw - 16px);
    }
    #slide-nav.visible {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
      pointer-events: auto;
    }
    /* 触发区：底部不可见热区 */
    #slide-nav-trigger {
      position: fixed; bottom: 0; left: 0; right: 0; height: 60px;
      z-index: 9998; pointer-events: auto;
    }
    .snav-btn {
      background: transparent; border: none; color: rgba(255,255,255,0.55);
      font-size: 13px; font-weight: 600; cursor: pointer;
      padding: 5px 12px; border-radius: 20px; transition: all 0.15s;
      display: flex; align-items: center; gap: 4px;
      max-width: 34vw;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .snav-btn:hover:not(:disabled) { background: rgba(255,255,255,0.1); color: white; }
    .snav-btn:disabled { opacity: 0.25; cursor: not-allowed; }
    .snav-info {
      font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.7);
      padding: 0 8px; min-width: 64px; text-align: center;
    }
    .snav-sep { width: 1px; height: 16px; background: rgba(255,255,255,0.15); }
    .snav-home {
      background: transparent; border: none; color: rgba(255,255,255,0.45);
      font-size: 12px; cursor: pointer; padding: 5px 10px; border-radius: 20px;
      transition: all 0.15s;
    }
    .snav-home:hover { color: white; background: rgba(255,255,255,0.08); }
    @media (max-width: 768px) {
      #slide-nav { bottom: 10px; gap: 6px; padding: 6px 8px; }
      .snav-btn { font-size: 12px; padding: 4px 8px; max-width: 30vw; }
      .snav-info { min-width: 48px; padding: 0 4px; font-size: 11px; }
      .snav-home { padding: 4px 8px; font-size: 11px; }
    }
  `;
  document.head.appendChild(style);

  // 注入 DOM
  const nav = document.createElement('div');
  nav.id = 'slide-nav';
  nav.innerHTML = `
    <button class="snav-home" onclick="location.href='${I18N.locFile('home.html')}'" title="${I18N.t('backHomeTitle')}">☰</button>
    <div class="snav-sep"></div>
    <button class="snav-btn" id="snav-prev" onclick="location.href='${prev ? I18N.locFile(prev.file) : ''}'" ${!prev ? 'disabled' : ''} title="${I18N.t('prevTitle')}">
      ← ${prev ? I18N.slideTitle(prev.file, prev.title) : ''}
    </button>
    <div class="snav-info">${idx + 1} / ${total}</div>
    <button class="snav-btn" id="snav-next" onclick="location.href='${next ? I18N.locFile(next.file) : ''}'" ${!next ? 'disabled' : ''} title="${I18N.t('nextTitle')}">
      ${next ? I18N.slideTitle(next.file, next.title) : I18N.t('lastPage')} ${next ? '→' : ''}
    </button>
    <div class="snav-sep"></div>
    <div style="font-size:10px;color:rgba(255,255,255,0.3);padding:0 4px;line-height:1.4;text-align:center">${I18N.t('navHint')}</div>
  `;
  // 触发热区
  const trigger = document.createElement('div');
  trigger.id = 'slide-nav-trigger';
  document.body.appendChild(trigger);
  document.body.appendChild(nav);

  // 鼠标移入底部热区或导航条时显示
  let hideTimer = null;
  function showNav() {
    clearTimeout(hideTimer);
    nav.classList.add('visible');
  }
  function scheduleHide() {
    hideTimer = setTimeout(() => nav.classList.remove('visible'), 800);
  }
  trigger.addEventListener('mouseenter', showNav);
  trigger.addEventListener('mouseleave', scheduleHide);
  nav.addEventListener('mouseenter', showNav);
  nav.addEventListener('mouseleave', scheduleHide);

  // 前 3 次访问自动弹出 2 秒
  const AUTO_SHOW_KEY = 'slide_nav_auto_count';
  const count = parseInt(localStorage.getItem(AUTO_SHOW_KEY) || '0', 10);
  if (count < 3) {
    localStorage.setItem(AUTO_SHOW_KEY, count + 1);
    setTimeout(() => {
      showNav();
      setTimeout(() => scheduleHide(), 2000);
    }, 600);
  }

  // 键盘快捷键
  document.addEventListener('keydown', e => {
    const cmd = e.metaKey || e.ctrlKey;

    // Cmd + ↑ → 返回目录
    if (cmd && e.key === 'ArrowUp') {
      e.preventDefault();
      // 判断当前页属于哪个篇章
      const base = cur.replace('.html','');
      const ch4Files = ['10-1','10-2','10-3','10-4','10-5','10-6','10-7',
        '10-8','10-9','10-10','10-11','10-12','10-13','10-14','10-15','10-16',
        '10-17','10-summary','10-final'];
      const ch3Files = ['9-1','9-2','9-3','9-4','9-5','9-6','9-7','9-8','9-9','9-10',
        '9-11','9-12','9-13','9-14','9-15','9-16','9-17','9-18','9-19','9-20',
        '9-21','9-22','9-23','9-24','9-25','9-26','9-27','9-28','9-29','9-30',
        '9-31','9-32','9-summary','9-final'];
      const ch2Files = ['5-1','5-2','6-0a','6-0b','6-1','6-2','6-3','6-4',
        'prompt-attack','prompt-attack-cases','prompt-defense',
        '7-1','7-2','7-3','7-4','7-5','8-1','8-2','8-2b','8-3','8-4','8-5','8-5b',
        '8-6','8-7','8-8','cost-eval','engineering-philosophy','summary-2','summary-2b'];
      if (ch4Files.includes(base)) { location.href = I18N.locFile('learn.html') + '#10-1.html'; }
      else if (ch3Files.includes(base)) { location.href = I18N.locFile('learn.html') + '#9-1.html'; }
      else { location.href = I18N.locFile(ch2Files.includes(base) ? 'story-2.html' : 'llm-story.html'); }
      return;
    }

    // Cmd + → → 下一页
    if (cmd && e.key === 'ArrowRight') {
      e.preventDefault();
      if (next) location.href = I18N.locFile(next.file);
      return;
    }

    // Cmd + ← → 上一页
    if (cmd && e.key === 'ArrowLeft') {
      e.preventDefault();
      if (prev) location.href = I18N.locFile(prev.file);
      return;
    }

    // 单独 → → 页面内下一步（nextStep 或 playDemo）
    if (!cmd && e.key === 'ArrowRight') {
      if (typeof window.nextStep === 'function') {
        e.preventDefault();
        window.nextStep();
      } else if (typeof window.playDemo === 'function') {
        e.preventDefault();
        window.playDemo();
      }
      return;
    }

    // 单独 ← → 页面内上一步（如果有）
    if (!cmd && e.key === 'ArrowLeft') {
      if (typeof window.prevStep === 'function') {
        e.preventDefault();
        window.prevStep();
      }
      return;
    }
  });

  // ── 触摸滑动翻页 ──────────────────────────────────────────
  (function initTouchSwipe() {
    let startX = 0, startY = 0;
    document.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });
    document.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0 && next) location.href = I18N.locFile(next.file);   // 左滑 → 下一页
      if (dx > 0 && prev) location.href = I18N.locFile(prev.file);   // 右滑 → 上一页
    }, { passive: true });
  })();

})();

// ── 幻灯片适配：CSS 等比缩放 + 竖屏提示（可关闭，不强拦截）──────────
(function initSlideAdapt() {

  // 注入 meta viewport
  if (!document.querySelector('meta[name="viewport"]')) {
    const m = document.createElement('meta');
    m.name = 'viewport';
    m.content = 'width=device-width, initial-scale=1, viewport-fit=cover';
    document.head.appendChild(m);
  }

  // 纯 CSS 方案：避免 iOS Safari 的 vh / scale / autosize 陷阱
  const style = document.createElement('style');
  style.textContent = `
    html, body {
      -webkit-text-size-adjust: 100%;
      text-size-adjust: 100%;
    }

    :root {
      --slide-pad-x: 8px;
      --slide-pad-top: 40px;
      --slide-pad-bottom: 56px;
    }

    /* 横屏：按 16:9 反推宽度，确保上下留白且不裁剪 */
    @media (orientation: landscape) {
      .slide {
        width: min(94vw, calc((100vh - var(--slide-pad-top) - var(--slide-pad-bottom)) * 16 / 9)) !important;
        max-width: 1440px !important;
      }
    }

    /* 支持 dvh 的浏览器优先用 dvh（iOS 更稳定） */
    @supports (height: 100dvh) {
      @media (orientation: landscape) {
        .slide {
          width: min(94vw, calc((100dvh - var(--slide-pad-top) - var(--slide-pad-bottom)) * 16 / 9)) !important;
        }
      }
    }

    #slide-rotate-mask {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: rgba(28, 28, 30, 0.9);
      color: #fff;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 14px;
      font-family: -apple-system, "PingFang SC", sans-serif;
      padding: 20px;
      text-align: center;
    }
    #slide-rotate-mask .icon {
      font-size: 34px;
      line-height: 1;
    }
    #slide-rotate-mask .title {
      font-size: 17px;
      font-weight: 700;
    }
    #slide-rotate-mask .sub {
      font-size: 13px;
      color: rgba(255,255,255,0.45);
      text-align: center;
      line-height: 1.6;
    }
    #slide-rotate-close {
      margin-top: 6px;
      border: 1px solid rgba(255,255,255,0.3);
      background: rgba(255,255,255,0.08);
      color: #fff;
      border-radius: 999px;
      font-size: 14px;
      font-weight: 600;
      padding: 8px 18px;
      cursor: pointer;
    }
    #slide-rotate-close:active {
      transform: scale(0.98);
    }

    /* 仅小屏竖屏显示遮罩，避免误伤桌面窄窗口 */
    @media (orientation: portrait) and (max-width: 1024px) {
      #slide-rotate-mask { display: flex; }
      #slide-rotate-mask.dismissed { display: none; }
    }
  `;
  document.head.appendChild(style);

  const mask = document.createElement('div');
  mask.id = 'slide-rotate-mask';
  mask.innerHTML = '<div class="icon">↻</div>' +
    '<div class="title">' + I18N.t('rotateTitle') + '</div>' +
    '<div class="sub">' + I18N.t('rotateSub') + '</div>' +
    '<button id="slide-rotate-close" type="button">' + I18N.t('rotateClose') + '</button>';
  document.body.appendChild(mask);

  const MASK_DISMISS_KEY = 'slide_rotate_mask_dismissed';
  const closeBtn = document.getElementById('slide-rotate-close');

  function updateMaskState() {
    const isPortrait = window.matchMedia('(orientation: portrait)').matches;
    const isSmallScreen = window.matchMedia('(max-width: 1024px)').matches;
    const dismissed = sessionStorage.getItem(MASK_DISMISS_KEY) === '1';
    if (isPortrait && isSmallScreen && dismissed) {
      mask.classList.add('dismissed');
    } else {
      mask.classList.remove('dismissed');
    }
  }

  closeBtn?.addEventListener('click', () => {
    sessionStorage.setItem(MASK_DISMISS_KEY, '1');
    mask.classList.add('dismissed');
  });

  // ── 竖屏画布缩放：强制设定桌面分辨率后整体缩小 ──
  function applyCanvasScale() {
    const isPortrait = window.matchMedia('(orientation: portrait)').matches;
    const isSmallScreen = window.matchMedia('(max-width: 1024px)').matches;
    
    let styleEl = document.getElementById('mobile-canvas-scale');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'mobile-canvas-scale';
      document.head.appendChild(styleEl);
    }

    if (isPortrait && isSmallScreen) {
      const vw = window.innerWidth;
      
      // 基准设计分辨率：宽 960px，高 540px
      const designW = 960;
      const designH = 540;
      
      // 缩放比例
      const scale = vw / designW;
      const topGap = 60; // 顶部导航栏空间
      const leftOffset = (vw - designW * scale) / 2;
      const bodyH = Math.round(designH * scale + topGap + 20);

      styleEl.textContent = `
        body {
          height: ${bodyH}px !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
          display: block !important;
        }
        .slide, .slide-container {
          width: ${designW}px !important;
          height: ${designH}px !important;
          max-width: none !important;
          max-height: none !important;
          aspect-ratio: auto !important;
          margin: 0 !important;
          flex-shrink: 0 !important;
          position: absolute !important;
          left: ${leftOffset}px !important;
          top: ${topGap}px !important;
          transform-origin: top left !important;
          transform: scale(${scale}) !important;
        }
      `;
    } else {
      styleEl.textContent = '';
    }
  }

  window.addEventListener('orientationchange', () => {
    setTimeout(updateMaskState, 150);
    setTimeout(applyCanvasScale, 150);
  });
  window.addEventListener('resize', () => {
    updateMaskState();
    applyCanvasScale();
  });
  
  updateMaskState();
  applyCanvasScale();
})();

// ── 站内推荐弹层（后台称「拍脸图」，独立脚本，下架时删除此段及 splash.js 即可） ──
// 嵌入模式（Wiki iframe 内）不弹。
// 脚本名不得含 ad：旧名 interstitial-ad.js 命中广告拦截插件的 `-ad.js` 规则，
// 当天 23,039 次页面加载里只有 141 次真正请求到它，详见 splash.js 头部注释。
(function () {
  if (EMBED_MODE) return;
  var s = document.createElement('script');
  s.src = 'splash.js?v=20260807';
  s.async = true;
  document.head.appendChild(s);
})();

// ── 行为埋点（管理后台用户画像；带 xueai_sess Cookie 自动关联登录用户） ──
// 原先此处直接一发 /api/visit（只记路径，且 EMBED 模式不上报，阅读器内
// 行为全丢）。现由 track.js 接管：会话 + 行为链路 + 每页停留时长上报到
// /api/track，服务端同步写回 legacy visits/users 表，旧统计口径不断档。
// EMBED 模式（learn.html iframe 内）也照常加载，学习行为不再丢失。
(function () {
  try {
    var s = document.createElement('script');
    s.src = 'track.js?v=20260806';
    s.async = true;
    document.head.appendChild(s);
  } catch (e) { /* 埋点加载失败不影响浏览 */ }
})();

// ── 问问 Alice：划词提问/吐槽 + Alice 悬浮窗（独立脚本，下架删除此段即可）──
// 「我要吐槽」也在这个脚本里：由 Alice 对话式引导后转交 /api/feedback，
// 独立的 feedback.js 表单面板已于 2026-08-08 下线。
// EMBED 模式（learn.html iframe 内）也照常加载：阅读器里同样可以划词提问。
(function () {
  try {
    var s = document.createElement('script');
    s.src = 'ask-alice.js?v=20260809s';
    s.async = true;
    document.head.appendChild(s);
  } catch (e) { /* 加载失败不影响浏览 */ }
})();

// ── WaytoAIC 独立页登录墙：直连打开锁定课节时客户端拦截 ──
// 原站靠 Nginx 在服务端拦，静态托管没有服务端；阅读器路径由 learn.html 的
// 闸拦，这里补上"绕过阅读器直开课页"的口子。挡君子不挡小人（站本身开源），
// 目标是把访客引去注册，不是保密。免费口径与 auth.js 一致：prologue 篇章
// 整章免费，其余每篇章前 2 节免费；xa_auth=1（登录态）放行。
(function () {
  if (EMBED_MODE) return; // 阅读器 iframe 内由外壳闸管
  try { if (localStorage.getItem('xa_auth') === '1') return; } catch (e) {}
  var file = I18N.baseFile(WA_normFile(location.pathname.split('/').pop()));
  if (!file || !/\.html$/.test(file)) return;

  function onCourse() {
    var C = window.COURSE;
    if (!C || !C.parts) return;
    var free = {}, known = {};
    C.parts.forEach(function (part) {
      var files = [];
      (part.topics || []).forEach(function (t) {
        (t.lessons || []).forEach(function (l) { if (l && l.file) files.push(l.file); });
      });
      var freeAll = !!part.prologue || !!part.freeAll;
      files.forEach(function (f, i) {
        known[f] = 1;
        if (freeAll || i < 2) free[f] = 1;
      });
    });
    if (!known[file] || free[file]) return; // 不在课程表或本就免费

    var lang = (window.XUEAI_I18N && window.XUEAI_I18N.lang) || 'zh';
    var T = {
      zh: { h: '本节需要登录后学习（免费）', p: '注册登录即可解锁全部课程与进度云同步，不收费。', b: '去登录，免费学习' },
      en: { h: 'Sign in to continue (free)', p: 'Registering unlocks every lesson plus progress sync, at no cost.', b: 'Sign in free' },
      ko: { h: '로그인 후 학습할 수 있습니다(무료)', p: '가입하면 모든 강의와 진도 동기화를 무료로 이용할 수 있습니다.', b: '무료 로그인' }
    }[lang] || {};
    var reader = lang === 'zh' ? 'learn.html' : 'learn.' + lang + '.html';

    var st = document.createElement('style');
    st.textContent = 'main.lesson,article.lesson,.slide-container{display:none!important}'
      + '.wa-gatepage{min-height:70vh;display:flex;align-items:center;justify-content:center;padding:40px 20px;}'
      + '.wa-gatepage-card{max-width:460px;text-align:center;background:#fff;border:1.5px solid rgba(120,130,150,.2);'
      + 'border-radius:18px;padding:44px 36px;box-shadow:0 8px 28px rgba(15,23,41,.06);}'
      + '.wa-gatepage-card img{width:64px;height:64px;border-radius:14px;margin-bottom:18px;}'
      + '.wa-gatepage-card h2{font-size:20px;margin:0 0 10px;color:#0f1729;}'
      + '.wa-gatepage-card p{font-size:14px;color:#5b6577;line-height:1.8;margin:0 0 24px;}'
      + '.wa-gatepage-card a{display:inline-block;background:#1f6feb;color:#fff;text-decoration:none;'
      + 'font-size:15px;font-weight:700;border-radius:11px;padding:12px 30px;}';
    document.head.appendChild(st);
    var box = document.createElement('div');
    box.className = 'wa-gatepage';
    box.innerHTML = '<div class="wa-gatepage-card">'
      + '<img src="images/brand/waytoaic-mark.png" alt="WaytoAIC">'
      + '<h2>' + T.h + '</h2><p>' + T.p + '</p>'
      + '<a href="' + reader + '#' + encodeURIComponent(file) + '">' + T.b + '</a></div>';
    document.body.insertBefore(box, document.body.firstChild);
  }

  if (window.COURSE) { onCourse(); return; }
  var sc = document.createElement('script');
  sc.src = 'course-data.js?v=20260811a';
  sc.onload = onCourse;
  document.head.appendChild(sc);
})();

// ── WaytoAIC 访问人数：匿名随机 ID 按天去重（不记任何个人信息），数据存学习站自己的
//    Supabase（pv_hit RPC，表不对外直读）。阅读器内把统计 postMessage 给外壳显示；独立打开时显示在本顶条。──
(function () {
  var BASE = 'https://br-swift-pike-062ca892.supabase.aidap-global.cn-beijing.volces.com';
  var ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1wbGF0Zm9ybSIsInJvbGUiOiJhbm9uIiwiZXhwIjozNjgzNzE4MDQxfQ.OERqJGita64opa5WnjU4WjTg8nafjAeTnMUkZLwbG1U';
  var vid = null;
  try {
    vid = localStorage.getItem('wa_vid');
    if (!vid || !/^[a-f0-9]{16,64}$/.test(vid)) {
      var buf = new Uint8Array(16);
      if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(buf);
      vid = Array.prototype.map.call(buf, function (b) { return (b + 256).toString(16).slice(1); }).join('');
      if (!/^[a-f0-9]{32}$/.test(vid)) vid = (Date.now().toString(16) + Math.random().toString(16).slice(2)).replace(/[^a-f0-9]/g, '0').slice(0, 32).padEnd(32, '0');
      localStorage.setItem('wa_vid', vid);
    }
  } catch (e) { return; }
  fetch(BASE + '/rest/v1/rpc/pv_hit', { method: 'POST', headers: { 'apikey': ANON, 'Content-Type': 'application/json' }, body: JSON.stringify({ vid: vid }) })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (st) {
      if (!st) return;
      if (EMBED_MODE) { try { window.top.postMessage({ type: 'wa-pv', stats: st }, location.origin); } catch (e) {} return; }
      var bar = document.getElementById('nav-top-bar'); if (!bar) return;
      var L = ({ zh: ['访客 累计', '本月', '今日'], en: ['Visitors total', 'month', 'today'], ko: ['방문자 누적', '이달', '오늘'] })[I18N.lang] || ['访客 累计', '本月', '今日'];
      var el = document.createElement('span'); el.id = 'nav-pv';
      el.textContent = L[0] + ' ' + Number(st.total).toLocaleString() + ' · ' + L[1] + ' ' + Number(st.month).toLocaleString() + ' · ' + L[2] + ' ' + Number(st.today).toLocaleString();
      el.style.cssText = 'margin-left:10px;font-size:12px;color:#9ca3af;white-space:nowrap;';
      bar.appendChild(el);
    }).catch(function () {});

  // 「此刻在学」心跳：课程页在前台时每 60 秒报一次（pv_ping，见 supabase/pv_live.sql），
  // 首页读「近 3 分钟有心跳」的人数；切到后台不报，免得挂着不看的标签页也算在学
  function ping() {
    if (document.visibilityState === 'hidden') return;
    fetch(BASE + '/rest/v1/rpc/pv_ping', { method: 'POST', headers: { 'apikey': ANON, 'Content-Type': 'application/json' }, body: JSON.stringify({ vid: vid }) }).catch(function () {});
  }
  ping();
  setInterval(ping, 60000);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') ping(); });
})();

// ── WaytoAIC 知识点关联网络：数据+渲染都在 aic-rel.js，声明单点维护、反向自动 ──
(function () {
  try {
    var s = document.createElement('script');
    s.src = 'aic-rel.js?v=20260811a';
    s.async = true;
    document.head.appendChild(s);
  } catch (e) { /* 加载失败不影响浏览 */ }
})();

// ── 嵌入模式下的站内跳页：交给外壳换 hash，别让 iframe 自己跳 ──
// 课件正文里的站内链接（如 interview-* 的「用这些课程页组织答案」）写的是相对
// 路径。iframe 自己跳过去的话，外壳 learn.html 的 hash 和左侧目录都不会动，用户
// 落在一个没有目录、没有翻页条的裸页上，回不来。改成通知外壳换 hash 后，进度、
// 目录高亮、上一节/下一节都照常跟随。
// hash 里存的是中文基名（三个语言外壳共用一套 hash），所以要先还原语言后缀。
(function () {
  if (!EMBED_MODE) return;

  // 只接管指向同目录课程页的链接，外链和目录外的页面一律放行
  function targetLesson(a) {
    if (a.target && a.target !== '_self') return null;
    const href = a.getAttribute('href') || '';
    if (!/^[\w.-]+\.html(#.*)?$/.test(href)) return null;
    const file = I18N.baseFile(href.split('#')[0]);
    return SLIDE_ORDER.some(s => s.file === file) ? file : null;
  }

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // 新标签页打开，不拦
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    const file = targetLesson(a);
    if (!file) return;
    try {
      window.top.location.hash = '#' + encodeURIComponent(file);
      e.preventDefault();
    } catch (err) { /* 拿不到外壳（理论上跨域）时按普通链接走 */ }
  }, true);
})();

// 付费墙已停用，课程全部免费开放。
