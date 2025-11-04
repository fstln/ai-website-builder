# 实施计划：最小化 Shopify 主题模板框架

**分支**: `001-minimal-shopify-theme` | **日期**: 2025年11月4日 | **规范**: [spec.md](./spec.md)  
**输入**: 功能规范来自 `/specs/001-minimal-shopify-theme/spec.md`

**注意**: 此模板由 `/speckit.plan` 命令填充。执行工作流请参见 `.specify/templates/commands/plan.md`。

## 摘要

使用主题 1.0 架构（templates/index.liquid）构建一个最小化 Shopify 主题模板，开发者可以通过 GitHub 克隆和部署。主题使用 Tailwind CSS 进行样式设计，构建管道在 GitHub Actions 上运行，使用原生 JavaScript 进行交互，并遵循 Shopify 的主题结构约定。主要目标是快速项目初始化（< 15 分钟设置），同时保持简单性和可扩展性。

## 技术上下文

**语言/版本**: Liquid 模板（Shopify）、JavaScript ES6+、CSS3  
**主要依赖项**: 
- Tailwind CSS 3.x（样式框架）
- Vite 5.x（CSS 处理和优化的构建工具）
- 原生 JavaScript（无框架）
- Shopify Theme Kit 或 GitHub 集成（部署）

**存储**: 不适用（主题文件存储在仓库中，商家数据在 Shopify 中）  
**测试**: 通过 Shopify 开发商店进行手动测试 + 主题验证 CLI  
**目标平台**: Shopify 在线商店（主题 1.0 架构）  
**项目类型**: Shopify 主题（具有结构化目录的单个仓库）  
**性能目标**: 
- 3G 网络下首次内容绘制 < 1.5 秒
- 总页面大小 < 500KB（初始加载）
- Lighthouse 性能分数 > 85
- GitHub Actions 上构建时间 < 30 秒

