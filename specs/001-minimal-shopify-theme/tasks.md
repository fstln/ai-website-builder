# Tasks: 最小化 Shopify 主题模板框架

**输入**: 设计文档来自 `/specs/001-minimal-shopify-theme/`  
**先决条件**: plan.md (已完成), spec.md (已完成), research.md (已完成), data-model.md (已完成), contracts/ (已完成)

**组织**: 任务按用户故事分组，以便每个故事可以独立实现和测试。

## 格式说明: `[ID] [P?] [Story] 描述`

- **[P]**: 可以并行运行（不同文件，无依赖）
- **[Story]**: 此任务属于哪个用户故事（例如 US1, US2, US3）
- 描述中包含确切的文件路径

## 路径约定

- 所有路径相对于仓库根目录
- Shopify 主题遵循标准目录结构：layout/, templates/, sections/, snippets/, assets/, config/, locales/, src/

---

## Phase 1: 设置（共享基础设施）

**目的**: 项目初始化和基础结构

- [x] T001 创建项目根目录结构（layout/, templates/, sections/, snippets/, assets/, config/, locales/, src/）
- [x] T002 创建源文件目录结构（src/css/, src/js/modules/）
- [x] T003 [P] 初始化 package.json 并配置构建脚本（build, dev, lint）
- [x] T004 [P] 创建 vite.config.js 配置（输出到 assets/，支持 Tailwind CSS 和 JS 模块打包）
- [x] T005 [P] 创建 tailwind.config.js 配置（扫描所有 .liquid 文件，配置主题变量）
- [x] T006 [P] 创建 .theme-check.yml 配置文件（Shopify 主题验证规则）
- [x] T007 [P] 创建 .shopifyignore 文件（排除构建工具和源文件）
- [x] T008 [P] 创建 .github/workflows/build-deploy.yml（GitHub Actions 工作流）

---

## Phase 2: 基础（阻塞先决条件）

**目的**: 核心基础设施，必须在任何用户故事实现之前完成

**⚠️ 关键**: 此阶段完成前不能开始任何用户故事工作

- [x] T009 创建基础布局模板 layout/theme.liquid（包含 content_for_header, content_for_layout, 资源引用）
- [x] T010 [P] 创建密码保护布局 layout/password.liquid
- [x] T011 [P] 创建主题配置架构 config/settings_schema.json（基于 contracts/settings_schema.json）
- [x] T012 [P] 创建默认设置数据 config/settings_data.json
- [x] T013 [P] 创建基础翻译文件 locales/en.default.json（必需翻译键）
- [x] T014 创建基础 Tailwind CSS 源文件 src/css/tailwind.css（@tailwind base/components/utilities）
- [x] T015 创建基础 JavaScript 入口文件 src/js/main.js（模块导入和初始化）
- [x] T016 [P] 实现初始构建流程（运行 npm run build 生成 assets/theme.css 和 assets/theme.js）

**检查点**: 基础就绪 - 现在可以开始用户故事实现

---

## Phase 3: 用户故事 1 - 从模板初始化新主题项目 (优先级: P1) 🎯 MVP

**目标**: 开发者可以克隆仓库、连接到 Shopify 商店，并看到功能齐全的最小化主题，所有基本页面正常工作

**独立测试**: 克隆仓库 → 运行 npm install → 运行 npm run build → 通过 Shopify CLI 连接到开发商店 → 验证主题在主题编辑器中显示 → 发布主题 → 验证所有基本页面（首页、产品、集合、购物车）加载无错误

### 实现任务 - 用户故事 1

#### 必需模板文件

- [x] T017 [P] [US1] 创建首页模板 templates/index.liquid（使用 Theme 1.0 架构）
- [x] T018 [P] [US1] 创建产品页面模板 templates/product.liquid（产品详情、表单、变体选择）
- [x] T019 [P] [US1] 创建集合列表模板 templates/collection.liquid（产品网格、分页）
- [x] T020 [P] [US1] 创建购物车模板 templates/cart.liquid（购物车项目、总计、结账按钮）
- [x] T021 [P] [US1] 创建静态页面模板 templates/page.liquid（通用内容页面）
- [x] T022 [P] [US1] 创建博客列表模板 templates/blog.liquid（文章列表）
- [x] T023 [P] [US1] 创建博客文章模板 templates/article.liquid（文章内容、评论）
- [x] T024 [P] [US1] 创建搜索结果模板 templates/search.liquid（搜索结果展示）
- [x] T025 [P] [US1] 创建 404 错误页面模板 templates/404.liquid

