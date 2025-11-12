# Accessibility Playbook (Shopify Theme Baseline)

> **文档职责**：把 Shopify 官方建议、WCAG 2.1 AA、ADA 及 EU 指令的要点凝练为 AI 可执行的检查清单。视觉风格仍可依据品牌调整，只要满足以下可访问性护栏。

---

## 1. 原则与参考框架

- **WCAG 2.1 AA**：以“可感知、可操作、可理解、可兼容”四大原则为准绳（文本替代、结构语义、键盘可达、兼容阅读器）。
- **ADA / W3C WAI-ARIA**：商家需提供有效沟通手段；无法满足的模块必须提供等效体验。
- **EU Web Accessibility Directive**：要求可访问性声明、反馈通道与定期监测报告。面向公众的 Blocks/Sections 应保留这些接口。
- **Shopify 设计建议**：可访问性是品牌体验的一部分——拥挤布局、闪烁动画、纯色区分都会降低理解和信任。

---

## 2. 设计与内容要求

### 2.1 文本、颜色与媒体
- 文本对比度 ≥ 4.5:1（正文）/ 3:1（大型标题）；黑白可替换为偏暖/偏冷的 off-white 与 charcoal 来保持品牌调性。
- 禁止以颜色作为唯一信息传递方式。配合图示、线型或文本提示（图表、状态标签、表单结果）。
- 图片/视频必须提供 **alt text**、描述或占位副本：  
  - 产品 & 内容图像：简述核心意图（“Model wearing X in desert”）。  
  - 图表：描述趋势或结论。  
  - 视频/音频：提供字幕、文字稿或手语版本。
- 禁止默认自动播放带声音的媒体；若业务必须，请把音量降至 20% 以下并提供暂停/静音。
- 避免高频闪烁或快速动画（< 3 次/秒），必要时提供“减少动效”开关。

### 2.2 布局与信息层级
- 维持认知节奏：  
  - 单列阅读宽度 ≤ 72 字符；长文本分栏或与图像搭配。  
  - 采用可预期的导航/布局（购物车在右上、主导航在顶部/左侧），在此基础上用字体、照片、色板建立品牌差异。
- “海量 vs 留白”平衡：避免拥挤，让段落之间至少保留 `space-y-6`，卡片组之间 `gap-6`。
- 提供“最差网络”保障：图像/视频需有低分辨率或静态 fallback；避免强依赖客户端脚本才能加载的核心内容。

### 2.3 交互 & 动效
- 所有可交互元素：
  - 最小尺寸 44 × 44px；触控/键盘状态一致（`focus-visible:ring-2` 与 hover 同层级）。
  - 支持键盘与实体输入：`tab`/`shift+tab` 顺序与视觉顺序一致。
  - 禁止 hover-only 文案（移动端不可触达），必须给出点击式入口或 `aria-describedby`。
- 动效合同：默认 `transition duration-200 ease-out`，active 态 `scale-95` 或亮度降低且不与晕眩/闪烁冲突。对 `prefers-reduced-motion` 用户只保留淡入淡出。

### 2.4 表单、流程与帮助
- 输入框提供明显的 label、占位符仅作示例；错误提示置于字段附近并用颜色 + 文本 + 图标同时标识。
- 多步骤流程需展示进度与“保存/返回”能力。长表单可拆分 Section 并提供“帮助中心/聊天”入口。
- 提供站点级 help & feedback：  
  - Footer 中包含 Accessibility Statement 和反馈链接。  
  - Section/Block 可通过 `settings` 暴露“可访问性说明”字段，自动渲染在 `<details>` 内。

---

## 3. 审核清单（AI/自动生成模块必须遵守）

1. **结构**：正确使用 `<h1-h6>`, `<nav>`, `<main>`, `<button>` 等语义标签；aria 属性只用于补充信息，不替代语义结构。
2. **替代文本**：`img`, `svg`, `video`, `audio`, `iframe` 均需 `alt`、`title`、`aria-label` 或字幕。
3. **对比度**：自动检查 `text-foreground` 与背景、`text-primary-foreground` 与 `bg-primary` 等组合；卡片边框与背景的差值 ≥ 1.5:1。
4. **键盘导航**：Tab 顺序与视觉一致，焦点可见且不会被 `outline: none` 移除。
5. **动效**：无自动播放音频/视频；无 >3Hz 闪烁；尊重 `prefers-reduced-motion`。
6. **反馈与帮助**：全站 footer 必须包含 Accessibility Statement & Feedback 链接；关键表单提供成功/失败提示。
7. **监控与迭代**：新增 Section/Block 时附上可访问性说明（必要时在 schema `info` 字段记录），方便人工或自动化审查。

---

## 4. 与其余文档的关系

- `docs/ai_design_principles.md`：本指南的要求会被纳入“Accessibility & Input Parity”章节。
- `docs/design_tokens_guide.md`：颜色、排版、动效全部由 tokens 控制，确保可访问性调整可以通过设置完成。
- `docs/visual_spec.md`：提供实现所需的 Tailwind 类（例如 `text-foreground/80`, `focus-visible:ring-2 ring-primary/50`）。
- `docs/color_scheme.md` & `docs/brand_color_playbook.md`：说明如何创建满足对比度又有品牌差异的色板。

遵循以上清单即可在保持品牌多样性的同时满足法律和体验上的可访问性标准。 
