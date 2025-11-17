# Visual Spec（Tailwind 语义用法）

本规范衔接“抽象设计原则”(见 `docs/ai_design_principles.md`)、品牌色策略（`docs/brand_color_playbook.md`）、可访问性清单（`docs/accessibility_playbook.md`）与“设计令牌”(见 `docs/design_tokens_guide.md`)。它回答一个问题：**在 Section / Block / Snippet 中具体写哪些 Tailwind 类，才能完全继承主题的 tokens 与 color scheme？**  
所有示例均假设 Section 根节点包裹 `class="color-scheme color-{{ section.settings.color_scheme | default: 'scheme-1' }}"`。

---

> **创意窗口（Hero / 购买页 / Campaign）**  
> - 允许突破下文部分的严格限制，例如更大胆的排版比例、渐变或层级。  
> - 自由区块必须引用新增 expressive tokens（`--display-scale`, `--hero-max-width`, `--brand-boldness` 等）或 color scheme 语义色，避免写死 hex。  
> - 常规 Section 仍按基础规范执行；在 schema 中提供显式开关以决定是否进入创意模式。

## 1. 布局基础

- **移动端优先**：无断点类代表最终移动体验；仅在 `md:` 变成多列或拓展留白，`lg:` 增强桌面体验。
- **安全边距**：页面顶部容器使用 `px-4 sm:px-6 lg:px-8`。若使用自定义容器，套用 `.container-custom`.
- **栅格**：
  - 单列 → `grid grid-cols-1 gap-6`
  - 双列在 `md:` 打开：`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8`
  - 商品/文章网格：`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8`
- **Flex 间距**：`gap-4` 为默认，紧凑内容用 `gap-2`，CTA 区块可用 `gap-3`。
- **Section 垂直节奏**：根节点 `py-12 sm:py-16 lg:py-20`；区块之间用 `mb-8` 或 `mb-12`。Hero/购买区块可通过 `style="padding-block: calc(var(--section-spacing)*1.5)"` 或 `py-[clamp(4rem,6vw,10rem)]` 放大节奏。

---

## 2. 颜色语义

| 角色 | Tailwind 类 | 典型用途 |
|------|-------------|----------|
| 页面背景 | `bg-background text-foreground` | Section/页面主体（推荐） |
| Surface（卡片/模态） | `bg-surface text-foreground shadow-sm rounded-lg` | 浮起的卡片容器；保持与父级背景对比 |
| Muted Surface | `bg-surface-muted text-foreground` | 分组背景、空状态（可选） |
| Primary CTA | `bg-primary text-primary-foreground` | 主按钮、badge |
| Secondary CTA | `.btn.btn-outline-primary`（描边/透明背景；`.btn.btn-secondary` 为兼容别名） | 次按钮、ghost CTA |
| 文本语义 | `text-foreground`（正文）、`text-muted`（说明/占位） | 任何文本 |
| 分隔线/边框 | `border border-border`、`divide-border/60` | 列表、卡片分隔 |
| 输入 | `bg-input border-input-border text-input-foreground` | Input/textarea |
| 反馈 | `text-error`, `text-success`, `text-warning` | 校验、状态 |
| 装饰块 | `bg-primary-soft`, `bg-decorative` | Hero tint、标签 |
| 反色块 | `bg-inverse text-inverse-foreground` | 深色 Footer / Toast |

规范：
- 默认使用语义类；如需渐变或霓虹高光，请以 scheme 变量为来源（例如 `bg-[radial-gradient(circle_at_top,_var(--color-primary)_0%,_transparent_70%)]` 或 `from-[color(display-p3_var(--color-primary-rgb))]`），不可硬编码固定 hex。
- Section 或 Block 的根背景由 `color-scheme` 决定，默认 `bg-background`。浮起卡片/模态一律使用 `bg-surface`，需要更软的分组背景再切换 `bg-surface-muted`。
- 单色背景不使用 border 分割，使用 `shadow-*` 或不同 surface 层级。
- 透明叠加通过 `/opacity`：如 `bg-primary/10`, `text-foreground/70`。

按钮交互状态与类组合的详细规则请参阅 `docs/ai_design_principles.md` 的“交互状态合约（按钮）”，避免在多个文档重复维护。

---

## 3. 排版系统

### 3.1 字体家族
- 根节点：`<body class="font-body antialiased text-foreground bg-background">`
- 需要强调的标题：`font-heading`（可与 `tracking-tight` 搭配）。

### 3.2 语义层级