#### 核心部分（Sections）

- [x] T026 [P] [US1] 创建页眉部分 sections/header.liquid（导航、品牌、购物车图标）
- [x] T027 [P] [US1] 创建页脚部分 sections/footer.liquid（链接、社交媒体、版权信息）
- [x] T028 [P] [US1] 创建首页英雄横幅部分 sections/hero.liquid（可配置标题、描述、CTA）
- [x] T029 [P] [US1] 创建特色产品部分 sections/featured-products.liquid（可配置集合、产品数量）
- [x] T030 [P] [US1] 创建特色集合部分 sections/featured-collection.liquid（集合展示）

#### 代码片段（Snippets）

- [x] T031 [P] [US1] 创建产品卡片代码片段 snippets/product-card.liquid（产品图片、标题、价格）
- [x] T032 [P] [US1] 创建图标代码片段 snippets/icon.liquid（SVG 图标渲染器）
- [x] T033 [P] [US1] 创建图片代码片段 snippets/image.liquid（响应式图片包装器）
- [x] T034 [P] [US1] 创建价格代码片段 snippets/price.liquid（价格格式化组件）
- [x] T035 [P] [US1] 创建面包屑代码片段 snippets/breadcrumbs.liquid（导航面包屑）

#### JavaScript 功能模块

- [x] T036 [P] [US1] 实现购物车功能模块 src/js/modules/cart.js（添加商品、更新数量、删除）
- [x] T037 [P] [US1] 实现产品表单模块 src/js/modules/product.js（变体选择、数量选择）
- [x] T038 [P] [US1] 实现导航模块 src/js/modules/navigation.js（移动菜单、下拉菜单）
- [x] T039 [US1] 在 src/js/main.js 中集成所有模块初始化

#### 样式和资源

- [x] T040 [US1] 确保所有模板使用 Tailwind CSS 类进行响应式布局
- [x] T041 [US1] 验证所有页面在移动、平板和桌面视口正常显示
- [x] T042 [US1] 添加基础静态资源（logo.svg, placeholder.svg, favicon.ico）到 assets/

#### 文档

- [x] T043 [US1] 创建 README.md（项目描述、快速开始、GitHub 连接说明）
- [x] T044 [US1] 验证主题通过 Shopify theme check 验证（零错误）

**检查点**: 此时，用户故事 1 应该完全功能齐全并可独立测试。开发者可以克隆、构建、连接并发布主题，看到所有基本页面正常工作。

---

## Phase 4: 用户故事 2 - 为特定商店需求定制主题 (优先级: P2)

**目标**: 开发者可以通过 Shopify 管理后台修改主题设置，编辑模板文件，添加自定义部分，所有更改都能正确反映在商店前台

**独立测试**: 通过 Shopify 管理后台修改颜色、字体、布局设置 → 验证更改立即反映在前台 → 编辑模板文件添加自定义内容 → 创建新部分文件 → 在主题编辑器中添加新部分 → 验证所有更改正常工作

### 实现任务 - 用户故事 2

#### 主题设置扩展

- [ ] T045 [P] [US2] 扩展 config/settings_schema.json 添加颜色设置组（主色、次色、文本色、背景色）
- [ ] T046 [P] [US2] 扩展 config/settings_schema.json 添加排版设置组（标题字体、正文字体、基础字号）
- [ ] T047 [P] [US2] 扩展 config/settings_schema.json 添加布局设置组（最大宽度、间距、对齐方式）
- [ ] T048 [P] [US2] 扩展 config/settings_schema.json 添加产品网格设置组（每行产品数、显示选项）
- [ ] T049 [US2] 在模板中集成主题设置变量（使用 settings.color_primary 等）

#### 可定制部分

