# Design Tokens Guide

本指南定义“设计令牌”层负责的内容：它描述如何通过 Shopify 设置驱动颜色、排版、间距、半径、阴影与组件尺寸，并把这些值映射到 CSS 变量与 Tailwind 语义工具类。文档不涉及具体页面布局（见 `docs/visual_spec.md`），也不重新阐述抽象设计理念（见 `docs/ai_design_principles.md`）。

---

## 1. 令牌运行链路

```
Shopify Theme Settings (settings_schema.json)
     ↓ 用户或 AI 在主题编辑器修改 → settings_data.json / config/themes/*.json
Liquid 注入 (layout/theme.liquid + snippets/color-schemes.liquid)
     ↓
CSS 自定义属性 (:root / .color-scheme.color-*)
     ↓
Tailwind 语义类 (tailwind.config.js withOpacityValue)
     ↓
Sections & Snippets 中的 `bg-* / text-* / shadow-*` 等实用类（见 visual_spec）
```

**关键职责**：
- `settings_schema.json`：定义可配置的令牌和默认值。
- `settings_data.json`：记录当前主题实例使用的值。AI 在生成品牌风格时应优先修改此文件或创建 `config/themes/*.json` 预设。
- `snippets/color-schemes.liquid`：把每个 color scheme 输出为 CSS 变量（含 RGB）。
- `layout/theme.liquid`：注入非 scheme 类令牌（排版、间距、组件尺寸等）。
- `tailwind.config.js`：把 CSS 变量映射到语义 Tailwind 颜色名称，例如 `bg-background`、`text-foreground`、`text-muted`、`bg-primary`、`border-border`、`bg-surface-muted` 等。

---

## 2. 令牌分层

### 2.1 基础颜色（全局 Brand Tokens）

| Setting ID | CSS 变量 | Tailwind 语义类 | 用途 |
|------------|----------|------------------|------|
| `color_primary` | `--color-primary(-rgb)` | `bg-primary`, `text-primary` | 默认主品牌色（也作为 scheme fallback） |
| `color_accent` | `--color-accent(-rgb)` | `text-accent`, `bg-decorative` | 链接/徽章（默认继承 primary） |
| `color_background` | `--color-background(-rgb)` | `bg-background` | 页面基底 |
| `color_text` | `--color-text(-rgb)` | `text-foreground` | 主体文字 |
| `color_text_secondary` | `--color-text-secondary(-rgb)` | `text-muted` | 次级文字 |
| `color_border` | `--color-border(-rgb)` | `border-border` | 边框与分隔 |
| `color_error/success/warning` | `--color-{role}` | `text-error`, `bg-success/10` | 反馈状态 |

> **注意**：Section/Block 仍以 color scheme 为准；当元素未包裹 `color-scheme color-xxx` 类时使用上述全局值作为退化。链接/Accent 默认复用主色，次按钮通过描边/透明背景表现，不再需要额外色值。

### 2.2 Color Scheme 角色

每个 scheme 在 Shopify `color_scheme_group` 中定义 18 个角色。`snippets/color-schemes.liquid` 会衍生 surface、muted、inverse、primary-soft 等变量。Tailwind 中可直接使用的常用语义：

- 背景：`bg-background`, `bg-surface`, `bg-surface-muted`, `bg-inverse`, `bg-inverse-surface`
- 文本：`text-foreground`, `text-muted`, `text-inverse-foreground`
- CTA：主按钮使用 `.btn.btn-primary`（实体填充），次按钮使用 `.btn.btn-outline-primary`（仅描边，`.btn.btn-secondary` 为兼容别名），不要自定义渐变或反色 hover
- 边框 & 分隔：`border-border`, `divide-border/60`
- 装饰：`bg-primary-soft`, `bg-decorative`
- 输入：`bg-input`, `text-input-foreground`, `border-input-border`
- 反馈：`text-error`, `text-success`, `text-warning`

