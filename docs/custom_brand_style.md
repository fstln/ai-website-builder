# Heyup 视觉规范（v0.1）

本规范面向 Shopify 主题基础包，为 Heyup Store（参见 https://store.heyupnow.com/）建立一致的 DTC 视觉语言。以下内容聚焦两件事：

1. **哪些规则可直接复用 / 套用至所有 Section。**
2. **哪些规则需要专属实现，并明确代码边界（需要新增文件或模块）。**

---

## 1. 品牌基调与体验目标

- **整体氛围**：简约、现代、偏科技的 DTC 审美，强调干净留白、可靠与亲和力。Hero 区域宽阔、产品区紧凑，形成“远景呼吸 + 近景密度”的节奏。
- **品牌承诺**：突出 “Cute Outside, Powerful Inside” 等文案，使用大号排版与柔和紫蓝装饰来强化科技感与可爱气质。
- **视觉语言**：纯色块、轻微叠加，避免复杂纹理；图像高饱和度，搭配紫蓝圆圈/气泡装饰。

---

## 2. 规则适配速览

| 维度 | 可直接套用 | 需自定义 / 说明 |
|------|------------|-----------------|
| 字体 | 标题：Outfit-Medium；正文：Inter | 需在 `layout/theme.liquid` 中引入字体文件（Google Fonts 或本地 `assets/fonts/`），并在 `assets/base.css` 或新建 `assets/heyup.typography.css` 中定义 `--font-heading` / `--font-body`。 |
| 颜色 | 背景 #FFFFFF/#FAFAFA，文本 #333 / #999，CTA 黑色，hover 变 #5E89FF | 当前主题 primary 来源于 `snippets/color-schemes.liquid`。需新增“Heyup”方案：装饰主色 #A8B8FF、CTA 黑 → hover 品牌蓝（#5E89FF）。文本 hover 颜色也需同步更新，否则与现有语义色冲突。 |
| 间距 | 8px 基线系统（padding 24/32/64 等） | 需要核对已有 spacing tokens 是否支持 8px 倍数；若缺失，在 `config/settings_schema.json` 中为 Section padding 添加 8px 刻度选项。 |
| 组件 | 按钮黑底、移动端全宽，图像懒加载、轻阴影 | CTA hover 需 scale + 颜色过渡，可在 `assets/heyup.components.css` 中集中声明，避免在各 Section 内重复样式。 |
| 动效 | ease-in-out 0.2–0.4s、scale 1.05、装饰脉冲 | 需要 JS 参与的动画（如聊天气泡浮动）统一写入 `assets/heyup.effects.js`，并通过 `theme.liquid` 的 `defer` 脚本标签引入，减少 Section 内联脚本。 |

---

## 2.1 Heyup 视觉落地要点

以品牌体验为导向的实际实现总结：

1. **安全区一致**：Header、Footer、Blog 以及所有 Section 都必须使用 `.container-custom`，依赖 Theme settings 的 `container_max_width`（1200px）与 `content_padding`（24px）。整体观感是“整洁的画布 + 居中内容”，与 Heyup 官网保持一致。
2. **品牌蓝方案**：新增 `scheme-header`，Header/Nav/Blog 统一使用该配色以呈现品牌蓝导航 hover、徽标计数、标签背景。这套色板也可扩展到 newsroom 标签、气泡装饰。
3. **按钮语言**：按钮字体与 Header 一致（Outfit/`--font-heading`），默认黑底，hover 只切换为品牌蓝；借助 `button_corner_radius_pill=true` 让 CTA 呈现 pill 形态，符合 Heyup “可爱 + 科技”的语感。
4. **卡片圆角**：`card_corner_radius=24px` 带来更柔和的卡片视觉，配合浅阴影强调“漂浮”感；任何卡片类组件（产品、文章、购物车）都引用同一变量，确保品牌一致性。
5. **Footer 亲密性**：Contact 区块的标题与内容间距缩短，整体改用 400 字重，搭配蓝色社媒 hover，营造温和友好的对话感。
6. **按钮/链接动效**：所有按钮 hover 移除位移/缩放，只保留颜色和轻微阴影变化；强调在 Heyup 品牌中“沉稳 + 可靠”的交互反馈，同时维持 0.2s ease-in-out，呼应品牌的平滑动效策略。

这些改动共同构建 Heyup 的“暖白画布 + 蓝色点缀 + pill CTA + 大圆角卡片”视觉基调。

---

## 3. 排版系统

- **字体家族**：
  - 标题：`font-heading: "Outfit", "Outfit-Medium", "Inter", system-ui, sans-serif;`
  - 正文：`font-body: "Inter", "Inter-Regular", system-ui, sans-serif;`
  - 加载策略：优先使用 Shopify Fonts 或 Google Fonts `<link rel="preconnect">` + `<link rel="stylesheet">`；确保 `font-display: swap`。
- **字号 & 字重**：
  - H1：48px / 700 / letter-spacing 0.5px。
  - H2/H3：24–32px / 500。
  - Body：16px / 400。
  - CTA / 标签：14px / 600，全大写的导航条使用 500 字重。
  - 小文本：12px / 400。
- **节奏**：
  - 标题行距 1.15，正文 1.5；标题下 `margin-bottom: 24px`，正文段间 `16px`。
  - 导航字母间距 `0.2em`，保持权威感；产品卡标题则去掉大写与粗体，维持 400–500 字重。

---

## 4. 颜色体系