- [ ] T050 [P] [US2] 创建新闻订阅部分 sections/newsletter.liquid（邮件订阅表单）
- [ ] T051 [P] [US2] 创建客户评价部分 sections/testimonials.liquid（可配置评价内容）
- [ ] T052 [P] [US2] 创建富文本部分 sections/rich-text.liquid（可配置文本内容）
- [ ] T053 [P] [US2] 创建图片横幅部分 sections/image-banner.liquid（可配置图片、标题、链接）

#### 代码片段扩展

- [ ] T054 [P] [US2] 创建分页代码片段 snippets/pagination.liquid（页面导航控件）
- [ ] T055 [P] [US2] 创建社交分享代码片段 snippets/social-sharing.liquid（社交媒体分享按钮）
- [ ] T056 [P] [US2] 创建数量选择器代码片段 snippets/quantity-selector.liquid（数量输入控件）

#### 样式定制支持

- [ ] T057 [US2] 在 Tailwind 配置中添加 CSS 变量支持（var(--color-primary) 等）
- [ ] T058 [US2] 在 layout/theme.liquid 中添加内联样式块（注入主题设置 CSS 变量）
- [ ] T059 [US2] 确保所有组件响应主题设置变化

#### 文档

- [ ] T060 [US2] 在 README.md 中添加定制指南部分（如何修改设置、添加部分、自定义样式）

**检查点**: 此时，用户故事 1 和 2 都应该独立工作。开发者可以完全定制主题外观和功能。

---

## Phase 5: 用户故事 3 - 通过 GitHub 部署主题更新 (优先级: P2)

**目标**: 开发者可以通过 GitHub 提交推送更改，GitHub Actions 自动构建，Shopify 通过 GitHub 集成自动同步更改

**独立测试**: 在本地进行代码更改 → 提交并推送到 GitHub → 验证 GitHub Actions 工作流运行 → 验证构建资产自动提交 → 验证 Shopify 通过 GitHub 集成同步更改 → 验证回滚功能（Git revert）

### 实现任务 - 用户故事 3

#### GitHub Actions 工作流

- [ ] T061 [US3] 完善 .github/workflows/build-deploy.yml（Node.js 设置、依赖安装、构建、主题检查、提交资产）
- [ ] T062 [US3] 配置工作流触发条件（push 到 main/develop，pull_request）
- [ ] T063 [US3] 添加构建资产自动提交步骤（使用 [skip ci] 防止循环）
- [ ] T064 [US3] 添加主题验证步骤（theme-check 在 CI 中运行）

#### GitHub 集成文档

- [ ] T065 [US3] 在 README.md 中添加详细的 GitHub 连接说明（Shopify 管理后台连接步骤）
- [ ] T066 [US3] 添加分支部署策略说明（不同分支连接到不同主题槽）
- [ ] T067 [US3] 添加回滚指南（如何通过 Git revert 回滚更改）

#### 构建优化

- [ ] T068 [US3] 优化构建流程确保构建时间 < 30 秒
- [ ] T069 [US3] 添加构建缓存配置（npm ci 缓存）
- [ ] T070 [US3] 验证构建资产大小符合性能预算（CSS < 20KB, JS < 15KB gzip）

#### 错误处理

- [ ] T071 [US3] 添加 GitHub Actions 工作流错误处理（超时、重试逻辑）
- [ ] T072 [US3] 添加构建失败通知（可选）

**检查点**: 此时，用户故事 1、2 和 3 都应该独立工作。完整的 CI/CD 流程已就位。

---

## Phase 6: 用户故事 4 - 理解主题结构并扩展功能 (优先级: P3)

**目标**: 开发者可以通过文档理解主题结构，遵循约定添加新功能，新功能与现有架构无缝集成

**独立测试**: 阅读文档 → 理解文件组织 → 添加新部分 → 添加新代码片段 → 添加新 JavaScript 功能 → 验证新功能正确集成

### 实现任务 - 用户故事 4

#### 文档完善

- [ ] T073 [P] [US4] 完善 README.md 添加详细的架构说明（文件结构、实体关系）
- [ ] T074 [P] [US4] 创建 ARCHITECTURE.md（详细说明每个目录的用途、约定、最佳实践）
- [ ] T075 [P] [US4] 创建 CONTRIBUTING.md（如何添加新功能、代码风格、提交规范）
- [ ] T076 [P] [US4] 在代码中添加注释和文档字符串（Liquid 模板、JavaScript 模块）

