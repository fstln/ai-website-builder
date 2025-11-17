# Sections 目录与适用场景（已实现）

> 目的：系统性梳理当前主题可用的 Sections，给出“放在哪、解决什么问题、依赖什么”的快速索引。具体样式/语义请对照 `docs/visual_spec.md` 与 `docs/liquid_dev_playbook.md`。

---

## A. 全局/框架类

- `sections/header.liquid` / `sections/main-header.liquid`
  - 场景：站点头部（Logo/导航/购物车入口）。
  - 建议：头部内放置购物车角标元素（`[data-cart-count-badge]`），由 Cart Drawer/Cart 模块统一刷新。

- `sections/footer.liquid`
  - 场景：站点底部（导航、联系、社媒、支付图标、订阅）。
  - 建议：包含 Accessibility/隐私等政策链接；遵循可访问性与 SEO 要求。

- `sections/announcement-bar.liquid`
  - 场景：顶部通告（物流/折扣/重要通知）。
  - 建议：短文本 + 可选链接；避免堆叠多条信息。

- `sections/sticky-navbar.liquid`
  - 场景：长购买页的“胶囊锚点导航”。
  - 使用：为目标区块设置 `id`（或 Section `section_id`），在本 Section 的 blocks 中填入锚点；点击将平滑滚动。
  - 设置：`sticky_offset`（吸顶距离）、`scroll_offset`（滚动对齐偏移）。

---

## B. 首页/营销类

- `sections/hero.liquid` / `sections/hero-highlight-section.liquid`
  - 场景：首屏 Hero 或带图文的卖点强调区。
  - 建议：用 `section_id` 供粘性导航/跳转使用；按钮用 `.btn.btn-primary`。

- `sections/featured-products.liquid` / `sections/featured-collection.liquid`
  - 场景：精选产品/集合展示。
  - 依赖：`snippets/product-card.liquid`、`snippets/price.liquid`。

---

## C. 核心页面主区

- `sections/main-product.liquid`
  - 场景：产品详情核心内容（标题、价格、描述、变体、数量、购买按钮等）。
  - 交互：与 `variant-selector-*`、`product-gallery-*`、`add-to-cart-*` 等组件配合。

- `sections/main-collection.liquid` / `sections/main-cart.liquid` / `sections/main-page.liquid` / `sections/main-blog.liquid` / `sections/main-article.liquid` / `sections/main-search.liquid` / `sections/main-404.liquid`
  - 场景：集合、购物车、静态页、博客、文章、搜索、404 等标准主区。

---

## D. 购买页增强与复用区块

- `sections/faq-accordion-section.liquid`
  - 场景：常见问题（复用 `snippets/faq-accordion.liquid`）。
  - 设置：`color_scheme`、`section_id`、标题/副标题；Blocks 为问答项。

> 说明：文档不收录任何以 `custom-` 开头的临时/专项 Section（它们仅用于示例或特定活动，非稳定接口）。如需参考其结构，请在代码中直接查看对应文件，但不作为通用目录的一部分。

---

## E. 组合示例（来自模板）

- 产品页（示例）
  - 结构：`main-product` → `sticky-navbar` → 若干营销/说明区块（如 `hero-highlight-section`、复用型信息模块）→ FAQ。
  - 要点：区块通过 `section_id` 提供锚点；`sticky-navbar` 的 blocks 指向这些 `id`；避免依赖 `custom-*` 临时区块作为稳定能力。

---

## F. 接入与治理建议

- 所有 Section 根节点必须：
  - 包裹 `class="color-scheme color-{{ section.settings.color_scheme | default: 'scheme-1' }}"`；
  - 遵守 `docs/liquid_dev_playbook.md` 的 schema 规范（含 `color_scheme` setting）。
- 使用语义类：颜色/边框/阴影请用 Tailwind 语义映射（如 `bg-background`, `text-foreground`, `border-border`）。
- 复用优先：常见卖点/对比/规格/FAQ 请优先沿用现有自定义 Section 的结构抽象，不要在新 Section 硬编码视觉风格。
- 表单/CTA：按钮统一 `.btn.btn-primary`，次按钮 `.btn.btn-outline-primary`（`btn-secondary` 为兼容别名）。
- 锚点导航：长页建议统一通过 `sticky-navbar` 管理跳转，确保移动端滚动偏移一致。

---

## G. 清单（新增/修改 Section 时自检）

- [ ] schema 含 `color_scheme` 与清晰分组/描述；`presets` 可预览。
- [ ] 标题层级正确（页面仅一处 `<h1>`，Section 从 `<h2>` 起）。
- [ ] 媒体具备 `alt`/`loading`/`decoding`；列表/表格使用语义标签。
- [ ] 未出现硬编码颜色/边框；全部引用 tokens/语义类。
- [ ] 长页面区块提供 `section_id` 以便导航/链接。
- [ ] 需要交互的区块提供 `data-*` 钩子并与 JS 模块对齐。

以上目录随代码演进补充。若新增 Section，请在合并请求中同步更新本文件并附上使用截图/链接，便于 AI 与协作者快速复用。
