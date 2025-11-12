# 最小化 Shopify 主题

一个"最小化"的 Shopify 主题模板框架，用于快速启动新项目。该代码包可直接通过 GitHub 连接到 Shopify 主题。

## 特性

- ✅ **Shopify Theme 2.0 架构** - 使用 JSON 模板和 Sections Everywhere
- 🎨 **Tailwind CSS** - 实用优先的 CSS 框架，优化的性能
- 🚀 **Vite 构建工具** - 快速的开发和生产构建
- 📱 **响应式设计** - 移动端、平板和桌面端完全支持
- 🔧 **原生 JavaScript** - 零依赖，使用 ES6+ 模块和 Web Components
- 🔄 **GitHub Actions** - 自动构建和部署流程
- 🎯 **最小化体积** - CSS < 15KB, JS < 5KB (gzipped)

## 快速开始

### 前置要求

- Node.js 18+ 
- npm 或 yarn
- Shopify CLI
- Git

### 安装步骤

1. **克隆仓库**

```bash
git clone <your-repo-url>
cd minimal-shopify-theme
```

2. **安装依赖**

```bash
npm install
```

3. **构建资源**

```bash
npm run build
```

4. **连接到 Shopify**

```bash
shopify theme dev
```

这将启动本地开发服务器，并将主题连接到您的 Shopify 开发商店。

### 通过 GitHub 连接到 Shopify

1. **推送代码到 GitHub**

```bash
git remote add origin <your-github-repo>
git push -u origin main
```

2. **在 Shopify 管理后台连接 GitHub**

- 进入 **在线商店 > 主题**
- 点击 **添加主题 > 连接到 GitHub**
- 选择您的仓库和分支
- Shopify 将自动同步主题文件

3. **GitHub Actions 自动构建**

每次推送到 master 或 develop 分支时，GitHub Actions 将自动：
- 安装依赖
- 构建 CSS 和 JavaScript（`npm run build`）
- 运行主题检查（`npm run lint`）
- 自动提交编译后的 `assets/theme.css` 和 `assets/main.js`

**工作流文件**: `.github/workflows/build.yml`

## 开发

### 可用脚本

- `npm run build` - 构建生产资源
- `npm run dev` - 监视模式构建（开发时使用）
- `npm run lint` - 运行 Shopify 主题检查

### 项目结构