#### 代码示例和模板

- [ ] T077 [US4] 创建示例部分模板（展示如何创建新部分）
- [ ] T078 [US4] 创建示例代码片段模板（展示如何创建新代码片段）
- [ ] T079 [US4] 创建示例 JavaScript 模块模板（展示如何添加新功能）
- [ ] T080 [US4] 创建 Web Component 示例（展示如何使用原生 Web Component）

#### 开发工具支持

- [ ] T081 [US4] 添加 .editorconfig 文件（代码格式统一）
- [ ] T082 [US4] 添加 .prettierrc 配置文件（可选，代码格式化）
- [ ] T083 [US4] 在 README.md 中添加推荐的 VS Code 扩展列表

#### 快速参考

- [ ] T084 [US4] 创建快速参考指南（常用 Liquid 标签、过滤器、对象）
- [ ] T085 [US4] 创建常见问题解答（FAQ）部分

**检查点**: 此时，所有用户故事都应该完成。主题结构清晰，文档完善，开发者可以轻松扩展功能。

---

## Phase 7: 完善与跨领域关注点

**目的**: 影响多个用户故事的改进

#### 性能优化

- [ ] T086 [P] 优化 CSS 包大小（确保 Tailwind purge 正确工作，目标 < 20KB gzip）
- [ ] T087 [P] 优化 JavaScript 包大小（tree-shaking，目标 < 15KB gzip）
- [ ] T088 [P] 添加图片优化最佳实践（使用 Shopify CDN，响应式图片）
- [ ] T089 [P] 验证 Lighthouse 性能分数 > 85（所有类别）

#### 可访问性

- [ ] T090 [P] 添加语义化 HTML（所有模板使用正确的 HTML5 语义标签）
- [ ] T091 [P] 添加 ARIA 标签（表单、导航、交互元素）
- [ ] T092 [P] 验证键盘导航支持
- [ ] T093 [P] 验证颜色对比度符合 WCAG 标准

#### 代码质量

- [ ] T094 [P] 运行完整的 theme-check 验证（确保零错误、零警告）
- [ ] T095 [P] 代码审查和重构（确保代码遵循最佳实践）
- [ ] T096 [P] 验证所有 Liquid 模板遵循 Shopify 主题 1.0 约定

#### 文档验证

- [ ] T097 [P] 验证 quickstart.md 中的所有步骤都可以执行（< 15 分钟目标）
- [ ] T098 [P] 更新所有文档链接和示例
- [ ] T099 [P] 创建变更日志 CHANGELOG.md

#### 最终验证

- [ ] T100 完整端到端测试（克隆 → 安装 → 构建 → 连接 → 发布 → 验证所有页面）
- [ ] T101 验证主题文件总大小 < 5MB
- [ ] T102 验证所有成功标准（SC-001 到 SC-009）都已满足

---

## 依赖关系与执行顺序

### 阶段依赖

- **设置（Phase 1）**: 无依赖 - 可立即开始
- **基础（Phase 2）**: 依赖设置完成 - **阻塞所有用户故事**
- **用户故事（Phase 3-6）**: 都依赖基础阶段完成
  - 用户故事可以并行进行（如果有足够人员）
  - 或按优先级顺序进行（P1 → P2 → P3）
- **完善（Phase 7）**: 依赖所有所需用户故事完成

### 用户故事依赖

- **用户故事 1 (P1)**: 基础阶段完成后可开始 - 不依赖其他故事（MVP）
- **用户故事 2 (P2)**: 基础阶段完成后可开始 - 可能需要 US1 的部分组件，但应独立可测试
- **用户故事 3 (P2)**: 基础阶段完成后可开始 - 依赖 US1 的完整主题结构
- **用户故事 4 (P3)**: 基础阶段完成后可开始 - 依赖所有之前的故事完成，提供文档和示例

### 每个用户故事内部

- 模板 → 部分 → 代码片段 → JavaScript → 样式 → 文档
- 核心实现 → 集成 → 测试 → 文档
- 故事完成后再进入下一个优先级

### 并行机会

- 所有标记 [P] 的设置任务可以并行运行
- 所有标记 [P] 的基础任务可以并行运行（在 Phase 2 内）
- 基础阶段完成后，所有用户故事可以并行开始（如果团队容量允许）
- 用户故事内的标记 [P] 的任务可以并行运行（不同文件，无依赖）
- 不同用户故事可以由不同团队成员并行处理

