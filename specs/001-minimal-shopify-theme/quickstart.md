# 快速入门指南：最小化 Shopify 主题

**功能**: 001-minimal-shopify-theme  
**目标时间**: 从零到实时预览 < 15 分钟  
**最后更新**: 2025年11月4日

## 概述

本指南将引导您从初始克隆到 Shopify 开发商店中的实时预览，设置最小化 Shopify 主题。按照这些步骤顺序进行，以获得最流畅的体验。

---

## 先决条件

在开始之前，请确保您已具备：

- ✅ **Node.js 16+** 已安装（[下载](https://nodejs.org/)）
- ✅ **Git** 已安装并配置
- ✅ **Shopify 开发商店**或合作伙伴账户（[创建一个](https://www.shopify.com/partners)）
- ✅ **GitHub 账户**（用于部署）
- ✅ **代码编辑器**（推荐 VS Code）
- ✅ **终端/命令提示符**访问权限

**检查您的 Node.js 版本**:
```bash
node --version
# 应显示 v16.0.0 或更高版本
```

---

## 快速开始（5 个步骤）

### 步骤 1：克隆仓库（1 分钟）

```bash
# 克隆仓库
git clone https://github.com/username/minimal-shopify-theme.git
cd minimal-shopify-theme

# 验证您在正确的目录中
ls -la
# 您应该看到：layout/、templates/、sections/、config/ 等
```

---

### 步骤 2：安装依赖项（2 分钟）

```bash
# 安装 Node.js 依赖项
npm install

# 这将安装：
# - Vite（构建工具）
# - Tailwind CSS（样式）
# - Shopify Theme Check（验证）
# - 其他开发工具
```

**预期输出**:
```
added 127 packages in 45s
```

---

### 步骤 3：构建主题资源（1 分钟）

```bash
# 运行构建过程
npm run build

# 这将编译：
# - src/css/tailwind.css → assets/theme.css
# - src/js/main.js → assets/theme.js
```

**预期输出**:
```
vite v5.x.x building for production...
✓ built in 3.21s
```

**验证构建成功**:
```bash
ls assets/
# 您应该看到：theme.css 和 theme.js
```

---

### 步骤 4：安装 Shopify CLI（2 分钟）

如果您还没有安装 Shopify CLI：

```bash
# macOS/Linux（使用 Homebrew）
brew tap shopify/shopify
brew install shopify-cli

# 或通过 npm 安装
npm install -g @shopify/cli @shopify/theme

# 验证安装
shopify version
```

---

### 步骤 5：连接到 Shopify 商店（5-10 分钟）

```bash
# 启动开发服务器
shopify theme dev --store=your-store.myshopify.com

# 将 'your-store' 替换为您实际的商店名称
```

**接下来会发生什么**:

1. **身份验证**: 浏览器打开，让您登录 Shopify 合作伙伴账户
2. **商店选择**: CLI 列出您的商店；选择开发商店
3. **主题上传**: CLI 将主题文件上传到 Shopify
4. **本地服务器**: CLI 启动本地预览服务器

**预期输出**:
```
✔ Synced theme #123456789 on your-store.myshopify.com

Preview your theme:
http://127.0.0.1:9292

Customize your theme in Shopify:
https://your-store.myshopify.com/admin/themes/123456789/editor
```

---

## 🎉 成功！

您现在应该拥有：
- ✅ 本地预览在 `http://127.0.0.1:9292`
- ✅ Shopify 管理后台中的主题
- ✅ 启用实时重载
- ✅ 准备好进行定制

---

## 下一步

### 验证一切正常

1. **打开本地预览**: 在浏览器中访问 `http://127.0.0.1:9292`
2. **检查首页**: 应该看到最小化主题布局
3. **测试导航**: 点击浏览产品、集合、购物车

### 开始定制

**编辑 Liquid 模板**:
```bash
# 编辑首页
open templates/index.liquid

# 更改通过 Shopify CLI 自动同步
```

**编辑样式**:
```bash
# 在新终端中，启动 Vite 监视模式
npm run dev

# 现在编辑：src/css/tailwind.css
# 更改自动编译到 assets/theme.css
```

**编辑 JavaScript**:
```bash
# 在 npm run dev 仍在运行时
# 编辑：src/js/main.js 或 src/js/modules/*.js
# 更改自动编译到 assets/theme.js
```

---

## 开发工作流

### 典型开发会话

```bash
# 终端 1：Shopify CLI（用于 Liquid 模板）
shopify theme dev --store=your-store.myshopify.com

# 终端 2：Vite 监视模式（用于 CSS/JS）
npm run dev
```

### 进行更改

1. **Liquid 更改**（模板、部分、代码片段）:
   - 编辑 `.liquid` 文件
   - 保存 → Shopify CLI 自动同步
   - 刷新浏览器以查看更改

2. **CSS 更改**（Tailwind）:
   - 编辑 `src/css/tailwind.css` 或在 `.liquid` 文件中添加类
   - 保存 → Vite 自动重建
   - 刷新浏览器以查看更改

3. **JavaScript 更改**:
   - 编辑 `src/js/main.js` 或模块文件
   - 保存 → Vite 自动重建
   - 刷新浏览器以查看更改

---

## 部署到 GitHub

### 将仓库连接到 Shopify

1. **将代码推送到 GitHub**:
   ```bash
   git add .
   git commit -m "Initial theme setup"
   git push origin main
   ```

2. **在 Shopify 管理后台连接**:
   - 转到：`在线商店 → 主题`
   - 点击：`添加主题 → 从 GitHub 连接`
   - 选择：您的仓库和分支（main）
   - Shopify 创建一个链接到 GitHub 的新主题

3. **自动部署**:
   - 每次推送到 `main` 都会触发 GitHub Actions
   - GitHub Actions 运行：`npm ci && npm run build`
   - 构建的资源自动提交
   - Shopify 通过 GitHub 集成同步更改

### GitHub Actions 工作流

仓库包含 `.github/workflows/build-deploy.yml`:

```yaml
# 在推送到 main 时自动运行
name: 构建和部署主题

on:
  push:
    branches: [main]

jobs:
  build:
    - 安装依赖
    - 构建资源（CSS + JS）
    - 运行主题检查验证
    - 提交构建的资源
    - Shopify 自动同步更改
```

---

## 定制主题设置

### 通过 Shopify 管理后台

1. **打开主题编辑器**:
   - 转到：`在线商店 → 主题`
   - 找到您的主题 → 点击 `自定义`

2. **主题设置**:
   - 点击左侧边栏中的主题设置图标（⚙️）
   - 配置：
     - **颜色**: 主色、次色、文本、背景
     - **排版**: 标题和正文字体
     - **布局**: 最大宽度、间距、对齐
     - **产品**: 网格设置、显示选项
     - **社交媒体**: 添加社交媒体 URL

3. **保存更改**:
   - 更改保存到 `config/settings_data.json`
   - 通过 Shopify CLI 或 GitHub 同步

### 通过代码

编辑 `config/settings_schema.json` 以添加新设置：

```json
{
  "name": "自定义设置",
  "settings": [
    {
      "type": "text",
      "id": "custom_setting",
      "label": "自定义设置",
      "default": "默认值"
    }
  ]
}
```

---

## 添加部分

### 创建新部分

1. **创建文件**: `sections/my-section.liquid`

2. **添加 Liquid + Schema**:
```liquid
<div class="my-section">
  <h2>{{ section.settings.heading }}</h2>
  <!-- 您的内容 -->
</div>

{% schema %}
{
  "name": "我的部分",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "标题",
      "default": "我的部分"
    }
  ],
  "presets": [
    {
      "name": "我的部分",
      "category": "自定义"
    }
  ]
}
{% endschema %}
```

3. **在主题编辑器中使用**:
   - 打开主题编辑器
   - 点击 "添加部分"
   - 在自定义类别下找到 "我的部分"
   - 配置并保存

---

## 常见任务

### 向模板添加 Tailwind 类

```liquid
<!-- templates/product.liquid -->
<div class="max-w-7xl mx-auto px-4 py-8">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <!-- 产品内容 -->
  </div>
</div>
```

**重要**: 添加新的 Tailwind 类后：
1. Vite 监视模式（`npm run dev`）自动重建 CSS
2. 或手动运行 `npm run build`
3. 刷新浏览器以查看样式

### 添加 JavaScript 功能

```javascript
// src/js/modules/my-feature.js
export function initMyFeature() {
  const buttons = document.querySelectorAll('.my-button');
  buttons.forEach(button => {
    button.addEventListener('click', handleClick);
  });
}

function handleClick(e) {
  console.log('按钮被点击！');
}

// src/js/main.js
import { initMyFeature } from './modules/my-feature.js';

document.addEventListener('DOMContentLoaded', () => {
  initMyFeature();
  // 其他初始化...
});
```

### 使用 Web Component 创建可重用组件

**优先使用原生 Web Component**：对于需要封装状态和样式的复杂组件，优先考虑使用原生 JavaScript Web Component API。

```javascript
// src/js/modules/product-card-component.js
class ProductCard extends HTMLElement {
  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }
  
  render() {
    const product = JSON.parse(this.dataset.product);
    this.innerHTML = `
      <div class="product-card">
        <img src="${product.image}" alt="${product.title}" loading="lazy">
        <h3>${product.title}</h3>
        <span class="price">${product.price}</span>
        <button class="add-to-cart">加入购物车</button>
      </div>
    `;
  }
  
  attachEventListeners() {
    const addToCartBtn = this.querySelector('.add-to-cart');
    addToCartBtn?.addEventListener('click', () => {
      this.handleAddToCart();
    });
  }
  
  async handleAddToCart() {
    const productId = this.dataset.productId;
    // 处理添加到购物车逻辑
  }
}

// 注册自定义元素
customElements.define('product-card', ProductCard);
```

**在 Liquid 模板中使用**:
```liquid
<!-- templates/product.liquid -->
<product-card 
  data-product='{"title": "{{ product.title }}", "price": "{{ product.price | money }}"}' 
  data-product-id="{{ product.id }}">
</product-card>
```

**Web Component 的优势**:
- ✅ 零框架依赖，无运行时开销
- ✅ 原生浏览器支持，性能优异
- ✅ 组件封装性好，样式和行为隔离
- ✅ 与 Shopify Liquid 模板良好集成

### 验证主题

```bash
# 运行 Shopify 主题检查
npm run lint

# 或直接：
shopify theme check
```

修复常见问题：
- 缺少翻译
- 已弃用的 Liquid 标签
- 性能问题
- 可访问性问题

---

## 故障排除

### 构建失败

**问题**: `npm run build` 失败  
**解决方案**:
```bash
# 清除 node_modules 并重新安装
rm -rf node_modules
npm install
npm run build
```

### Shopify CLI 连接问题

**问题**: 无法连接到商店  
**解决方案**:
```bash
# 注销并重新登录
shopify auth logout
shopify theme dev --store=your-store.myshopify.com
```

### 更改未显示

**问题**: 编辑内容未在浏览器中显示  
**解决方案**:
1. **硬刷新**: Cmd+Shift+R（Mac）或 Ctrl+Shift+R（Windows）
2. **检查终端**: 确保 Shopify CLI 正在运行
3. **重建资源**: `npm run build` 然后刷新
4. **清除缓存**: 在 DevTools 中禁用浏览器缓存

### CSS 未更新

**问题**: 新的 Tailwind 类不起作用  
**解决方案**:
```bash
# 确保 Vite 正在监视
npm run dev

# 或手动重建
npm run build
```

### 大型包大小

**问题**: CSS/JS 文件太大  
**解决方案**:
```bash
# 检查包大小
ls -lh assets/

# 确保 Tailwind 清除正在工作
# 检查 tailwind.config.js content 数组包含所有 .liquid 文件
```

---

## 性能提示

### 优化图像

使用 Shopify 的图像 CDN 和大小参数：

```liquid
<!-- 好：已优化 -->
<img src="{{ product.image | image_url: width: 400 }}" loading="lazy">

<!-- 差：全尺寸 -->
<img src="{{ product.image }}">
```

### 延迟加载非关键 JavaScript

```liquid
<!-- 关键 JS：立即加载 -->
<script src="{{ 'theme.js' | asset_url }}" defer></script>

<!-- 非关键：异步加载 -->
<script src="{{ 'optional.js' | asset_url }}" async></script>
```

### 内联关键 CSS（高级）

对于首屏内容：

```liquid
<!-- layout/theme.liquid -->
<style>
  /* 关键 CSS 内联在此（< 2KB） */
  .hero { /* ... */ }
</style>

<!-- 完整样式表异步加载 -->
<link rel="preload" href="{{ 'theme.css' | asset_url }}" as="style">
<link rel="stylesheet" href="{{ 'theme.css' | asset_url }}" media="print" onload="this.media='all'">
```

---

## VS Code 扩展（推荐）

安装这些以获得更好的开发体验：

1. **Shopify Liquid** - 语法高亮和代码片段
2. **Tailwind CSS IntelliSense** - Tailwind 类自动完成
3. **Shopify Theme Check** - 实时主题验证
4. **Prettier** - 代码格式化

```bash
# 安装主题检查扩展
code --install-extension Shopify.theme-check-vscode
```

---

## 资源

### 文档
- [Shopify 主题文档](https://shopify.dev/themes)
- [Liquid 参考](https://shopify.dev/api/liquid)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Vite 文档](https://vitejs.dev/)

### 工具
- [Shopify CLI](https://shopify.dev/themes/tools/cli)
- [主题检查](https://shopify.dev/themes/tools/theme-check)
- [Polaris 设计系统](https://polaris.shopify.com/)

### 社区
- [Shopify 社区论坛](https://community.shopify.com/)
- [GitHub Issues](https://github.com/username/minimal-shopify-theme/issues)

---

## 支持

### 获取帮助

1. **查阅文档**: 参见上面的资源
2. **搜索问题**: 在 GitHub issues 中查找类似问题
3. **询问社区**: 在 Shopify 社区论坛发帖
4. **创建问题**: 在 GitHub 上创建详细的问题

### 报告错误

报告问题时，请包括：
- Node.js 版本（`node --version`）
- Shopify CLI 版本（`shopify version`）
- 错误消息（完整输出）
- 重现步骤
- 预期与实际行为

---

## 成功检查清单

完成本指南后，您应该拥有：

- ✅ 主题已克隆并安装了依赖项
- ✅ 资源构建成功（theme.css、theme.js）
- ✅ Shopify CLI 已连接到开发商店
- ✅ 本地预览在 http://127.0.0.1:9292 运行
- ✅ 主题在 Shopify 管理后台可见
- ✅ 实时重载工作正常（Liquid + CSS/JS）
- ✅ 了解开发工作流
- ✅ 能够定制主题设置
- ✅ 能够添加部分和代码片段

**总时间**: 10-15 分钟 ✅

---

## 下一步是什么？

现在您的主题已设置好，可以探索：

1. **[实施计划](./plan.md)** - 完整技术架构
2. **[数据模型](./data-model.md)** - 主题结构和实体
3. **[研究](./research.md)** - 技术决策和理由
4. **[契约](./contracts/)** - 配置架构

开始定制并构建您的商店吧！🚀