色板的完整策略、如何扩展 scheme、如何在 Section/Block 内引用，请参考 `docs/color_scheme.md`。

### 2.3 排版令牌

| Setting / Token | 描述 | 使用位置 |
|-----------------|------|----------|
| `font_heading`, `font_body` | 字体家族 | `layout/theme.liquid` 写入 `--font-heading`, `--font-body`，在 `body` 或 `font-heading/font-body` 类中引用。Liquid 通过 `{{ settings.font_* | font_face: font_display: 'swap' }}` 自动输出 `@font-face`，无需再手动维护 Google Fonts `<link>`。 |
| `text_size_*` | XS–XL 尺寸范围 | 供 AI 在 `visual_spec` 约定的排版层级中选择合适的 Tailwind 组合 |
| `font_weight_normal/bold` | 字重上限 | 配合 `font-normal`, `font-bold`, `font-semibold` |
| `line_height_*` | 行高基线 | 与 `leading-snug/relaxed` 等 Tailwind 类配合 |
| `display_scale` | Hero/购买页标题的倍率 | 通过 `var(--display-scale)` 控制 `text-[clamp()]` 或 `text-balance` 方案，允许生成器放大或收紧展示级别排版 |
| `hero_content_max_width` | `--hero-max-width` | Hero/购买页正文容器的最大宽度，便于控制“对齐 vs 迭代”体验 |

排版的具体层级、断点策略、使用示例由 `docs/visual_spec.md` 主导。

### 2.4 间距与布局令牌

| Setting ID | 影响 | 常见 class / 属性 |
|------------|------|--------------------|
| `spacing_base` | Tailwind 间距刻度的认知基线（4px 或 8px） | AI 仅使用 `p-* / m-* / gap-*` 等固定刻度 |
| `content_padding` | `--content-padding` 用于 `container-custom` | `px-[var(--content-padding)]`（已封装在 CSS） |
| `section_spacing` | `--section-spacing` | Section 上的 `py-[var(--section-spacing)]`（或通过 CSS 类） |
| `grid_gap` | `--grid-gap` | 自定义网格/幻灯片组件 |
| `container_max_width` | `--container-max-width` | `.container-custom` 最大宽度 |

### 2.5 形状与阴影

| Setting | CSS 变量 | 用法 |
|---------|----------|------|
| `border_radius_*` | `--radius-sm/md/lg/xl/full` | `.btn`, `.card`, `.chip` 自定义类以及 Tailwind `rounded-*`（通过约定选取） |
| `border_width` | `--border-width` | `border` 默认宽度 |
| `shadow_none` ~ `shadow_2xl` | `--shadow-*` | `.shadow-sm/md/lg` 组件类；也可在自定义 CSS 中引用 |

### 2.6 组件尺寸

按钮、卡片、输入、导航的 padding、间距、行高等均通过 `--button-*`, `--card-*`, `--input-*`, `--nav-*` 写在 `layout/theme.liquid` 中，可在自定义组件类或 `@apply` 中使用。Tailwind 实用类仍是首选；这些变量保证非 Tailwind 自定义 CSS 也能跟随设置。

### 2.7 品牌个性 & 交互

| Setting | 作用 |
|---------|------|
| `brand_density`, `brand_scale`, `brand_boldness` | 用于在 CSS 中计算 `--density-multiplier`、`--scale-multiplier`、`--brand-boldness`，AI 可决定是否读取这些变量来自适应 spacing/阴影。 |
| `transition_duration`, `hover_opacity`, `hover_scale`, `active_opacity` | 控制 `.btn`、`.chip` 等组件的互动手感。 |

