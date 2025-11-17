# AI 设计系统核心原则（Shopify × Material Design）

本规范为 AI 自动生成页面与区块时的唯一视觉基线，基于 Material Design 思想并匹配当前 Tailwind Shopify 主题。所有新增内容必须遵循以下规则，同时可以通过配置不同 tokens / color schemes 来实现多风格品牌。

> **文档职责**：仅描述框架无关的设计原则与交互约束。  
> - Token 配置见 `docs/design_tokens_guide.md`  
> - Tailwind 使用规范见 `docs/visual_spec.md`  
> - 可访问性与法务要求见 `docs/accessibility_playbook.md`  
> - 品牌配色策略见 `docs/brand_color_playbook.md`  
> - SEO 与内容结构见 `docs/seo_playbook.md`

> **Guardrail × Creative 模式**  
> - 默认遵循下文的严谨规范以保持跨 Section 一致的材料语言。  
> - Hero、购买页、Campaign 等情绪化模块可切换为“expressive 模式”，允许更大胆的排版、渐变和节奏，但必须引用主题 tokens（`--display-scale`, `--hero-max-width`, `brand_boldness` 等）并遵守可访问性。  
> - Schema 中应暴露开关来标记哪些区块可以进入 expressive 模式，以避免普通内容受影响。

## 1. 核心理念：移动端优先的“材料”
- **Mobile is Default**：所有样式必须首先在无断点前缀（如 md:）的情况下完美呈现。
- **Everything is a Surface**：背景为海拔 0，其余元素都以卡片或按钮的形式悬浮；通过 `bg-*`、`rounded-*`、`shadow-*` 组合表达材料属性。
- **Elevation Contract**：仅用阴影+位移表现层级，禁止用 border 分隔同色块。

| 海拔层级 | 常用组件 | Shadow/行为 |
| --- | --- | --- |
| Level 0 | 页面背景、section wrapper | `shadow-none`, `bg-background` |
| Level 1 | 静态卡片、输入框 | `shadow-sm`, 不移动 |
| Level 2 | 可点击卡片、悬浮导航 | 默认 `shadow-sm` → hover `shadow-lg translate-y-[-2px]` |
| Level 3 | 模态、重要浮层 | `shadow-xl`, 可配合 `backdrop-blur` |

> 只允许同一 Section 内出现 2 个可见层级，避免“多层玻璃”导致视觉疲劳。

## 2. 布局与间距
### 2.1 间距标尺
- 常规内容应使用主题间距刻度（4px 基础的 `p-1, p-2, p-3, p-4, p-6…`），保持节奏统一。
- Expressive 模块可以使用 `clamp()` 或 `calc(var(--section-spacing)*1.5)` 等写法拓宽节奏，但必须引用 tokens；禁止硬编码毫无语义的 `gap-[18px]`。

### 2.2 内容安全边距
- 移动端页面内容必须使用统一的水平内边距（默认 `px-4` 或 `px-6`）。
- 满屏背景图或轮播也需在内容容器层面加安全边距，避免文字与屏幕边贴合。

### 2.3 响应式断点
- `md:`（平板）仅用于把单列拓展为多列或增加分栏间距。
- `lg:`（桌面）仅用于增加两侧留白、提升海拔或添加补充装饰；避免在多个断点重复声明。
- 除非组件在桌面需要显著不同的体验，否则不新增 `xl:` 规则。

## 3. 角色驱动的色彩
### 3.1 Shopify Scheme 为唯一来源
- 默认使用 color scheme 语义色；如要创建渐变、霓虹高光或品牌纹理，需用 `var(--color-*-rgb)` 构建（可结合 `color(display-p3 ...)`），严禁硬编码 `#123456` 或 `bg-blue-500`。
- 仅引用 `settings_schema.json`、`settings_data.json` 中定义的语义色（如 `settings.color_primary`、`settings.color_text`、`settings.color_background`）。
- 通过 `color-scheme` 包裹与语义 Tailwind 工具（`bg-background`, `text-foreground`, `bg-primary` 等）绑定颜色。
- 品牌差异通过 `docs/brand_color_playbook.md` 中的流程创建新 scheme；不要在组件中硬编码色值。

### 3.2 操作意图一致
- **Primary actions**：所有关键操作使用 `.btn.btn-primary`（主色填充 + 统一 hover）。
- **Secondary actions**：统一采用 `.btn.btn-outline-primary`（描边/透明背景），不要自定义渐变或反色。
- **Destructive actions**：破坏性操作仅使用 `settings.color_error` 及匹配的语义工具类。
  
实现细则（类名与状态）请参见 `docs/visual_spec.md` 的按钮规范；本节仅约束语义与一致性。

### 3.3 对比度、反色与辅助状态
- 文本与背景必须满足 WCAG AA（至少 4.5:1）。使用 `text-foreground`/`text-muted` 配合 `bg-background`/`bg-inverse` 保证层级；当需要浮起层次时，在内层容器使用 `bg-surface`。
- 透明度叠加（如 `bg-primary/10`）时需重新检查对比度。
- 反色模块（深色 footer、hero overlay）使用 `bg-inverse` + `text-inverse-foreground`，不得混用浅色文本类。
- 错误/成功/警告必须由 `text-error` 等语义类驱动，禁止将品牌色复用为危险状态。

