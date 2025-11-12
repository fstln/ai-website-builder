# Color Scheme Playbook（Shopify Color Scheme Group）

> **文档职责**：记录 AI 主题的 color scheme 体系、角色含义、配置流程与治理规范。Token 总览见 `docs/design_tokens_guide.md`，Tailwind 用法见 `docs/visual_spec.md`，交互/可访问性约束见 `docs/ai_design_principles.md`。

---

## 1. 系统快照

| 部分 | 说明 |
| --- | --- |
| 配置来源 | `config/settings_schema.json` 中的 `color_scheme_group` 定义 10+ 个角色；实例存储在 `config/settings_data.json > color_schemes`（以及可选的 `config/themes/*.json` 预设）。 |
| 运行时注入 | `snippets/color-schemes.liquid` 为每个 scheme 输出 `--color-*` 和 `--color-*-rgb`，并自动派生 `surface/surface-muted`, `primary-soft`, `inverse-*`, `opacity-XX`。 |
| Tailwind 映射 | `tailwind.config.js` 通过 `withOpacityValue` 将 CSS 变量映射到 `bg-primary`, `text-foreground`, `border-border` 等语义类。 |
| 组件使用 | Section/Block 根节点使用 `class="color-scheme color-{{ scheme_id }}"`，子元素只使用语义 Tailwind 类，无需关心颜色取值。 |

---

## 2. 角色与派生值

| 角色 ID | 说明 | 常用 Tailwind 类 |
| --- | --- | --- |
| `background` | Section 基底 | `bg-background` |
| `foreground` / `foreground_heading` | 主体文字 / 标题文字 | `text-foreground`（标题默认也使用此类；如需独立颜色可在自定义 CSS 中引用 `var(--color-foreground-heading)`） |
| `muted` | 次级文字 | `text-muted` |
| `primary` / `primary_foreground` / `primary_hover` | 主操作按钮 | `.btn.btn-primary` |
| `border` | 卡片描边、分隔线 | `border-border`, `divide-border` |
| `decorative` | Badge/装饰标签 | `bg-decorative`, `text-decorative` |
| `input_background` / `input_foreground` / `input_border` | 表单 | `bg-input`, `text-input-foreground`, `border-input-border` |
| `shadow` | 海拔颜色 | 与 `shadow-*` 配合，影响阴影色相 |

> `accent`/链接色默认沿用 `primary`；`inverse`、`surface` 等派生值由 snippet 自动计算，无需手动拾色。

`foreground`（Body text）负责所有正文、副标题、交互控件标签等需要最高可读性的内容；`muted` 则用于说明文字、辅助信息、表单提示或占位符。两者保持 4.5:1 与 3:1 的对比差异，可让 AI 在 `text-foreground` 与 `text-muted` 之间自由切换密度，而无需增加新的“次级文本”角色。

派生值一览：
- **Surface / Surface-muted**：依据背景亮度在 `background` 与 `foreground` 之间混合，生成卡片与柔和分组底色。
- **Inverse background / foreground / surface**：把 `foreground` 与 `background` 对调，并混入 15% 黑色，在 Footer 或 Toast 等反色模块中保持可读。
- **Primary-soft**：`primary` 与 `background` 以 30/70 比例混合，形成 Hero/统计卡常用的轻强调背景。

派生逻辑：
- **Surface**：根据 `background` 亮度自动生成 `surface` 与 `surface-muted`，保证浅/深背景下的卡片对比度。
- **Primary soft**：`color_primary` 与 `background` 混合 70%，形成低饱和强调背景（`bg-primary-soft`）。
- **Inverse surface**：`inverse_background` 与黑色混合 15%，让暗面区块拥有可区分的浮层。
- **透明度变量**：依据背景亮度输出 `--opacity-05/10/20/40/60`，用于 `text-foreground/80` 等 Tailwind `/opacity` 写法。

---

## 3. 创建或更新 scheme