| 角色 | Tailwind 组合 | 场景 |
|------|---------------|------|
| **Display / Hero** | `text-5xl sm:text-6xl font-bold tracking-tight text-foreground` | 首页主标题 |
| **H1 / 页面标题** | `text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground` | 列表页主标题 |
| **H2 / 区块标题** | `text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4` | Section 标题 |
| **H3 / 卡片标题** | `text-2xl font-semibold text-foreground` 或 `text-xl font-semibold` | 卡片或详情子区块 |
| **Eyebrow / Meta** | `text-xs font-medium uppercase tracking-[0.2em] text-muted` | 标题上方标签 |
| **Body** | `text-base leading-relaxed text-foreground` | 正文段落 |
| **Body Small** | `text-sm leading-relaxed text-muted` | 摘要、次要信息 |
| **Label / CTA 文案** | `text-sm font-medium` 或 `text-base font-medium` | 按钮、标签 |

规则：
- 为阅读区域设置 `max-w-3xl` 并保持 `leading-relaxed`。
- 行间距最小 `leading-normal`，长文使用 `leading-relaxed`。
- 标题与正文间距：`mb-6`（大标题）、`mb-4`（中标题）、`mb-2`（卡片标题）。
- Hero/购买标题可通过 `style="font-size: calc(var(--display-scale) * 1.2rem)"` 或 `text-[clamp(2.5rem,_var(--display-scale)*3vw,_5rem)]` 放大比例，搭配 `text-balance`、`leading-tight`，避免文字重叠。

---

## 4. 间距与节奏

- **刻度**：默认使用 Tailwind 间距类（4px 基线）。只有 Hero/购买/装饰块才允许 `clamp()` 或 `style` 自定义值，且需引用 `--section-spacing`、`--content-padding` 等变量。
- **内边距**：
  - 主按钮：`px-5 py-3`（默认），大型 CTA `px-6 py-3`.
  - 卡片：`p-5`（紧凑）或 `p-6`（默认）。
  - Section：`py-12 sm:py-16`，配合 `px-4 sm:px-6`。
- **外边距**：
  - 标题组：`mb-10`（display）、`mb-8`（section）。
  - 正文段落：`mb-4`。
  - 列表或卡组：`space-y-6` / `gap-6`。
- **Gap**：按钮/标签 `gap-2`，卡片栅格 `gap-6`，视觉留白 `gap-8` 以上。
- **Safe Area**：所有 Section 内的内容容器需 `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8` 或 `.container-custom`。

### 4.1 Hero / 购买页例外

- 使用 `max-w-[var(--hero-max-width)]` 或 `style="max-width: var(--hero-max-width)"` 控制文案宽度，可在同一 Section 中混合左对齐与居中布局。
- 可以叠加 `translate`、`rotate`、`clip-path` 等效果，但需通过 schema 的“expressive”布尔值或 `brand_boldness` 来控制，避免常规 Section 误触发。
- 若必须自定义 `gap`/`padding`，请通过 `calc(var(--content-padding) * 1.5)` 等方式引用 token，保证主题设置仍能影响布局。

---

## 5. 海拔、圆角与媒体

- **阴影层级**：`shadow-none`（表格头）、`shadow-sm`（普通卡片）、`shadow-md`（可点击卡片 hover）、`shadow-lg`（浮层）、`shadow-xl`（模态）。使用 `hover:shadow-lg` + `transition-shadow`.
- **圆角**：默认 `rounded-lg`（卡片、图片）、`rounded-full`（Chip、Avatar）。Hero 或模态使用 `rounded-2xl` 按品牌需要。
- **媒体处理**：
  - 图片：`rounded-lg shadow-md w-full object-cover`.
  - 视频/iframe 容器：`aspect-video rounded-lg overflow-hidden`.
- **分隔**：使用 `divide-y divide-border/60` 或 `border-border/60` 代替阴影。

---

## 6. 组件模式

### 6.1 按钮

| 类型 | 类组合 |
|------|--------|
| Primary | `btn btn-primary`（可叠加 `w-full`, `text-lg` 等尺寸类） |
| Secondary / Outline | `btn btn-outline-primary`（描边/透明背景，承袭主色；`.btn.btn-secondary` 为兼容别名） |
| Text / Ghost | `btn px-3 py-2 text-primary bg-transparent hover:bg-primary/10` |

所有按钮遵循最小 44px 高度，可通过 `min-h-11` 保证触控。

### 6.2 卡片 & Surface

```
<article class="bg-surface text-foreground rounded-xl shadow-sm p-6 flex flex-col gap-4">
  <div class="flex items-center justify-between text-sm text-muted">
    ...
  </div>
  <h3 class="text-xl font-semibold text-foreground">标题</h3>
  <p class="text-sm text-muted leading-relaxed line-clamp-3">摘要</p>
  <div class="mt-auto flex items-center justify-between">
    <span class="text-primary font-medium">了解更多</span>
    <button class="btn btn-outline-primary">Action</button>
  </div>
</article>
```