## 4. 意图明确的排版
- 默认使用 `docs/visual_spec.md` 中定义的 Tailwind 组合（如 `text-5xl sm:text-6xl`、`text-3xl sm:text-4xl`、`text-base leading-relaxed` 等）；Expressive 模块可以结合 `--display-scale`、`text-[clamp()]` 或 `tracking-[theme(...)]` 调整层级，但仍需引用 tokens。
- `font-heading` 与 `font-body` 在 `layout/theme.liquid` 中已注入，保持与 tokens 对齐。
- 长文本（商品描述、博客、常见问题）默认 `leading-relaxed`，需要紧凑节奏时再降级；不要将正文行高低于 `leading-normal`。
- 行长控制在 60–72 字符；超出时用分栏或图文布局分割。
- 标题层级之间至少 8px 间距；Eyebrow 使用全大写 + `tracking-[0.2em]`。
- Display 级标题可以更具装饰性，但正文/CTA 必须选择易读字重。

## 5. 可预测的组件尺寸
- 所有交互元素（按钮、链接、标签、输入框、图标按钮）需保证 44×44px 的最小触控目标，可根据需要通过 `py-3 px-4`、`min-h-11`、`min-w-11` 达成。
- 卡片与列表项需要统一的内边距节奏（通常为 `p-4` 或 `p-6`），避免同一模块内出现多个间距体系。

## 6. 交互状态合约
AI 必须严格执行下列状态；只允许在描述的范围内选择具体 Tailwind 工具类。

### 6.1 按钮（Primary / Secondary / Text）
- **Primary（填充）**
  - 默认：`bg-primary text-primary-foreground shadow-sm`，圆角遵循 tokens。
  - `hover:` 提升海拔或降低亮度（`shadow-md` 或 `brightness-90`）。
  - `focus-visible:` 统一使用 `ring-2 ring-primary/50 outline-none`。
  - `active:` 模拟按压（`scale-95` 或 `brightness-75`），不可叠加额外动画。
  - `disabled:` `opacity-50 cursor-not-allowed`，禁止触发 hover/active。
- **Secondary（描边）**
  - 默认：`border border-primary text-primary bg-transparent`。
  - `hover:` 仅允许添加浅色填充（`bg-primary/10`）。
  - 其他状态沿用 Primary 的 focus/active/disabled 约束。
- **Text（幽灵按钮）**
  - 默认：`text-primary bg-transparent`，无描边。
  - `hover:` 仅允许浅色填充（`bg-primary/10`），与 Secondary 保持一致的视觉反馈。
  - 其他状态沿用 Primary 的 focus/active/disabled 约束。

### 6.2 卡片 / Surface
- 默认：`bg-background shadow-sm rounded-lg`；如需更强的层次（卡片/模态内部容器），可在内层使用 `bg-surface`。
- `hover:` 只有可点击卡片才提升海拔（`shadow-lg translate-y-[-2px]`）；静态卡片保持不变。
- 所有卡片都应与父级 `color-scheme` 对齐，并在需要时通过 `divide-*` 或 `border-border/50` 表现分隔。

### 6.3 表单输入
- 默认：语义边框与背景（`border-border bg-surface` 或基于 tokens 的映射）。
- `focus:` 必须使用主色高亮（`ring-2 ring-primary/50 border-primary`），并删除浏览器默认 outline。
- `error:` 使用 `border-error` 与 `ring-error/50`，错误消息用 `text-error`。
- `disabled:` `opacity-50 bg-surface-muted cursor-not-allowed`，保持可读但不可交互。

### 6.4 链接
- **行内链接**：默认 `text-primary underline`；`hover:` 轻微降低亮度（`brightness-90`）或改为 `underline-offset-2`，不得改变字体层级。
- **独立链接 / 导航**：默认使用 `text-foreground`，`hover:` 切换至主色或加粗；保持与交互层级相匹配的 `focus-visible` ring。

## 7. Motion & Resilient Experience
- 默认动效：`transition-all duration-200 ease-out`；`hover` 提升阴影或降低亮度，`active` 使用 `scale-95`，遵循 `settings.transition_duration`、`hover_opacity`、`active_opacity`。
- 尊重 `prefers-reduced-motion`：仅保留透明度变化，关闭平移/缩放。
- 多媒体体验需提供 fallback（静态图、低分辨率图像）；移动端禁止自动播放带声音的视频。
- 以“最差网络”视角设计：确保关键文案在首屏纯文本即可呈现，延迟加载的媒体不会阻塞交互。

## 8. Accessibility & Input Parity
- 遵循 `docs/accessibility_playbook.md`：包括 alt text、字幕、对比度、键盘可达等要点。
- 所有状态（hover、focus、active、disabled）在触控、键盘与指针输入之间保持一致，`focus-visible` 样式不得被移除。
- Section/Block 需提供“帮助/反馈”入口（可放在 footer 或浮动帮助按钮），并在 schema `info` 中说明特殊可访问性注意事项。
- 不得依赖 hover-only 提示。所有关键信息应可通过点击或辅助技术获取。

---
遵守以上原则即可确保 AI 生成内容在不同页面、模块与品牌主题之间保持统一、可扩展、且可预测的体验。