1. **复制基础对象**：在 `config/settings_data.json > color_schemes` 中复制现有条目，使用语义化 `id`（例：`scheme-default`, `scheme-contrast`, `scheme-holiday`）。
2. **填写角色**：
   - 保证 `foreground` 与 `background` 对比度 ≥ 4.5:1。
   - `foreground_heading` 可更深（提升主标题权重）。
   - `primary_hover` 必须与 `primary` 有 5% 以上亮度/饱和度差值。
3. **同步主题预设（可选）**：若配色属于某品牌，复制 `current` 到 `config/themes/<brand>.json`，便于 Shopify 中一键切换。
4. **本地验证**：`npm run dev` → Theme Editor 中切换 Section 的 `color_scheme`，检查 CTA、表单、面层、Footer、反色模块。
5. **记录**：在 README 或 PR 中补充此 scheme 的用途、默认分布，方便 AI/人工复用。

示例节选：
```json
{
  "id": "scheme-contrast",
  "name": "Schemes / Contrast",
  "settings": {
    "background": "#0B1220",
    "foreground": "#F4F6FB",
    "foreground_heading": "#FFFFFF",
    "muted": "#94A3B8",
    "primary": "#3B82F6",
    "primary_foreground": "#FFFFFF",
    "primary_hover": "#2563EB",
    "border": "#1F2937",
    "decorative": "#312E81",
    "input_background": "#1F2937",
    "input_foreground": "#F8FAFC",
    "input_border": "#334155",
    "shadow": "#000000"
  }
}
```

---

## 4. Section / Block 使用规范

1. **Schema**：
   ```json
   { "type": "color_scheme", "id": "color_scheme", "default": "scheme-1" }
   ```
   Block 只有在视觉上需要打破父级底色时才暴露同名 setting。
2. **容器类**：`<section class="color-scheme color-{{ section.settings.color_scheme | default: 'scheme-1' }}">`。Block 覆盖时使用 `block.settings.color_scheme | default: section.settings.color_scheme`。
3. **禁止硬编码颜色**：内部必须使用 `bg-surface`, `text-foreground`, `border-border`,`bg-primary`, `text-primary-foreground` 等语义类，透明度用 `/opacity` 语法。
4. **Inverse 模块**：深色 scheme 内的卡片使用 `bg-inverse-surface text-inverse-foreground border-white/10`；浅色 scheme 中的强调块使用 `bg-primary-soft text-primary`。
5. **Theme block**：当 block 在多个 Section 复用时，始终透传父级 `color_scheme`，详见 [Shopify Theme Blocks Quick Start](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/quick-start?framework=liquid)。

---

## 5. 治理与最佳实践

- **命名**：在 Shopify 里使用 “Schemes / xxx” 形式，便于非技术人员理解用途。
- **数量**：保持 3–5 个主色板（Default、Muted、Contrast、Accent、Inverse）。若方案只服务单个独特模块，优先考虑将其做成组件内部的 `bg-primary-soft` 等组合，而不是新增 scheme。
- **可访问性**：每次新增或修改 scheme 后运行对比度检查（Stark/Polypane/Chrome DevTools）。重点验证正文、主按钮、表单提示文本。
- **审计硬编码**：定期 `rg "bg-[a-z]+-[0-9]" sections snippets`、`rg "#" sections snippets`，确保未出现未经授权的色值。
- **文档同步**：角色新增或语义改变时，同时更新本文件与 `docs/design_tokens_guide.md`，并在 PR 描述中说明。

---

## 6. QA 清单

- [ ] Section/Block schema 都包含 `color_scheme` setting，默认值存在于 `settings.color_schemes` 中。
- [ ] 运行页面时，`<section>` 元素具备 `.color-scheme color-{{id}}` 类。
- [ ] `bg-surface`、`bg-surface-muted`、`bg-primary-soft` 在不同 scheme 下呈现正确明暗。
- [ ] CTA/表单/卡片在切换 scheme 后保持可读且符合 hover/focus 规范。
- [ ] 模板中未出现 `bg-white`、`text-black`、`rgba()` 等硬编码。
- [ ] `snippets/color-schemes.liquid` 输出的 CSS 变量在浏览器 DevTools 中可见。

达成这些条件即可确保 color scheme 体系稳定，与 tokens、视觉规范、AI 自动化流程保持一致。 
