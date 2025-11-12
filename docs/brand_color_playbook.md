# Brand Color Playbook

> **目标**：为 AI 或设计师提供一套选择/扩展色板的决策流程，在保持品牌独特性的同时满足 Shopify 主题的语义色与可访问性约束。执行时始终结合 `config/settings_schema.json`、`config/settings_data.json` 与 `docs/color_scheme.md`。

---

## 1. 设计价值观

1. **优先可读性**：颜色首先要让文本、图标、图表清晰，再谈辨识度。高对比可以用“暖白 vs 煤灰”“冷白 vs 深墨”实现，不必局限纯黑白。
2. **少色但精准**：主色 + 辅色 + 强调即可建立视觉节奏，过多颜色会削弱品牌印象。
3. **灵活调和**：通过色温、饱和度、明度细微变化打造品牌差异（如偏蓝的米白、偏暖的炭黑），同时保持在 tokens/schemes 中的统一。
4. **跨触点一致**：线上（主题）与线下（包装、社媒）共享同一 palette；在 Shopify Theme 中通过 preset 文件固化。

---

## 2. 选色流程

### Step 1：定位品牌调性
| 维度 | 选项 | 色彩倾向 |
| --- | --- | --- |
| 行业/品类 | 科技、生活方式、奢侈、美妆、运动 | 科技：冷调 + 高对比；生活方式：暖灰 + 柔和强调；奢侈：深背景 + 金属点缀；美妆：柔粉/米白；运动：饱和度高的主色 + 深灰背景 |
| 能量级 | 柔和 / 中性 / 强势 | 通过饱和度 & 亮度控制 |
| 受众 | 专业、Z 世代、家庭、可持续 | 决定是否需更跳脱或更低调的强调色 |

### Step 2：定义结构
1. **Primary**：品牌主色，覆盖 CTA、强调文本。确保与 `primary_foreground` 对比 ≥ 4.5:1。
2. **Secondary**：辅助或轮廓色，用于次级 CTA、chips、图表分隔。
3. **Accent / Decorative**：稀少使用的点缀（badge、图示）。
4. **Neutrals**：背景（background/surface/surface-muted）、文本（foreground/muted）、inverse 组合。  
   - 避免纯白/纯黑，推荐 `#F7F7F2` / `#0F1214` 等带色温的值。
5. **Feedback**：错误/警告/成功颜色保持全球通用（红/橙/绿），必要时将品牌主色用于信息提示，但不得与错误状态冲突。

### Step 3：构建 Scheme
- 使用 `docs/color_scheme.md` 中的角色清单，为 `scheme-1/2/3` 配置完整对象。  
- 推荐默认组合：  
  - `scheme-1`：品牌主场景（浅背景）。  
  - `scheme-2`：柔和/Muted（大面积米色/灰色 + 深色文本）。  
  - `scheme-3`：高对比/Inverse（暗背景 + 亮强调）。  
- 针对节日或 campaign，可新建 `scheme-holiday`、`scheme-sale` preset。

### Step 4：验证 & 记录
- 在 Theme Editor 中切换 Section 的 `color_scheme`，确认 CTA、表单、卡片、footer 都可用。
- 使用 Contrast 工具验证 `text-foreground` vs `bg-background`、`text-primary-foreground` vs `bg-primary` 等组合。
- 记录品牌色值（含 HSL/CMYK）到 `config/themes/{brand}.json` 与 README，方便多触点协作。

---

## 3. 常见模式

| 品牌类型 | 主色 | 中性色 | 强调策略 |
| --- | --- | --- | --- |
| 科技极简 | 电蓝 / 品牌紫 | 偏冷的米白 `#F5F7FA` + 深炭 `#0F172A` | 使用 `primary-soft` 叠加玻璃质感背景 |
| 奢侈精品 | 深墨绿 / 黑金 | 温暖米白 `#F9F5EE` + 巧克力色 | 高海拔卡片 + 金属渐变描边 |
| 可持续生活 | 鼠尾草绿 | 自然木色 `#F3EEE3` + 石墨灰 | 使用 `decorative` 制造自然笔刷纹理 |
| 美妆护肤 | 玫瑰粉 / 赤陶 | 暖白 `#FDF8F4` + 柔棕 | 通过描边/透明按钮（`btn-outline-primary`，旧版 `btn-secondary`）和柔和装饰色凸显层次 |

---

## 4. 设计决策提示

- **避免海量品牌色造成一致性问题**：若需要添加更多色彩，优先在组件级使用渐变、叠加 (`bg-primary/5`) 或插画进行表达，而非继续新增 token。
- **线条/表格**：`border` 与文本保持 2:1 对比即可，避免过强边框抢节奏。
- **图像协同**：为 hero/banner 提供相匹配的滤镜（冷暖、饱和度）以便色彩延展。
- **Typography 与颜色搭配**：大标题可以使用品牌主色（只要对比允许），正文与操作文字建议落在 `text-foreground` / `text-muted` 范畴。

---

## 5. 与其他文档的协作

- `docs/color_scheme.md`：负责结构化储存与 Section 使用方式；本指南解决“如何选色”。
- `docs/ai_design_principles.md`：在颜色章节引用本指南，强调“角色驱动 + 品牌差异”。
- `docs/design_tokens_guide.md`：说明如何把选好的颜色写入 settings 与 preset。
- `docs/visual_spec.md`：在组件层面告诉你使用哪些语义类（`bg-primary`, `text-muted`, `bg-primary-soft` 等）。

通过该流程，AI 可以在同一套主题基础上生成多元但可访问的品牌体验，而不会陷入“千篇一律”的默认色板。 