### 2.8 Tokens × 性能与 SEO
- **字体**：`font_heading/body`、`font_weight_*`、`line_height_*` 必须与 `font-display: swap` 和 `leading-relaxed` 等策略配合，避免 FOIT、提升可读性。
- **颜色与对比**：`color_*` 影响 WCAG 对比与 SEO 可读性。创建新 palette 时参考 `docs/accessibility_playbook.md` 与 `docs/seo_playbook.md` 的对比检查。
- **Spacing/Layout**：`spacing_base`, `content_padding`, `section_spacing` 决定可视密度。拥挤布局会降低可访问性、SEO 分数；尽量保持统一节奏以减少额外 CSS。
- **媒体尺寸**：`card_padding`, `button_padding`, `grid_gap` 等 token 影响组件盒子大小，也决定懒加载/骨架占位的一致性。保持 tokens 稳定可减少 CLS。
- **交互 Token**：`transition_duration`, `hover_scale` 与 `prefers-reduced-motion` 逻辑配合，避免影响性能，同时满足 SEO 对“最差网络”体验的要求。

---

## 3. 编辑流程

1. **确定变更范围**  
   - 仅需为当前店铺换肤 → 修改 `config/settings_data.json > current`。  
   - 需要复用的品牌预设 → 在 `config/themes/` 新建 JSON，并在 `settings_data.json` 引用。  
   - 需要新增可配置项 → 修改 `config/settings_schema.json`（谨慎，需保持与 Liquid/CSS 对应的变量名一致）。  
   - 需要插入追踪/第三方 `<script>` 或额外字体 `<link>` → 首选 `settings.custom_head_markup`（Theme Editor 中的「Custom Code」区域），避免直接改 `layout/theme.liquid`。

2. **更新运行时代码（如有必要）**  
   - 新增颜色角色 ⇒ 同步更新 `snippets/color-schemes.liquid` 与 `tailwind.config.js`。  
   - 新增新的尺寸/间距变量 ⇒ 在 `layout/theme.liquid` 中写入 CSS 变量 & fallback。  
   - 不得在组件内写死颜色/尺寸；所有值必须指向令牌。

3. **验证**  
   - 运行 `npm run build`，确保 Tailwind 能拾取新的语义类。  
   - Shopify 主题编辑器中切换 scheme 或 preset，确认 Section/Block 跟随变化。  
   - 使用 `rg '#[0-9A-Fa-f]{3,6}' sections snippets` 保障无硬编码色值。

---

## 4. AI & 自动化约束

- **只改配置，不改源码**：当需求可以通过令牌完成时，不要在 Section/Block 中硬编码样式。
- **优先使用语义类**：`bg-primary`, `text-foreground`, `border-border`, `shadow-lg`, `rounded-lg` 等；不要引用 Tailwind 默认 `blue-500` 或 `gray-900`。
- **保持文档协同**：
  - 设计原则 → `docs/ai_design_principles.md`
  - 令牌定义与编辑流程 → 本文
  - Tailwind 使用/组件规范 → `docs/visual_spec.md`
  - Color scheme 体系与扩展 → `docs/color_scheme.md`
- **记录 preset**：为自动生成的品牌风格创建 `config/themes/{brand}.json`，并在 README 或 Git commit 中说明用途。

---

## 5. 速查：文件与职责

| 文件 | 作用 |
|------|------|
| `config/settings_schema.json` | 定义所有设计令牌、color scheme 角色与默认值 |
| `config/settings_data.json` | 当前主题实例的令牌值；AI 修改品牌风格的入口 |
| `config/themes/*.json` | 可复用的完整预设 |
| `snippets/color-schemes.liquid` | 把每个 scheme 写成 CSS 变量（含 derived surfaces） |
| `layout/theme.liquid` | 把非颜色令牌写成 CSS 变量，注入 `:root` |
| `tailwind.config.js` | 映射 CSS 变量 → Tailwind 语义颜色 |
| `src/css/tailwind.css` | 备份默认值，并通过 `@layer` 定义基于令牌的全局组件 |

将所有视觉决策收敛到这些配置即可保证 AI 模块、新版块和人工修改共用同一视觉语言。下一步请前往 `docs/visual_spec.md` 学习如何在 Section/Block 中选择正确的类组合。 
