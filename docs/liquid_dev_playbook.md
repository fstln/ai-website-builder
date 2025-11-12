# Liquid Development Playbook

> **目标**：为 AI 与开发者提供编写 Shopify Section/Template/Snippet 时的经验规则，确保输出遵守主题架构、文档规范及可访问性/SEO 要求。

---

## 1. 文件组织与命名

- **Schema 约定**：每个 Section 必须包含
  - `class="color-scheme color-{{ section.settings.color_scheme | default: 'scheme-1' }}"` wrapper。
  - Schema 中的 `{ "type": "color_scheme", "id": "color_scheme" }`。
  - `settings` 字段按用途分组（文案、媒体、布局、辅助），并提供 `info` 说明任何可访问性/SEO 注意事项。
- **Snippets**：专注可复用模块（卡片、列表、JSON-LD 等），使用 `{% render 'snippet-name', ... %}`，避免 `include`。
- **Blocks**：默认继承 Section 的设置；只有在视觉/功能上确实独立时才暴露新的 `settings`。

---

## 2. 模板结构

### 2.1 语义标签
- 页面级模板：`<main role="main">` 包裹主要内容；`<header>`, `<footer>`, `<nav>` 分别对应区域。
- Section：不要使用 `<h1>`；默认从 `<h2>`/`<h3>` 开始。标题类型与 `docs/visual_spec.md` 保持一致。
- Breadcrumb/辅助导航：`aria-label` + `<nav>` + `<ol>`，并在 Snippet 中输出 JSON-LD。

### 2.2 可访问性
- 图片输出：`<img src="{{ image | image_url: width: 1200 }}" alt="{{ image.alt | escape }}" loading="lazy" decoding="async">`。
- 表单：`label` 与 `id` 匹配；错误消息通过 `aria-live="polite"` 或相邻元素显示，遵循 `docs/accessibility_playbook.md`。
- 交互控件：确保 `button` vs `a` 用途明确，`focus-visible` 样式由 Tailwind 类负责（例如 `focus-visible:ring-2 ring-primary/50`）。

### 2.3 SEO
- Section 负责输出语义结构与 `meta` 数据 L1 支持。对 hero/文章等 Section，可暴露 `heading_tag` 设置（H2/H3），但不能覆盖模板唯一 H1。
- 重要内容（如产品描述）在 Liquid 中直接输出，以便搜索引擎读取；复杂交互可在 JS 中增强。
- 利用 `schema` 的 `presets` 提供 demo 内容，便于 Theme Editor 预览。

---

## 3. 数据与性能

- **资源获取**：尽量使用 Shopify Liquid 对象（`section.settings`, `block.settings`, `product`, `collection`）。避免在 Section 中进行复杂逻辑操作（如 `paginate`）超出 50 项限制。
- **远程资源**：若需加载外部脚本，使用 `{{ 'script.js' | asset_url | script_tag }}` 并在 JS 文件中懒加载。
- **条件渲染**：使用 `{% if section.settings.enable_feature %}` 包装可选内容，输出为空时不要渲染多余容器。
- **缓存**：重复使用的数据片段抽成 Snippet，并通过 `{% render %}` 传入上下文，减少重复 Liquid。

---

## 4. 多语言与文本

- 所有可本地化字符串使用 `t` 过滤器（如 `{{ 'sections.hero.heading' | t }}`）。若文案由商家输入（schema `text`），仍可以 `schema` 中提供 `default`。
- 日期、货币等使用 `{{ date | time_tag: '%b %d, %Y' }}` 或 `{{ product.price | money }}`，遵守 Shopify 内置本地化。
- URL 使用 `routes.cart_url`, `routes.search_url` 等内置对象，避免硬编码。

---

## 5. Liquid × JS 协作

- 为 JS 组件提供 `data-*` attributes（例如 `data-section-id="{{ section.id }}"`）以便在 `sections/*.liquid` 中绑定。
- 使用 `{{ section.id | json }}` 等方式安全传递 JSON 数据到脚本。
- 如果 Section 需要在 Theme Editor 中支持动态刷新，使用 [Section Rendering API](https://shopify.dev/docs/api/ajax/reference/section-rendering)；在 Liquid 中添加 `data-section-id` + `data-section-type`。

---

## 6. QA 清单

1. [ ] Section schema 包含 `color_scheme`、描述信息、字段分组。
2. [ ] 语义标签正确，只有模板/页面总 H1；Section 默认 H2/H3。
3. [ ] 所有媒体输出 alt / loading / decoding 属性。
4. [ ] 可选内容在设置关闭时不会输出空结构。
5. [ ] 使用 `t` 或 schema 文本，不存在硬编码语言。
6. [ ] 所有链接/操作使用正确元素类型、可访问性状态。
7. [ ] Snippets 复用得当，无重复逻辑。

遵循以上规则即可保证 Liquid 层具备良好可维护性，并与设计/SEO/可访问性文档保持一致。 
