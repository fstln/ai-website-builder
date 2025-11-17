# 通用模块与组件目录（已实现）

> 目的：为 AI 与开发者提供“现有可复用模块”的一览与使用场景，避免重复造轮子，并指导如何在 Section/模板中正确接入。
>
> 适用范围：Liquid snippets、Web Components、JS 模块与工具库。样式与可访问性规范仍以 `docs/visual_spec.md`、`docs/ai_design_principles.md`、`docs/accessibility_playbook.md` 为准。

---

## 1) Liquid Snippets（通用片段）

- `snippets/image.liquid`
  - 功能：响应式图片包装，输出 `img` 并带 `loading`, `decoding` 与安全 `alt`。
  - 典型场景：卡片封面、文章/产品插图、Hero 侧图。
  - 依赖/约束：遵循 `docs/seo_playbook.md` 媒体策略；在 `color-scheme` 容器内使用以继承语义色。

- `snippets/price.liquid`
  - 功能：格式化价格，支持对比价/折扣。
  - 场景：产品卡/产品详情页、购物车项、推荐区块。
  - 依赖：与 `window.Shopify.money_format` 配合（由 `src/js/utils/format-money.js` 初始化）。

- `snippets/product-card.liquid`
  - 功能：标准产品卡（图、标题、价格、徽章）。
  - 场景：集合页、推荐、主页精选。
  - 依赖：`snippets/image.liquid`、`snippets/price.liquid`、`snippets/product-badge.liquid`。

- `snippets/product-badge.liquid` / `snippets/star-rating.liquid`
  - 功能：促销/状态徽章、评分星级。
  - 场景：产品卡/详情、评测区块。

- `snippets/breadcrumbs.liquid`
  - 功能：面包屑导航；应配套输出 JSON‑LD。
  - 场景：文章、集合、产品详情。

- `snippets/faq-accordion.liquid`
  - 功能：可复用 FAQ 手风琴；支持传入 `blocks` 或对象数组。
  - 场景：购买页、帮助页、品牌页底部。
  - 依赖：与 `sections/faq-accordion-section.liquid` 组合可图形化配置。

- `snippets/cart-drawer.liquid`
  - 功能：侧滑购物车（Mini Cart），含空态、数量编辑、移除、结算动作。
  - 场景：全站固定能力，建议在 `layout/theme.liquid` 引入一次。
  - 交互：调用 `window.openCartDrawer()` 或分发 `document.dispatchEvent(new CustomEvent('cart:open-drawer'))` 打开；更新事件见下文。

- 其他：`snippets/icon.liquid`（SVG 渲染）、`snippets/quantity-input.liquid`（数量输入）。

---

## 2) JavaScript Components（Web Components）

> 源码目录：`src/js/components/`。均为渐进增强，可在无 JS 场景下保持基本可用。

- `cart-drawer.js`（自定义元素 `<cart-drawer-component>`）
  - 功能：Mini Cart 侧栏，监听购物车事件，支持键盘/焦点陷阱。
  - 事件：
    - 打开：`document.dispatchEvent(new CustomEvent('cart:open-drawer'))`
    - 监听：`cart:item-added`、`cart:updated`（自动刷新并可触发打开）。
  - DOM 钩子：`[data-drawer-close]`、`[data-drawer-backdrop]`、`[data-drawer-items]`、`[data-drawer-subtotal]`、`[data-drawer-count]` 等。

- `add-to-cart-new.js` / `product-form-new.js`
  - 功能：产品加入购物车表单与提交按钮的增强实现。
  - 场景：`sections/main-product.liquid`、推荐模块内的快速加购。
  - 事件：成功后分发 `cart:item-added`，供其他模块（如 Cart Drawer/角标）响应。

- `variant-selector-new.js` / `variant-selector.js`
  - 功能：变体选择器，更新 URL、价格、图集等。

- `product-gallery-new.js` / `product-gallery.js`
  - 功能：产品图廊，支持缩略与主图切换。

- `quantity-selector.js` / `cart-quantity-selector.js`
  - 功能：通用数量步进器、购物车专用数量组件。

- `cart-items-new.js` / `cart-items.js`
  - 功能：购物车项渲染、数量变更与移除。

---

## 3) JavaScript Modules（页面级初始化）

> 源码目录：`src/js/modules/`

- `cart.js`
  - 责任：挂接“加入购物车”行为、同步购物车角标、与 Drawer 交互。
  - 依赖：`src/js/utils/cart-api.js`、`CartEvents`。

- `product.js`
  - 责任：产品页的表单、变体、图廊的协作初始化。

- `navigation.js`
  - 责任：移动导航、下拉菜单、粘性头部等。

---

## 4) Utilities（工具库）

> 源码目录：`src/js/utils/`

- `cart-api.js`
  - 能力：封装 Shopify Cart AJAX API（`getCart`, `addToCart`, `updateCartItem`, `removeFromCart`, `updateCart` 等）。
  - 事件常量：`CartEvents = { UPDATED, ITEM_ADDED, ITEM_REMOVED, ERROR }`。
  - 分发工具：`dispatchCartEvent(name, detail)`。

- `format-money.js`
  - 能力：读取 `window.Shopify.money_format` 并提供金额格式化工具。

- 其他：`section-renderer.js`（Section Rendering API 包装）、`component-base.js`/`component.js`（组件基类）、`events.js`、`image-utils.js`、`utilities.js`。

---

## 5) 常见组合与接入方式

- 全站购物车能力
  - 在 `layout/theme.liquid` 中 `{% render 'cart-drawer' %}` 一次。
  - 任意处触发：`<a href="#" data-cart-trigger>Open cart</a>` 或 `window.openCartDrawer()`。
  - 监听并同步角标：在头部使用 `[data-cart-count-badge]`，由 `cart-drawer.js` 在更新后刷新。

- 集合页产品卡
  - 使用 `{% render 'product-card', product: product %}`；卡片内按钮触发加入购物车 → `cart:item-added` → Drawer 自动打开。

- 购买页 Sticky 导航
  - `sections/sticky-navbar.liquid` + 各区块 `id`（或 `section_id` 设置）形成锚点，点击平滑滚动。

- FAQ 复用
  - 简易：`{% render 'faq-accordion', faqs: my_faqs %}`。
  - 可配：`sections/faq-accordion-section.liquid`，在 Theme Editor 中直接填充问答。

---

## 6) 事件与数据流约定

- 标准购物车事件（自顶向下广播）：
  - `cart:item-added` → 参数：`{ item }`
  - `cart:updated` → 参数：`{ cart }`
  - `cart:error` → 参数：`{ error }`
- UI 响应：Cart Drawer 监听上述事件以刷新与展示；角标由 `updateCartBadge()` 统一更新。

---

## 7) QA 清单（复用前自检）

- [ ] 片段/组件位于 `color-scheme` 容器内，无硬编码色值。
- [ ] 图片具备 `alt`、`loading`, `decoding`，视频/音频有可达的替代。
- [ ] 交互元素 44×44px 最小目标，`focus-visible` 清晰。
- [ ] 购物车相关事件链路正常（加入 → 角标/Drawer 刷新）。
- [ ] 性能与懒加载策略符合 `docs/seo_playbook.md` 与 `docs/js_component_guide.md`。

以上目录会随功能演进补充；新增模块完成后请在 PR 中同步更新本文件，以便 AI/人类协作者快速索引与复用。

