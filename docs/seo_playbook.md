# SEO Playbook (Shopify Theme)

> **文档职责**：把 Shopify 官方建议与主题约束整合成 AI 可执行的 SEO 清单，确保自动化生成的页面在满足品牌/可访问性原则的同时兼顾搜索可见性与性能。

---

## 1. 核心原则

1. **结构优先**：语义化文档结构（单一 `<h1>`、分层 `<h2-h4>`、`<nav>/<main>/<footer>`）是搜索与辅助技术共享的基础。
2. **性能即排名**：素材、脚本、动画的每一次增加都必须衡量对 LCP/FID/CLS 的影响。必要时提供占位/fallback。
3. **内容可信**：保持标题、描述、文案与产品/品牌实际一致，避免关键词堆砌；遵守 Shopify + Google 的内容政策。
4. **全渠道一致**：与 `docs/brand_color_playbook.md`、`docs/visual_spec.md`、`docs/accessibility_playbook.md` 协同，保证 alt text、色彩对比、可访问性实践同时满足 SEO 规则。

---

## 2. Shopify 提供的能力

| 功能 | 位置 | 要点 |
| --- | --- | --- |
| Page / Resource SEO | Shopify 管理后台 → Online Store → Preferences / 各资源详情页 | 配置页面级 `title` / `meta description`；AI 生成内容时需在 schema 的 `settings` 中暴露 meta 字段或使用 [SEO metafields](https://shopify.dev/docs/api/liquid/objects/metafield). |
| JSON-LD / Structured Data | `snippets/*` 或 `layout/theme.liquid` | 提供 `Organization`, `Product`, `Breadcrumb`, `Article` 等 Schema.org 数据。自动生成区块时应复用主题现有 snippet。 |
| Image Alt Text | Shopify 媒体库 / Section 设置 | 在 schema 中强制要求图片字段填写 `alt`; Liquid 输出时使用 `{{ image.alt | escape }}`。 |
| Sitemap & robots | Shopify 自动 | 只要页面在导航/列表中可达并未 `noindex`，便会被 sitemap 捕捉。避免创建孤立的 `hidden` 模块。 |

---

## 3. 页面结构规范

### 3.1 Head & Metadata
- 每个模板必须有唯一 `title`（≤ 60 字符）和描述（≤ 155 字符），描述应包含品牌名 + 主要价值/关键信息。
- 在 `layout/theme.liquid` 或 page-specific snippet 中填充 Open Graph 与 Twitter Card，以便社媒分享（图片分辨率 ≥ 1200x630，文件大小 < 1MB）。
- 若 Section/Block 自动生成关键文案，提供可选 `meta_keywords` / `meta_description` 设置，供商家 override。

### 3.2 语义 & 可读性
- 首页/着陆页只允许一个 `<h1>`，后续区块按内容重要性逐级递减；AI 生成 Section 时禁止使用 `<h1>`。
- 列表/集合页：使用 `<ol>`/`<ul>` + `<li>` 包裹卡片；产品详情页的规格可使用 `<dl>`。
- 使用 [ARIA Landmarks](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Roles/Role_Attribute#landmark_roles) 辅助导航，但不要替代原生元素。

### 3.3 链接 & 导航
- CTA 按钮使用 `<a>` 对应 `href`，避免用 `<button>` 模拟导航。按钮文本应描述操作（“加入购物车”，而非 “点击这里”）。
- 内部链接保持结构化路径（/collections/... /products/...）；避免生成无意义参数。
- Breadcrumbs（面包屑）须与 JSON-LD 同步，提升爬虫理解。

---

## 4. 媒体与性能策略

- **图片**：提供 `width/height`、`loading="lazy"`、`decoding="async"`；针对移动端生成 `{{ image | image_url: width: ... }}` 多尺寸源。  
- **视频**：尽量使用 Shopify-hosted 或外部嵌入，禁止自动播放有声视频。如需背景视频，提供 `data-fallback` 图像。
- **动画**：避免持续闪烁；尊重 `prefers-reduced-motion`，同时减少 DOM 触发计算（对 CLS 有影响）。
- **字体**：通过 tokens 控制；限制在 2 套字体 + 可选强调字体。自定义字体应 `font-display: swap`，防止 FOIT 影响 LCP。
- **脚本**：懒加载非关键 JS，使用 `defer`；针对交互区块提供纯 HTML fallback 以便爬虫抓取。

---

## 5. 内容与文案

- **关键字策略**：遵循“主关键词 + 长尾说明”组合（例如 “无线降噪耳机，旅行友好型”）。在 hero、首屏文案、meta description、H2 中自然出现。
- **段落可读性**：保持 1–3 句，每句 ≤ 20 词。搭配 `max-w-3xl` 限制行宽，提升停留时间。
- **图像描述**：`alt` 字段描述图像核心信息 & 关键词，但避免堆砌。
- **产品信息**：确保价格、库存、配送等数据来自 Liquid 对象（`product.price`, `product.available`），保持实时准确，避免 “虚假内容” 导致 SERP 惩罚。
- **政策与帮助**：Footer 提供退换货、隐私、可访问性声明、帮助中心链接，有助于 Google 评估 E-E-A-T（经验、专业性、权威性、可信度）。

---

## 6. SEO × 文档协同

| 指南 | 关联内容 |
| --- | --- |
| `docs/ai_design_principles.md` | “Accessibility & Input Parity” 中的结构、fallback 要求与 SEO 完全一致。 |
| `docs/accessibility_playbook.md` | Alt text、字幕、键盘导航等检查项满足 SEO。 |
| `docs/visual_spec.md` | 可补充语义标签建议（H1 唯一性、`loading="lazy"` 等）。 |
| `docs/design_tokens_guide.md` | 字体/行高/颜色 tokens 与可读性、性能直接相关。 |

---

## 7. SEO 审核清单

1. [ ] 模板中仅有一个 `<h1>`；Section 默认使用 `<h2-h4>`。
2. [ ] 所有图片设置 `alt`；关键媒体提供字幕/文本替代。
3. [ ] 页面 `title`/`meta description` 存在且无重复。
4. [ ] Open Graph/Twitter Card 配置正确，引用压缩后的 hero 图。
5. [ ] JSON-LD 覆盖 `Organization` + 主要内容类型（Product/Article/Breadcrumb）。
6. [ ] 主要脚本使用 `defer`/`async`；非关键动画尊重 `prefers-reduced-motion`。
7. [ ] 资源提供 fallback：视频 → 图片、延迟加载 → 占位 skeleton。
8. [ ] 内部链接结构清晰，Breadcrumb/导航可访问。
9. [ ] Performance：LCP 目标 < 2.5s（图片压缩、字体 swap、lazy loading）。
10. [ ] 与可访问性清单一致，避免法律与排名风险。

遵循以上流程即可让自动生成的页面在视觉多样、语义合理、性能可控、法务合规的前提下取得更好 SEO 表现。 