```
minimal-shopify-theme/
├── assets/              # 编译的 CSS、JS 和静态资源
├── config/              # 主题配置和设置
├── layout/              # 布局模板
├── locales/             # 翻译文件
├── sections/            # 可重用的主题部分
├── snippets/            # 可重用的代码片段
├── templates/           # 页面模板
├── src/
│   ├── css/            # Tailwind CSS 源文件
│   └── js/             # JavaScript 模块
├── .github/
│   └── workflows/      # GitHub Actions 工作流
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 定制

### 设计令牌系统

本主题使用全面的设计令牌系统，将设计决策与 HTML 结构分离，使视觉样式可以通过配置更改，而无需修改组件代码。

**AI 助手指南**: 
- 查看 `docs/design_tokens_guide.md` 了解如何修改设计令牌为 DTC 网站创建自定义视觉风格。  
- 查阅 `docs/brand_color_playbook.md` 选择/扩展品牌色板，`docs/color_scheme.md` 理解 color scheme 体系，`docs/accessibility_playbook.md` 落实可访问性护栏。  
- SEO 与语义结构参考 `docs/seo_playbook.md`，确保 meta、结构化数据、lazy loading、性能策略与设计一致。

**开发者指南**:
- 修改 `config/settings_schema.json` 更改默认令牌值
- 更新 `config/settings_data.json` 更改当前主题值
- 使用 `config/themes/` 中的预设文件快速切换样式
- 查看 `config/themes/README.md` 了解预设使用说明

### 修改颜色和样式

1. 通过 Shopify 主题编辑器修改设计令牌（推荐）
2. 编辑 `config/settings_schema.json` 更改默认值
3. 编辑 `config/settings_data.json` 直接更改当前值
4. 使用预设文件（`config/themes/*.json`）快速应用完整样式

### Color schemes

- 主题在 Shopify 端暴露 `color_scheme_group`（位于 Theme Settings → Color schemes），默认提供 `scheme-1 / scheme-2 / scheme-3` 三套方案，可在 `config/settings_data.json > color_schemes` 复制新增。
- 每个 section 顶层必须加入 `{ "type": "color_scheme", "id": "color_scheme" }` setting，并在模板里包裹 `class="color-scheme color-{{ section.settings.color_scheme | default: 'scheme-1' }}"`，block 只有在视觉上需要打破父级底色时才暴露同名设置。
- `snippets/color-schemes.liquid` 会把所有 scheme 输出为 CSS 变量，`tailwind.config.js` 则把变量映射到 `bg-background/bg-surface/bg-primary/ text-foreground/text-muted` 等工具类。编写样式时只使用这些语义类，不要写死 `#fff`、`bg-blue-600` 等值。
- 透明度统一通过 Tailwind 的 `color/opacity` 语法，例如 `text-foreground/80`、`bg-primary/90`。

### 添加 JavaScript 功能

优先使用原生 JavaScript Web Components：

```javascript
// src/js/modules/my-component.js
class MyComponent extends HTMLElement {
  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }
  
  render() {
    // 渲染逻辑
  }
  
  attachEventListeners() {
    // 事件监听
  }
}

customElements.define('my-component', MyComponent);
```

### 添加新模板或部分

1. 在相应目录创建新的 `.liquid` 文件
2. 在主题编辑器中使用您的新部分
3. 运行 `npm run build` 重新构建资源

## 部署

### 方法 1: GitHub 集成（推荐）

推送到 GitHub，Shopify 将自动同步更改：

```bash
git add .
git commit -m "Update theme"
git push
```

### 方法 2: Shopify CLI

```bash
shopify theme push
```

## 架构说明

### Shopify Theme 2.0 (Online Store 2.0)

本主题使用 Shopify Theme 2.0 架构（Online Store 2.0）：
- 模板文件使用 JSON 格式（如 `templates/index.json`）
- 支持 Sections Everywhere - 所有页面都可以添加和配置 sections
- 支持 App Blocks - 可以嵌入应用功能
- 更灵活的页面定制能力

### 构建流程

1. **源文件** → Tailwind CSS (`src/css/`) 和 JavaScript (`src/js/`)
2. **Vite 构建** → 编译、压缩、优化
3. **输出** → `assets/theme.css` 和 `assets/main.js`
4. **Shopify** → 通过 `{{ 'theme.css' | asset_url | stylesheet_tag }}` 引用

### JavaScript 模块

主题使用模块化的 JavaScript 架构：
- `src/js/main.js` - 主入口文件
- `src/js/modules/cart.js` - 购物车功能
- `src/js/modules/product.js` - 产品表单和变体选择（包含 Web Component 示例）
- `src/js/modules/navigation.js` - 导航和移动菜单

### Web Components 优先

本主题优先使用原生 JavaScript Web Components 来创建可重用组件：
- 零框架开销
- 原生浏览器支持
- 完全封装
- 易于维护

## 性能

- **CSS**: ~13KB (gzipped: ~3.4KB)
- **JavaScript**: ~5KB (gzipped: ~1.8KB)
- **Tailwind CSS** 使用 JIT 模式和积极的 purge 配置
- 所有图片使用响应式加载和 lazy loading
- 关键 CSS 内联在 `<head>` 中

## 浏览器支持

- Chrome (最新)
- Firefox (最新)
- Safari (最新)
- Edge (最新)
- 移动浏览器 (iOS Safari, Chrome Mobile)

## 贡献

欢迎提交 Pull Requests！对于重大更改，请先开 issue 讨论您想要更改的内容。

## 许可证

MIT

## 支持

如有问题或需要帮助，请在 GitHub 上开 issue。
