# AI 建站基础包可执行优化方案

> 目标：让本 Shopify 主题包在“AI 建站”场景中即可作为可扩展的基础模板，快速覆盖购买核心流程与常见营销模块，同时对接 Shopify 最新技术栈（Theme 2.0、Theme App Extensions、Shopify Functions、Hydrogen 组件输入）。

## 1. 现状评估（2025Q1）
- **主题能力**：已具备 Tailwind + Vite 构建、Design Tokens、Header/Footer 重构等现代基础；模板/区块数量偏少，缺少购买漏斗（产品发现→加购→结账）的差异化体验。
- **技术栈匹配度**：遵循 Theme 2.0 标准，但未显式使用 2024 发布的 **Shopify Functions（Discounts、配送逻辑）** 与 **Checkout UI Extensions**；未定义与 Hydrogen 或 Shopify Blocks 的联动接口。
- **文档与资产**：`README`、`docs/architecture.md`、`docs/design-tokens-guide.md` 完整；`docs/visual_spec.md` 指向 React/Vite 场景，与当前主题栈存在割裂，需要新增 Theme 场景视觉指引。
- **自动化**：仅有单一 build workflow，缺少 Theme Check、Lint、E2E（Playwright + Shopify CLI）分阶段验证。

## 2. Shopify 最新技术栈对齐清单
| 能力 | 目标做法 |
| ---- | -------- |
| Theme 2.0 | 继续使用 JSON Templates + Sections Everywhere，补充动态分区库 |
| Theme App Extensions | 为导航、产品推荐、弹窗等交互预留 `blocks`，方便通过 App 扩展 |
| Shopify Functions | 接入 Discounts/Shipping/Payment 自定义逻辑模板，并在 docs 中记录部署流程 |
| Checkout UI Extensions | 规划“订单附加信息”“追加销售”等扩展点，提供示例代码片段 |
| Hydrogen/Storefront API | 通过 `openspec` 目录定义 API Schema，提供在 Vite 环境复用组件的指南 |
| Online Store Editor | 为所有新 Section 配置细粒度 `schema`，确保 AI 生成后即可在编辑器里装配 |

## 3. 优化策略
### 3.1 架构层
1. **分层目录**：在 `src/` 中新增 `patterns/`（复合组件）、`ai-presets/`（LLM 提示模板），并在 docs 中说明生成流程。  
2. **设计令牌升级**：将 `settings_schema.json` 拆分为 `foundations` / `components` 两组区块，映射到 Tailwind `theme.extend`.colors/spacing，实现 token → class 的完整链路。  
3. **多输出管线**：`npm run build:theme`（现有）+ `npm run build:hydrogen`（输出无 Liquid 的纯 HTML/CSS 资源），方便 AI Builder 复用。  
4. **性能基线**：引入 `vite-plugin-shopify` 进行热更新，结合 `npm run test:perf`（Lighthouse CI）守护 90+ 得分。

### 3.2 购买核心功能
| 阶段 | Section/Module | 功能要点 | 执行动作 |
| ---- | -------------- | -------- | -------- |
| 产品发现 | `sections/personalized-feed.liquid` | AI 推荐、标签筛选、库存提示 | 复用 Shopify Search & Discovery API，提供 settings 控制数据源 |
| 产品比较 | `sections/product-compare.liquid` | 多商品对比、规格表、收藏 | 使用 metafield 映射 + `dynamic-source` |
| 加购体验 | `sections/quick-cart-drawer.liquid` | Mini cart、加购附加品、折扣提示 | 集成 Shopify Functions (cart_transform) |
| 结账前 | `snippets/upsell-offer.liquid` | 追加销售、bundle 逻辑 | 结合 Checkout UI Extension 触发条件 |
| 售后信任 | `sections/promise-bar.liquid` | 运费、退货、客服入口 | Token 化 icon + 文案配置 |

### 3.3 通用模块库
1. **AI Landing 套件**：Hero、Feature Grid、Testimonials、Pricing、FAQ（全部区块化，可自由组合）。  
2. **运营组件**：倒计时条、福利弹窗、Lead Capture、多语言公告。  
3. **内容/社区模块**：Blog Highlights、UGC Marquee、Social Proof。  
4. **系统片段**：`snippets/analytics-event.liquid` 统一埋点，`snippets/form-controls.liquid` 共享输入组件。  
→ 每个模块附带 `docs/module-<name>.md`（结构 + schema + AI prompt）供自动化生成。

### 3.4 自动化与质量
1. **CI 拆分**：  
   - `test-theme.yml`: Theme Check + npm run lint  
   - `build-assets.yml`: 仅编译并上传 `assets/*.liquid`  
   - `preview-deploy.yml`: 触发 Shopify CLI `theme push --unpublished`  
2. **可观测性**：加入 `npm run test:visual`（Playwright + Percy）守护关键模板。  
3. **LLM 校验**：在 `docs/` 增加 `prompt-library.md` 描述如何提示 AI 生成符合 token 的代码。

## 4. 执行路线图
| Sprint | 目标 | 交付物 |
| ------ | ---- | ------ |
| Sprint 0 (准备) | 明确需求、拆分 token | 更新 `settings_schema.json`、`tailwind.config.js`、本方案文档 |
| Sprint 1 (架构) | 完成目录/构建升级 | 新建 `patterns/`、多输出命令、CI 拆分 |
| Sprint 2 (购买核心) | 新增 PDP/Cart/Checkout 相关 Section & Snippet | 交付 4 个核心模块 + Functions 示例 |
| Sprint 3 (通用模块) | 覆盖营销与内容区块 | 至少 6 个高复用 Section + Prompt 指南 |
| Sprint 4 (体验闭环) | 加入自动化测试、文档更新 | Lighthouse 基线、Playwright 脚本、docs 同步 |

## 5. 依赖、风险与应对
- **依赖**：Shopify CLI ≥ 3.62、Functions 运行时、Hydrogen 2024.10、Node 20 LTS。
- **风险 1**：Functions/Checkout 托管需要 Plus 权限 → 预设降级方案（无 Functions 的 fallback）。  
- **风险 2**：AI 生成代码质量参差 → 通过 prompt library + Playwright 回归降低回归风险。  
- **风险 3**：视觉规范割裂 → 补充 Theme 专属视觉规范并在 README 链接。

## 6. 文档与传播
1. 将本方案链接加入 `docs/README.md` 的 Documentation Files 列表。  
2. 新建 `docs/theme-visual-guidelines.md`（后续任务）以取代 React 场景的 `visual_spec.md`，或保留两者并标注使用范围。  
3. 在主 README 的“架构说明”章节追加“AI 建站扩展能力”小节，列出新增模块与自动化链路。

---

通过以上步骤，主题包将：  
1. 在 Shopify 最新生态中保持兼容与扩展性；  
2. 覆盖 DTC 商家最核心的购买漏斗功能；  
3. 为 AI 助手提供结构化的模块与提示模板，实现“输入需求 → 自动生成/装配页面”的闭环。