---

## 并行示例：用户故事 1

```bash
# 并行创建所有必需模板：
T017: templates/index.liquid
T018: templates/product.liquid
T019: templates/collection.liquid
T020: templates/cart.liquid
T021: templates/page.liquid
T022: templates/blog.liquid
T023: templates/article.liquid
T024: templates/search.liquid
T025: templates/404.liquid

# 并行创建所有核心部分：
T026: sections/header.liquid
T027: sections/footer.liquid
T028: sections/hero.liquid
T029: sections/featured-products.liquid
T030: sections/featured-collection.liquid

# 并行创建所有代码片段：
T031: snippets/product-card.liquid
T032: snippets/icon.liquid
T033: snippets/image.liquid
T034: snippets/price.liquid
T035: snippets/breadcrumbs.liquid

# 并行创建 JavaScript 模块：
T036: src/js/modules/cart.js
T037: src/js/modules/product.js
T038: src/js/modules/navigation.js
```

---

## 实施策略

### MVP 优先（仅用户故事 1）

1. 完成 Phase 1: 设置
2. 完成 Phase 2: 基础（关键 - 阻塞所有故事）
3. 完成 Phase 3: 用户故事 1
4. **停止并验证**: 独立测试用户故事 1
5. 如果准备就绪，部署/演示

### 增量交付

1. 完成设置 + 基础 → 基础就绪
2. 添加用户故事 1 → 独立测试 → 部署/演示（MVP！）
3. 添加用户故事 2 → 独立测试 → 部署/演示
4. 添加用户故事 3 → 独立测试 → 部署/演示
5. 添加用户故事 4 → 独立测试 → 部署/演示
6. 每个故事添加价值而不破坏之前的故事

### 并行团队策略

有多名开发者时：

1. 团队一起完成设置 + 基础
2. 基础完成后：
   - 开发者 A: 用户故事 1（MVP）
   - 开发者 B: 用户故事 2（定制）
   - 开发者 C: 用户故事 3（CI/CD）
3. 用户故事 1 完成后，开发者可以转向用户故事 4（文档）
4. 故事独立完成和集成

---

## 任务统计

- **总任务数**: 102
- **设置阶段**: 8 个任务
- **基础阶段**: 8 个任务
- **用户故事 1 (P1)**: 28 个任务
- **用户故事 2 (P2)**: 16 个任务
- **用户故事 3 (P2)**: 12 个任务
- **用户故事 4 (P3)**: 13 个任务
- **完善阶段**: 17 个任务

### 并行机会

- **Phase 1**: 7 个任务可并行
- **Phase 2**: 6 个任务可并行
- **Phase 3 (US1)**: 20+ 个任务可并行
- **Phase 4 (US2)**: 10+ 个任务可并行
- **Phase 5 (US3)**: 部分任务可并行
- **Phase 6 (US4)**: 4 个任务可并行
- **Phase 7**: 16 个任务可并行

### 独立测试标准

- **US1**: 克隆 → 安装 → 构建 → 连接 → 发布 → 验证所有基本页面功能
- **US2**: 修改设置 → 编辑模板 → 添加部分 → 验证所有更改生效
- **US3**: 推送更改 → 验证 CI/CD → 验证自动部署 → 验证回滚
- **US4**: 阅读文档 → 添加新功能 → 验证正确集成

### 建议的 MVP 范围

**仅用户故事 1** - 这提供了完整的最小化主题，可以立即使用：
- 所有必需模板
- 核心部分（header, footer, hero, featured products）
- 基本代码片段
- JavaScript 功能（购物车、产品表单、导航）
- 完整文档

**MVP 任务数**: 44 个任务（Phase 1 + Phase 2 + Phase 3）

---

## 注意事项

- [P] 任务 = 不同文件，无依赖
- [Story] 标签将任务映射到特定用户故事以便追溯
- 每个用户故事应该独立完成和可测试
- 在每个任务或逻辑组后提交
- 在任何检查点停止以独立验证故事
- 避免：模糊任务、相同文件冲突、破坏独立性的跨故事依赖