| 角色 | 色值 / 用途 | Shopify 实现建议 |
|------|-------------|------------------|
| Brand Accent | `#A8B8FF`（可在 90%–100% opacity 内浮动） | 在 `snippets/color-schemes.liquid` 中定义 `scheme-heyup`，用于背景装饰、图标、气泡。 |
| CTA / Primary Action | 默认 `#000000`，hover `#5E89FF`（含文本链接） | `assets/heyup.components.css` 中添加 `.btn--primary` hover 状态；同步更新全局链接 `a:hover`。 |
| Text Primary | `#333333` | 可映射至 `--color-foreground`。 |
| Text Secondary | `#999999` | 作为 `--color-foreground-muted`。 |
| Background | `#FFFFFF` / `#FAFAFA` | 主题默认即可，确保 Section `color-scheme` 允许极浅灰。 |
| Surface Card | `#FFFFFF`，1px border `#E0E0E0` or `box-shadow`. | 通过 `--color-surface` + `--color-border`. |

- 不建议使用渐变；若需层次感，使用 `bg-brand / 10` 透明层或 `border`。
- 文字 hover 统一转为 `#5E89FF`，避免当前 “primary/hover” 语义冲突。

---

## 5. 间距、栅格与容器

- **8px 基线**：所有 padding/margin/gap 以 8 的倍数定义；禁止 `px-[18px]`。
- **Section**：桌面 `padding-block: 64px`, 移动 `32px`；容器 `max-width: 1200px`，`padding-inline: 24px`（桌面）/ `16px`（移动）。
- **网格**：
  - 桌面列间距 24px，移动 16px。
  - 产品列表 `grid-template-columns`: `repeat(auto-fit, minmax(280px, 1fr))` with `gap: 32px`.
- **组件**：
  - 按钮 `padding: 16px 24px`。
  - 卡片 `padding: 24px`，卡片间距 `32px`（纵向）。
  - Hero 与下一 Section 之间保持 `48px` 呼吸。

---

## 6. 组件模式

- **按钮**：矩形且 4px 圆角；默认黑底白字，hover 变品牌蓝 + `transform: scale(1.05)`；禁用态降低不透明度至 40%，且禁用阴影。
- **导航**：白色背景、0px 圆角、文本全大写（500 字重），hover 仅更改文本色 + 下划线平滑显现。
- **产品卡**：8–12px 圆角，轻阴影 `0 1px 3px rgba(0,0,0,0.1)`；图片裁剪为 1:1 或 16:9，使用 `filter: brightness(1.05)`。
- **列表**：无样式符号（`list-style: none`），但可以 `::before` 插入 `•`；链接 hover 显示下划线。
- **输入框**：6px 圆角，1px `#E0E0E0` 边框，focus 态 `box-shadow: 0 0 0 2px #A8B8FF33`。

---

## 7. 阴影、圆角与动效

- **阴影等级**：
  - 卡片/按钮：`0 1px 3px rgba(0,0,0,0.1)`。
  - 模态/悬浮卡：`0 4px 6px rgba(0,0,0,0.1)`（模糊 8px）。
  - 导航/页脚：无阴影，保持扁平。
- **圆角**：
  - CTA：4px。
  - 卡片/图像：8–12px。
  - 输入/模态：6px。
  - 装饰气泡：50%。
- **动效**：
  - Hover：0.2s–0.3s `ease-in-out`，优先 `transform`/`opacity`。
  - 图片懒加载淡入 `0.3s`。
  - 模态 `translateY(100% → 0)`，用 `transition: transform 0.3s`.
  - 禁用态无动画。

---

## 8. 实现边界与文件指引

| 需求 | 文件 / 模块 | 操作 |
|------|-------------|------|
| 字体定义 | `layout/theme.liquid`, `assets/heyup.typography.css`（新建） | 在 `<head>` 引入字体；在新 CSS 中设置 `:root` 变量与 `body`/`h1-h6`。 |
| 色板落地 | `snippets/color-schemes.liquid`, `config/settings_schema.json` | 新增 Heyup 色板及可配置开关；保证 Theme Editor 可选。 |
| 组件样式 | `assets/heyup.components.css`（新建） | 放置按钮、卡片、导航等共享规则；在 `theme.liquid` 统一引入。 |
| 动效脚本 | `assets/heyup.effects.js`（新建） | 负责懒加载、气泡动画、CTA 互动；`theme.liquid` 中 `type="module"` defer 引入。 |
| Section 特化 | 位于 `sections/` 的定制 Section | 仅保留结构与动态数据；避免在 Section 内联大量 CSS/JS。若必须内联，需注释说明“仅此 Section 生效”。 |

---

## 9. 自定义模块 CSS / JS 的写法

- **原则**：所有可复用的样式与逻辑，都应存放在独立的 `assets/*.css`、`assets/*.js` 文件中，通过 `{{ 'file.css' | asset_url | stylesheet_tag }}` / `{{ 'file.js' | asset_url | script_tag }}` 在 `layout/theme.liquid` 或特定 Section 中引入，便于缓存与版本控制。
- **何时 Section 内联？**
  1. 样式只服务单一 Section，且体量 < 30 行。
  2. 无法复用（例如一次性的装饰定位）。
  3. Script 仅依赖该 Section DOM，且会与全局 bundle 产生冲突。
- **推荐流程**：
  1. 在 `assets/heyup.components.css` 中维护公共组件类；Section 中只写语义 class（例如 `.heyup-hero`）。
  2. 若 Section 需要额外 JS，优先写在 `assets/heyup.effects.js` 中的模块化函数，然后在 Section 模板内通过 `data-*` 触发。
  3. 仅当 Shopify Online Store 2.0 动态加载导致脚本无法复用时，才在 Section 末尾写 `<script>`，并用注释标注 “Heyup-only inline script”。

遵循以上边界，可以在保持 Shopify 主题结构整洁的同时，快速切换到其它品牌或进行版本升级。