**约束条件**: 
- 必须使用 Shopify 主题 1.0 架构（templates/*.liquid，不是 JSON 模板）
- GitHub Actions 必须能够自动运行构建过程
- Shopify 上不需要 Node.js 运行时（所有构建都是预编译的）
- 必须通过 Shopify 主题验证（theme check CLI）
- 文件结构必须遵循 Shopify 约定以兼容 GitHub 集成

**规模/范围**: 
- 10-15 个模板文件（主要页面类型）
- 8-12 个部分（可重用内容块）
- 5-10 个代码片段（共享组件）
- 单个主题仓库（总计 < 5MB）
- 预期使用：每月 50-100 个主题定制

## 章程检查

*门控：必须在阶段 0 研究之前通过。在阶段 1 设计后重新检查。*

**注意**: 项目章程文件仅包含模板占位符。由于这是新仓库中的第一个功能，我们将建立基线原则：

### 主题开发的基线原则

- ✅ **简单优先**: 使用最少的依赖项；避免过度工程化；遵循 Shopify 约定
- ✅ **构建时优化**: 所有处理都在构建期间进行（GitHub Actions），而不是运行时
- ✅ **默认性能**: 优化资源交付；延迟加载非关键资源
- ✅ **开发者体验**: 清晰的文档；直观的结构；快速迭代周期
- ✅ **Shopify 合规性**: 遵循主题检查规则；遵守架构标准

**状态**: ✅ 通过 - 无违规。此功能建立了项目基线。

## 项目结构

### 文档（此功能）

```text
specs/001-minimal-shopify-theme/
├── plan.md              # 此文件（/speckit.plan 命令输出）
├── research.md          # 阶段 0 输出：构建工具决策、Tailwind 设置
├── data-model.md        # 阶段 1 输出：主题实体和文件结构
├── quickstart.md        # 阶段 1 输出：设置和部署指南
├── contracts/           # 阶段 1 输出：主题配置架构
│   ├── settings_schema.json      # 主题设置结构
│   ├── section_schema.json       # 部分配置结构
│   └── build_config.json         # Vite 构建配置契约
└── tasks.md             # 阶段 2 输出（/speckit.tasks 命令 - 尚未创建）
```

### 源代码（仓库根目录）

```text
# 带构建管道的 Shopify 主题 1.0 结构

/                            # 仓库根目录
├── .github/
│   └── workflows/
│       └── build-deploy.yml # 用于构建和部署的 GitHub Actions 工作流
│
├── assets/                  # 编译的资源（CSS、JS、图像）
│   ├── theme.css           # 编译的 Tailwind CSS（由 Vite 生成）
│   ├── theme.js            # 打包的 JavaScript（由 Vite 生成）
│   └── *.{png,jpg,svg}     # 静态图像
│
├── config/                  # 主题配置
│   ├── settings_schema.json # 主题设置定义
│   └── settings_data.json   # 默认设置值
│
├── layout/                  # 布局模板
│   ├── theme.liquid        # 主布局包装器
│   └── password.liquid     # 密码保护的商店布局
│
├── locales/                 # 国际化
│   └── en.default.json     # 英文翻译
│
├── sections/                # 可重用部分（主题编辑器块）
│   ├── header.liquid
│   ├── footer.liquid
│   ├── hero.liquid
│   ├── featured-products.liquid
│   └── newsletter.liquid
│
├── snippets/                # 可重用组件
│   ├── product-card.liquid
│   ├── icon.liquid
│   └── image.liquid
│
├── templates/               # 页面模板（主题 1.0 架构）
│   ├── index.liquid        # 首页
│   ├── product.liquid      # 产品页面
│   ├── collection.liquid   # 集合列表
│   ├── cart.liquid         # 购物车
│   ├── page.liquid         # 静态页面
│   ├── blog.liquid         # 博客列表
│   ├── article.liquid      # 博客文章
│   ├── search.liquid       # 搜索结果
│   └── 404.liquid          # 未找到页面
│
├── src/                     # 源文件（构建前）
│   ├── css/
│   │   ├── tailwind.css    # Tailwind 输入文件
│   │   └── components/     # 自定义组件样式
│   └── js/
│       ├── main.js         # 主 JavaScript 入口
│       └── modules/        # 原生 JS 模块
│           ├── cart.js
│           └── product.js
│
├── .shopifyignore          # 从 Shopify 部署中排除的文件
├── vite.config.js          # Vite 构建配置
├── tailwind.config.js      # Tailwind CSS 配置
├── package.json            # Node 依赖项和构建脚本
├── .theme-check.yml        # Shopify 主题验证配置
└── README.md               # 设置和使用文档
```

**结构决策**: 使用带现代构建管道的 Shopify 主题 1.0 架构。源文件（src/）在构建过程中由 Vite 编译到 assets/。GitHub Actions 在推送时自动运行构建，然后 Shopify 部署编译的资源。这种方法在现代开发体验（Tailwind、模块）和 Shopify 的部署需求之间取得了平衡。

## 复杂度跟踪

> **仅在章程检查有需要说明的违规时填写**

*无需说明的违规 - 主题遵循标准 Shopify 约定，使用最少的额外工具。*

## 阶段 0：概述与研究

### 研究主题

以下领域需要调查以做出明智的技术决策：

1. **构建管道架构**: 如何将 Vite 与 Shopify 主题 1.0 部署集成
2. **Tailwind CSS 集成**: 考虑性能的 Shopify 主题最佳实践
3. **GitHub Actions 工作流**: 用于自动主题构建和部署的最佳 CI/CD 设置
4. **Shopify 主题检查**: 验证规则以及如何集成到开发工作流中
5. **资源优化**: 最小化 CSS/JS 包大小的策略
6. **开发工作流**: 使用 Shopify CLI 的本地开发设置

### 研究输出

详细发现和决策请参见 [research.md](./research.md)。

## 阶段 1：设计与契约

### 先决条件

✅ research.md 已完成

### 交付物

1. **data-model.md**: 主题文件结构、实体（模板、部分、代码片段）及其关系
2. **contracts/**: 主题配置和构建过程的 JSON 架构
3. **quickstart.md**: 开发者的分步设置指南
4. **代理上下文更新**: 为 AI 辅助记录的技术栈

### 设计验证门控

- [ ] 所有 Liquid 模板遵循 Shopify 主题 1.0 约定
- [ ] 构建管道可以在 Shopify 服务器上无需 Node.js 运行
- [ ] 主题结构支持增量定制
- [ ] 配置架构全面且有文档记录
- [ ] 设置过程达到规范中 < 15 分钟的目标

---

**下一步**: 继续阶段 0 研究生成。