- 可点击卡片在 `hover:` 提升为 `shadow-lg` 并 `translate-y-[-2px]`。
- 列表型卡片使用 `divide-y divide-border/60` 实现条目分隔。

### 6.3 表单元素

```
<label class="flex flex-col gap-2 text-sm font-medium text-foreground">
  Email
  <input class="h-11 px-4 rounded-lg border border-input-border bg-input text-input-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus:border-primary transition" />
  <p class="text-xs text-muted">我们不会发送垃圾邮件</p>
</label>
```

- 错误态：`border-error focus-visible:ring-error/50 text-error`.
- 禁用：`opacity-60 bg-surface-muted cursor-not-allowed`.
- 输入组 `gap-4`；按钮与输入对齐使用 `w-full`.

### 6.4 列表、标签与导航

- 标签/Chips：`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-muted text-foreground text-sm`。
- Meta 行：`flex items-center gap-2 text-xs text-muted`。
- 导航：
  ```
  <nav class="flex items-center gap-3 text-sm font-medium text-muted">
    <a class="px-3 py-2 rounded-full hover:bg-surface-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/40">Link</a>
  </nav>
  ```
- 列表容器 `space-y-6` 或 `divide-y divide-border/60`。

### 6.5 Hero / Section wrapper

```
<section class="color-scheme color-{{ section.settings.color_scheme | default: 'scheme-1' }} bg-background">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-10">
    <div class="max-w-3xl space-y-6">
      <p class="text-sm uppercase tracking-[0.2em] text-muted">Eyebrow</p>
      <h1 class="text-5xl sm:text-6xl font-bold tracking-tight text-foreground">标题</h1>
      <p class="text-lg leading-relaxed text-muted">说明文案</p>
      <div class="flex flex-wrap gap-3">
        <a class="btn btn-primary">主操作</a>
        <a class="btn btn-outline-primary">次操作</a>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-6 text-muted text-sm">
      ...
    </div>
  </div>
</section>
```

要点：Hero 背景可改为 `bg-primary-soft` 或 `bg-surface-muted`，但文字始终使用 `text-foreground` 与 `text-muted`。

---

## 7. 响应式与动效

- **断点策略**：
  - `sm:`：微调排版（如 `text-base sm:text-lg`）、按钮 padding、flex 方向。
  - `md:`：切换栅格列数、展示侧栏。
  - `lg:`：增加留白 (`lg:px-8`)、最大宽度 `lg:max-w-7xl`、让卡片更宽松 (`lg:gap-8`)。
- **动效**：
  - 统一使用 `transition-all duration-200 ease-out` 或 `transition-colors`.
  - Hover 降低亮度/提升阴影；Active 使用 `scale-95`.
  - `focus-visible:ring-2 ring-primary/50` 保证无障碍。

---

## 8. 文档协同

- **为何**：保持 AI、人工与自动生成模块共享同一“语义类库”。
- **怎么做**：
  1. 在设计阶段参考 `docs/ai_design_principles.md` 确认结构限制。
  2. 调整品牌外观时，看 `docs/design_tokens_guide.md` 了解可配置令牌。
  3. 需要新增或扩展色板时，遵循 `docs/color_scheme.md`。
  4. 撰写 Section/Block 时，用本文件的类组合；若缺少语义，先扩展 tokens 再新增类。

遵循以上流程即可确保任何自动生成的页面与人工模块都共享一致的视觉语言。 

## 9. SEO & 语义提示
- Section 默认从 `<h2>` 开始，整页只保留一个 `<h1>`（通常在模板内），与 `docs/seo_playbook.md` 对齐。
- 图片/视频输出 `alt`、`title`、`loading="lazy"`、`decoding="async"`；首屏关键视觉可用 `loading="eager"` 提升 LCP。
- Hero/导航等结构使用 `<header>`, `<nav>`, `<main>`, `<footer>` 等语义标签，Breadcrumb 区块附带 `aria-label="breadcrumb"` 并加载 JSON-LD。
- CTA 采用 `<a>` + 明确动作文案，避免 “点击这里”。内部链接路径使用 Shopify 资源 URL，利于 sitemap。
- 列表/集合使用 `<ul>/<ol>` 包裹卡片；表格/规格使用 `<table>` 或 `<dl>`，增强爬虫理解。
- 所有动态内容需要占位/骨架，避免布局跳动影响 CLS（亦有助于 SEO 与可访问性）。
