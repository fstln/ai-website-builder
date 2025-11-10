# Heyup News 视觉规范（Tailwind + React/Vite）

版本：1.0  
更新日期：2025-11-07

本规范面向当前 Heyup News 克隆项目，约束颜色、字体、间距、通用样式、阴影、动画、圆角与透明度的统一使用，并结合 Tailwind 标准工具类落地。

---

## 1. 概览

- 风格定位：简洁现代、科技感、信息优先、对比清晰。
- 版式策略：全宽区块 + 居中内容容器（max-w-7xl），移动优先，逐级增强。
- 品牌强调：以蓝色为主的强调色用于 CTA 与关键状态，灰白中性色负责布局与可读性。

---

## 2. 色板（Tailwind 默认色值）

- 品牌主色（Primary Blue）
  - blue-600: #2563eb（主按钮/强调）
  - blue-700: #1d4ed8（主按钮 hover）
  - blue-100: #dbeafe（徽标/轻强调）
  - blue-50:  #eff6ff（英雄区背景渐变起点）
  - blue-800: #1e40af（深蓝文字，如徽标文字）

- 中性色（Neutrals）
  - white:    #ffffff（卡片/按钮浅底/页面主底与蒙层）
  - gray-50:  #f9fafb（应用背景，如页面基底）
  - gray-100: #f3f4f6（轻底，如分类 Chip 背景）
  - gray-200: #e5e7eb（边框/分割线）
  - gray-700: #374151（次要文字）
  - gray-800: #1f2937（较强文字）
  - gray-900: #111827（主文字）

- 透明度与特殊
  - bg-white/90（吸顶头部半透明）
  - transparent（渐变与过渡）

用法要点：
- 高对比正文统一使用 text-gray-900。
- 次级说明使用 text-gray-700。
- 可交互元素 hover、focus 使用品牌蓝进行强调（bg-blue-600 → hover:bg-blue-700）。

---

## 3. 字体与排版系统（Tailwind 原生 + 使用规范）

### 3.1 设计原则

本项目完全基于 **Tailwind CSS 原生类**，通过**使用规范**保证一致性：
- **无自定义类**：100% 使用 Tailwind 原生工具类
- **规范化使用**：明确定义各场景下的类组合
- **灵活可扩展**：可根据具体需求调整组合
- **零冗余**：不增加额外 CSS 体积

### 3.2 字体家族

- **默认字体**: Inter（通过 Google Fonts 引入）
- **Fallback**: 系统字体栈

```html
<!-- 所有文本默认使用 sans 字体家族 -->
<body class="font-sans antialiased">
```

### 3.3 排版层级规范（基于 Tailwind 原生类）

#### Display - 英雄区超大标题
| 标签 | Tailwind 类组合 | 使用场景 |
|------|----------------|---------|
| H1 | `text-5xl sm:text-6xl font-bold tracking-tight` | 首页英雄区、Landing Page |
| H1 | `text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight` | 响应式大标题 |

```html
<h1 class="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900">
  创新科技，引领未来
</h1>
```

#### Headline - 页面主标题
| 标签 | Tailwind 类组合 | 使用场景 |
|------|----------------|---------|
| H1 | `text-4xl sm:text-5xl font-extrabold tracking-tight` | 博客列表、文章详情主标题 |
| H2 | `text-3xl sm:text-4xl font-bold tracking-tight` | 页面次级区块标题 |
| H3 | `text-2xl sm:text-3xl font-bold` | 区块内小标题 |

```html
<!-- 博客页面主标题 -->
<h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
  {{ blog.title }}
</h1>

<!-- 区块标题 -->
<h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-8">
  最新文章
</h2>
```

#### Title - 组件标题、卡片标题
| 标签 | Tailwind 类组合 | 使用场景 |
|------|----------------|---------|
| H2/H3 | `text-2xl font-bold` | 中型卡片标题 |
| H3 | `text-xl font-semibold` | 标准卡片标题（**推荐**） |
| H3 | `text-lg font-semibold` | 小卡片、列表项标题 |

```html
<!-- 博客卡片标题 -->
<h3 class="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
  {{ article.title }}
</h3>

<!-- 小卡片标题 -->
<h3 class="text-lg font-semibold text-gray-900 mb-1">
  相关文章
</h3>
```

#### Body - 正文、描述文字
| 元素 | Tailwind 类组合 | 使用场景 |
|------|----------------|---------|
| P | `text-lg sm:text-xl leading-relaxed` | 页面描述、引言（响应式） |
| P | `text-base leading-relaxed` | 标准正文、文章内容 |
| P | `text-sm leading-relaxed` | 卡片摘要、辅助说明 |

```html
<!-- 页面描述 -->
<p class="text-lg sm:text-xl leading-relaxed text-gray-700 max-w-3xl">
  {{ blog.description }}
</p>

<!-- 卡片摘要 -->
<p class="text-sm leading-relaxed text-gray-700 line-clamp-3 mb-4">
  {{ article.excerpt }}
</p>
```

#### Label - 按钮、标签、元数据
| 元素 | Tailwind 类组合 | 使用场景 |
|------|----------------|---------|
| Button/Span | `text-base font-medium` | 大按钮文字 |
| Button/Span | `text-sm font-medium` | 标准按钮、分类标签 |
| Span/Time | `text-xs font-medium` | 徽章、元数据、时间戳 |

```html
<!-- 主按钮 -->
<button class="text-base font-medium px-6 py-3 bg-blue-600 text-white rounded-lg">
  立即购买
</button>

<!-- 分类标签 -->
<span class="text-sm font-medium px-4 py-2 bg-gray-100 text-gray-800 rounded-full">
  科技
</span>

<!-- 元数据 -->
<div class="text-xs font-medium text-gray-600 flex items-center gap-1.5">
  <span>John Doe</span>
  <span>·</span>
  <time>Dec 15, 2024</time>
</div>
```

### 3.4 完整排版规范表

| 类型 | 尺寸 | 字重 | 行高 | 字距 | Tailwind 类 |
|------|------|------|------|------|-------------|
| **Display Large** | text-6xl | font-bold | - | tracking-tight | `text-6xl font-bold tracking-tight` |
| **Display** | text-5xl | font-bold | - | tracking-tight | `text-5xl font-bold tracking-tight` |
| **H1（页面）** | text-4xl/5xl | font-extrabold | - | tracking-tight | `text-4xl sm:text-5xl font-extrabold tracking-tight` |
| **H2（区块）** | text-3xl/4xl | font-bold | - | tracking-tight | `text-3xl sm:text-4xl font-bold tracking-tight` |
| **H3（小节）** | text-2xl/3xl | font-bold | - | - | `text-2xl sm:text-3xl font-bold` |
| **Title Large** | text-2xl | font-bold | - | - | `text-2xl font-bold` |
| **Title Medium** | text-xl | font-semibold | - | - | `text-xl font-semibold` |
| **Title Small** | text-lg | font-semibold | - | - | `text-lg font-semibold` |
| **Body Large** | text-lg/xl | font-normal | leading-relaxed | - | `text-lg sm:text-xl leading-relaxed` |
| **Body** | text-base | font-normal | leading-relaxed | - | `text-base leading-relaxed` |
| **Body Small** | text-sm | font-normal | leading-relaxed | - | `text-sm leading-relaxed` |
| **Label Large** | text-base | font-medium | - | - | `text-base font-medium` |
| **Label** | text-sm | font-medium | - | - | `text-sm font-medium` |
| **Label Small** | text-xs | font-medium | - | - | `text-xs font-medium` |

### 3.5 响应式排版策略

```html
<!-- 大标题 - 移动优先，逐级增大 -->
<h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
  响应式标题
</h1>

<!-- 正文 - 移动端较小，桌面端舒适 -->
<p class="text-base sm:text-lg leading-relaxed">
  响应式正文
</p>

<!-- 按钮 - 移动端紧凑，桌面端宽松 -->
<button class="text-sm sm:text-base font-medium px-4 sm:px-6 py-2 sm:py-3">
  响应式按钮
</button>
```

### 3.6 实际应用示例

#### 博客列表页
```html
<!-- 页面主标题 -->
<h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
  技术博客
</h1>

<!-- 页面描述 -->
<p class="text-lg sm:text-xl leading-relaxed text-gray-700 max-w-3xl">
  探索最新的技术趋势和开发实践
</p>

<!-- 分类标签 -->
<a class="text-sm font-medium px-4 py-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200">
  全部
</a>

<!-- 卡片标题 -->
<h3 class="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
  {{ article.title }}
</h3>

<!-- 元数据 -->
<div class="text-xs font-medium text-gray-600 flex items-center gap-1.5">
  <span>作者名</span>
  <span>·</span>
  <time>2024-12-15</time>
</div>

<!-- 摘要 -->
<p class="text-sm leading-relaxed text-gray-700 line-clamp-3 mb-4">
  {{ article.excerpt }}
</p>

<!-- Read More -->
<span class="text-sm font-semibold text-blue-600 hover:text-blue-700">
  阅读更多 →
</span>
```

#### 按钮组
```html
<!-- 主按钮 -->
<button class="text-base font-medium px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:shadow-lg">
  立即购买
</button>

<!-- 次按钮 -->
<button class="text-sm font-medium px-5 py-2.5 bg-white text-gray-900 rounded-lg border border-gray-200">
  了解更多
</button>
```

### 3.7 最佳实践

1. **保持一致性** - 相同层级使用相同的类组合
2. **移动优先** - 默认移动端尺寸，通过 sm/lg 断点增大
3. **字重搭配**：
   - 大标题用 bold/extrabold（700/800）
   - 中小标题用 semibold/bold（600/700）
   - 正文用 normal（400）
   - 按钮/标签用 medium（500）
4. **行高选择**：
   - 标题：默认或 tracking-tight
   - 正文：leading-relaxed（1.75）
   - 按钮/标签：默认（1.5）
5. **可调整性** - 根据实际效果微调，保持灵活

---

## 4. 间距系统（Tailwind 原生 + 4px 基线）

### 4.1 设计原则

基于 **Tailwind 默认间距刻度**（4px 基线），通过使用规范保证一致性：
- **使用 Tailwind 原生类**：完全使用 p-*, m-*, gap-*, space-* 等
- **4px 基线递增**：1 = 4px, 2 = 8px, 3 = 12px, 4 = 16px...
- **语义化组合**：明确不同场景的间距使用
- **响应式优先**：移动端紧凑，桌面端舒适

### 4.2 Tailwind 间距刻度对照

| Tailwind 类 | 像素值 | rem 值 | 使用场景 |
|------------|--------|--------|---------|
| `0` | 0px | 0 | 清除间距 |
| `px` | 1px | - | 边框级微间距 |
| `0.5` | 2px | 0.125rem | 极小间距 |
| `1` | 4px | 0.25rem | 最小可视间距 |
| `1.5` | 6px | 0.375rem | 标签内小间距 |
| `2` | 8px | 0.5rem | 小间距（图标、徽章） |
| `3` | 12px | 0.75rem | 紧凑间距 |
| `4` | 16px | 1rem | 标准间距（**推荐**） |
| `5` | 20px | 1.25rem | 舒适间距 |
| `6` | 24px | 1.5rem | 宽松间距（**推荐**） |
| `8` | 32px | 2rem | 区块间距 |
| `10` | 40px | 2.5rem | 大区块间距 |
| `12` | 48px | 3rem | 页面区块间距 |
| `16` | 64px | 4rem | 大区块间距 |
| `20` | 80px | 5rem | 超大区块间距 |
| `24` | 96px | 6rem | 页面级间距 |

### 4.3 间距使用规范

#### 内边距（Padding）- 元素内部空间

| 场景 | Tailwind 类 | 像素值 | 使用场景 |
|------|------------|--------|---------|
| **按钮小** | `px-4 py-2` | 16px / 8px | 次要按钮、标签 |
| **按钮标准** | `px-5 py-3` | 20px / 12px | 主按钮（**推荐**） |
| **按钮大** | `px-6 py-3` | 24px / 12px | 大型 CTA |
| **卡片紧凑** | `p-4` | 16px | 小卡片 |
| **卡片标准** | `p-6` | 24px | 标准卡片（**推荐**） |
| **卡片宽松** | `p-8` | 32px | 大卡片、对话框 |
| **容器横向** | `px-4 sm:px-6 lg:px-8` | 16/24/32px | 页面容器（**标准**） |
| **区块纵向** | `py-8 sm:py-12 lg:py-16` | 32/48/64px | 页面区块 |

```html
<!-- 主按钮 -->
<button class="px-5 py-3 bg-blue-600 text-white rounded-lg">
  立即购买
</button>

<!-- 标准卡片 -->
<div class="p-6 bg-white border border-gray-200 rounded-lg">
  卡片内容
</div>

<!-- 页面容器 -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
  内容
</div>
```

#### 外边距（Margin）- 元素之间空间

| 场景 | Tailwind 类 | 像素值 | 使用场景 |
|------|------------|--------|---------|
| **元素微间距** | `mb-2` | 8px | 标题与副标题 |
| **元素小间距** | `mb-3` | 12px | 元数据行 |
| **元素标准** | `mb-4` | 16px | 段落、表单项（**推荐**） |
| **组件间距** | `mb-6` | 24px | 卡片标题、表单组（**推荐**） |
| **区块间距** | `mb-8` | 32px | 页面区块 |
| **大区块** | `mb-12` | 48px | 主要区块分隔 |
| **页面级** | `mb-16` | 64px | 页面大区块 |

```html
<!-- 标题组 -->
<div class="mb-12">
  <h1 class="text-4xl font-extrabold mb-6">页面标题</h1>
  <p class="text-lg leading-relaxed">页面描述</p>
</div>

<!-- 卡片内部 -->
<div class="p-6">
  <h3 class="text-xl font-semibold mb-2">卡片标题</h3>
  <p class="text-xs text-gray-600 mb-3">元数据</p>
  <p class="text-sm mb-4">描述文字</p>
  <button>操作按钮</button>
</div>
```

#### Gap - Flexbox/Grid 间距

| 场景 | Tailwind 类 | 像素值 | 使用场景 |
|------|------------|--------|---------|
| **密集** | `gap-1` | 4px | 图标组、徽章组 |
| **紧凑** | `gap-2` | 8px | 标签组、分类 Chips |
| **标准** | `gap-3` | 12px | 按钮组 |
| **舒适** | `gap-4` | 16px | 表单项、导航（**推荐**） |
| **宽松** | `gap-6` | 24px | 卡片网格（**推荐**） |
| **超宽松** | `gap-8` | 32px | 大卡片网格 |

```html
<!-- 标签组 -->
<div class="flex flex-wrap gap-2">
  <span class="px-4 py-2 bg-gray-100 rounded-full">标签1</span>
  <span class="px-4 py-2 bg-gray-100 rounded-full">标签2</span>
</div>

<!-- 卡片网格 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div class="p-6 bg-white rounded-lg">卡片1</div>
  <div class="p-6 bg-white rounded-lg">卡片2</div>
</div>

<!-- 元数据行 -->
<div class="flex items-center gap-1.5">
  <span>作者</span>
  <span>·</span>
  <time>日期</time>
</div>
```

#### Space Between - 子元素间距

| 场景 | Tailwind 类 | 像素值 | 使用场景 |
|------|------------|--------|---------|
| `space-y-2` | 8px | 紧凑列表项 |
| `space-y-4` | 16px | 标准列表项（**推荐**） |
| `space-y-6` | 24px | 宽松列表项 |
| `space-y-8` | 32px | 区块列表 |

```html
<!-- 垂直列表 -->
<div class="space-y-4">
  <div class="p-4 bg-white border rounded-lg">项目1</div>
  <div class="p-4 bg-white border rounded-lg">项目2</div>
  <div class="p-4 bg-white border rounded-lg">项目3</div>
</div>
```

### 4.4 响应式间距策略

```html
<!-- 容器 - 移动端紧凑，桌面端宽松 -->
<div class="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
  内容
</div>

<!-- 网格 - 移动端小间距，桌面端大间距 -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
  卡片
</div>

<!-- 按钮 - 移动端紧凑，桌面端舒适 -->
<button class="px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 text-white rounded-lg">
  响应式按钮
</button>
```

### 4.5 完整间距规范表

#### 常用间距组合

| 组件 | 内边距 | 外边距 | Gap | 场景 |
|------|--------|--------|-----|------|
| **主按钮** | `px-5 py-3` | - | - | 标准 CTA |
| **次按钮** | `px-4 py-2` | - | - | 次要操作 |
| **标签** | `px-4 py-2` | - | `gap-2` | 分类筛选 |
| **徽章** | `px-2.5 py-1` | - | `gap-1.5` | 状态标识 |
| **卡片** | `p-6` | `mb-6` | - | 标准卡片 |
| **卡片网格** | - | - | `gap-6` | 博客列表 |
| **页面容器** | `px-4 sm:px-6 lg:px-8` | - | - | 主容器 |
| **页面区块** | `py-8 sm:py-12 lg:py-16` | `mb-12 lg:mb-16` | - | 区块分隔 |

### 4.6 实际应用示例

#### 博客列表页
```html
<!-- 页面容器 -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
  
  <!-- 页面头部 -->
  <div class="mb-12">
    <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
      技术博客
    </h1>
    <p class="text-lg sm:text-xl leading-relaxed text-gray-700">
      探索最新技术趋势
    </p>
  </div>
  
  <!-- 分类标签 -->
  <div class="mb-10">
    <div class="flex flex-wrap gap-2">
      <a class="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium">全部</a>
      <a class="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium">技术</a>
    </div>
  </div>
  
  <!-- 文章网格 -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <article class="group">
      <div class="aspect-[3/2] rounded-lg overflow-hidden mb-4">
        <img src="..." class="w-full h-full object-cover" />
      </div>
      <h3 class="text-xl font-semibold mb-2">文章标题</h3>
      <div class="text-xs font-medium text-gray-600 mb-3 flex items-center gap-1.5">
        <span>作者</span>
        <span>·</span>
        <time>日期</time>
      </div>
      <p class="text-sm leading-relaxed text-gray-700 mb-4">摘要</p>
      <span class="text-sm font-semibold text-blue-600">阅读更多 →</span>
    </article>
  </div>
</div>
```

#### 表单
```html
<form class="space-y-6 max-w-md">
  <!-- 表单项 -->
  <div>
    <label class="block text-sm font-medium text-gray-900 mb-2">
      用户名
    </label>
    <input class="w-full px-4 py-3 border border-gray-300 rounded-lg" />
  </div>
  
  <div>
    <label class="block text-sm font-medium text-gray-900 mb-2">
      邮箱
    </label>
    <input class="w-full px-4 py-3 border border-gray-300 rounded-lg" />
  </div>
  
  <!-- 按钮组 -->
  <div class="flex gap-3">
    <button class="flex-1 px-5 py-3 bg-blue-600 text-white rounded-lg">
      提交
    </button>
    <button class="px-5 py-3 bg-gray-100 text-gray-900 rounded-lg">
      取消
    </button>
  </div>
</form>
```

### 4.7 最佳实践

1. **保持 4px 基线** - 优先使用 1, 2, 3, 4, 6, 8, 12, 16 等值
2. **响应式优先** - 移动端紧凑（px-4 py-2），桌面端舒适（px-6 py-3）
3. **使用 gap 优于 margin** - Flexbox/Grid 布局优先用 gap
4. **层级清晰**：
   - 小间距（1-3）：元素内部、紧密关联
   - 标准间距（4-6）：组件内、相关元素
   - 大间距（8-12）：组件间、区块分隔
   - 超大间距（16-24）：页面级区块
5. **一致性** - 相同类型的组件使用相同间距值

---

## 5. 通用样式与布局

- 页面与容器
  - 页面根：min-h-screen bg-gray-50 text-gray-900 scroll-smooth
  - 内容容器：max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
  - 全宽区块：w-full（默认）

- 分割线与边框
  - 分隔：border-gray-200（如 Header 底部线、分类导航上下边）
  - 轮廓：边框尽量轻，避免过度装饰

- 链接与按钮（建议态）
  - 链接默认：text-gray-700 hover:text-gray-900 transition-colors
  - 主按钮（Primary CTA）：
    - px-5 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 hover:shadow-lg transform hover:scale-105 transition-all
  - 次按钮（Secondary/Outline）：
    - px-5 py-3 bg-white text-gray-900 rounded-lg border border-gray-200 shadow-sm hover:shadow transition-all

示例：
```
<a class="px-5 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 hover:shadow-lg transform hover:scale-105 transition-all">Primary</a>
<a class="px-5 py-3 bg-white text-gray-900 rounded-lg border border-gray-200 shadow-sm hover:shadow transition-all">Secondary</a>
```

---

## 6. 阴影（Shadows）

- 基本层级
  - 基础态：shadow（如按钮基础）
  - 悬停态：hover:shadow-md 或 hover:shadow-lg（强调可点击）
  - 卡片/列表：建议 shadow-sm~md（克制，突出信息）

- 用法原则
  - 交互元素在 hover 增强阴影，提升可感知性。
  - 吸顶头部不使用阴影，以边框和半透明强调层级。

---

## 7. 动画与过渡

- 过渡
  - transition-all 或 transition-colors，建议 duration-200/300，ease-out
- 交互变换
  - transform + hover:scale-105（按钮等）
- 视觉效果
  - 英雄区使用渐变背景：bg-gradient-to-b from-blue-50 via-white to-white
  - 吸顶头部：bg-white/90 + backdrop-blur（提升可读性与层级）

示例：
```
<button class="transition-all duration-200 hover:scale-105">交互按钮</button>
<div class="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-white"></div>
<header class="sticky top-0 bg-white/90 backdrop-blur border-b border-gray-200"></header>
```

---

## 8. 圆角系统（Border Radius - Material Design 3 Shape）

### 8.1 设计原则

现代 DTC 网站的圆角使用遵循 Material Design 3 Shape 系统，通过圆角大小传达以下信息：
- **品牌个性**：更大的圆角（8-16px）= 友好、现代、可接近
- **功能属性**：圆角大小暗示元素的交互性和层级
- **视觉统一**：同类元素使用统一圆角值，建立设计语言一致性

### 8.2 圆角层级定义

项目使用 CSS 变量定义完整的圆角系统，支持整站快速调整：

```css
/* Material Design 3 Shape System */
--radius-xs: 4px;      /* Extra Small - 徽章内小元素、分隔线 */
--radius-sm: 8px;      /* Small - 按钮、输入框、导航链接、图片 */
--radius-md: 12px;     /* Medium - 卡片、对话框、表单容器 */
--radius-lg: 16px;     /* Large - 大卡片、模态框 */
--radius-xl: 20px;     /* Extra Large - 特大容器 */
--radius-2xl: 24px;    /* 2X Large - Hero sections */
--radius-full: 9999px; /* Full - Chips、badges、pills */
```

### 8.3 组件圆角使用规范

#### 交互元素（Interactive Elements）
- **按钮（主要/次要）**: `rounded-lg` (8px)
  - 清晰可点击，现代友好
  - 主按钮：`px-5 py-3 bg-blue-600 text-white rounded-lg`
  - 次按钮：`px-5 py-3 bg-white text-gray-900 rounded-lg border`

- **导航链接**: `rounded-lg` (8px) 或 `var(--radius-sm)`
  - Header 导航：`px-4 py-2 rounded-lg hover:bg-gray-100`
  - Footer 链接：保持一致

- **表单输入框**: `rounded-lg` (8px)
  - `border border-gray-300 rounded-lg px-4 py-3`
  - Focus 状态：`focus:ring-2 focus:ring-blue-600`

#### 内容容器（Content Containers）
- **博客卡片图片**: `rounded-lg` (8px)
  - 清晰锐利的边缘，突出内容
  - `aspect-[3/2] rounded-lg overflow-hidden`

- **评论框/对话框**: `rounded-lg` (8px)
  - `border border-gray-200 rounded-lg p-6`

- **Newsletter 容器**: `var(--radius-md)` (12px)
  - 更温和的表单容器
  - `border-radius: var(--radius-md)`

#### 标识元素（Labels & Badges）
- **标签/Chips（分类、标签）**: `rounded-full`
  - 标准 pill 形状，最高识别度
  - `px-4 py-2 rounded-full bg-gray-100 text-gray-800`
  - 示例：分类过滤、文章标签

- **徽章/通知**: `rounded-full`
  - 购物车数量、阅读时间等
  - `px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs`

- **状态指示器**: `rounded-full`
  - 在线状态、新消息提示等

### 8.4 使用场景矩阵

| 元素类型 | Tailwind 类 | CSS 变量 | 像素值 | 使用场景 |
|---------|------------|----------|--------|---------|
| **按钮** | `rounded-lg` | `var(--radius-sm)` | 8px | 主按钮、次按钮、操作按钮 |
| **图片容器** | `rounded-lg` | `var(--radius-sm)` | 8px | 博客封面、产品图、头像（非圆形） |
| **输入框** | `rounded-lg` | `var(--radius-sm)` | 8px | 文本框、搜索框、下拉框 |
| **导航项** | `rounded-lg` | `var(--radius-sm)` | 8px | Header 链接、侧边栏菜单 |
| **卡片容器** | `rounded-xl` | `var(--radius-md)` | 12px | 产品卡片外框（如使用） |
| **模态框** | `rounded-2xl` | `var(--radius-lg)` | 16px | 弹窗、对话框 |
| **Chips/标签** | `rounded-full` | `var(--radius-full)` | 9999px | 分类、标签、徽章 |
| **头像** | `rounded-full` | `var(--radius-full)` | 9999px | 用户头像、作者头像 |

### 8.5 圆角组合最佳实践

#### ✅ 正确示例：统一层级
```html
<!-- 博客卡片：所有矩形元素使用 rounded-lg -->
<article class="blog-card">
  <div class="aspect-[3/2] rounded-lg overflow-hidden mb-4">
    <img src="..." class="w-full h-full object-cover" />
  </div>
  <span class="px-2.5 py-1 rounded-full bg-blue-100 text-xs">Tech</span>
  <h3 class="text-lg font-bold mb-2">文章标题</h3>
  <a href="..." class="inline-flex px-4 py-2 rounded-lg bg-blue-600 text-white">
    阅读更多
  </a>
</article>

<!-- 表单：输入框和按钮统一 rounded-lg -->
<form class="space-y-4">
  <input type="text" class="w-full rounded-lg border px-4 py-3" />
  <button class="w-full rounded-lg bg-blue-600 text-white px-5 py-3">
    提交
  </button>
</form>
```

#### ❌ 错误示例：混乱层级
```html
<!-- 不要混用不同的圆角值 -->
<article class="blog-card">
  <div class="rounded-md">...</div>  <!-- 不一致 -->
  <button class="rounded-xl">...</button>  <!-- 不一致 -->
  <span class="rounded-lg">Tag</span>  <!-- 应该用 rounded-full -->
</article>
```

### 8.6 响应式圆角（可选）

对于特别大的屏幕，可以适当增大圆角：
```html
<div class="rounded-lg lg:rounded-xl">
  <!-- 移动端 8px，桌面端 12px -->
</div>
```

### 8.7 整站风格调整

通过修改 CSS 变量可快速调整整站圆角风格：

```css
/* 保守风格（企业、专业） */
:root {
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
}

/* 标准风格（默认，现代） */
:root {
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
}

/* 激进风格（年轻、活泼） */
:root {
  --radius-sm: 12px;
  --radius-md: 16px;
  --radius-lg: 24px;
}
```

### 8.8 实现建议

1. **优先使用 Tailwind 类**：`rounded-lg`、`rounded-full` 等
2. **自定义组件使用变量**：`border-radius: var(--radius-sm)`
3. **避免硬编码像素值**：使用变量系统保证一致性
4. **同类元素统一圆角**：建立清晰的设计语言

### 8.9 完整示例

```html
<!-- Primary CTA Button -->
<a class="inline-flex items-center px-5 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 hover:shadow-lg transition-all">
  立即体验
</a>

<!-- Secondary Button -->
<a class="inline-flex items-center px-5 py-3 bg-white text-gray-900 rounded-lg border border-gray-200 shadow-sm hover:shadow transition-all">
  了解更多
</a>

<!-- Category Chip -->
<a class="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 text-gray-800 text-sm hover:bg-gray-200 transition-colors">
  科技新闻
</a>

<!-- Blog Card Image -->
<div class="aspect-[3/2] rounded-lg overflow-hidden bg-gray-100 mb-4">
  <img src="..." class="w-full h-full object-cover" />
</div>

<!-- Badge/Tag -->
<span class="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
  热门
</span>

<!-- Input Field -->
<input 
  type="text" 
  class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" 
  placeholder="输入内容..."
/>
```

---

## 9. 透明度（Opacity）

- 吸顶头部：bg-white/90（90% 白底）
- 背景渐变层：可搭配 pointer-events-none 确保不阻挡交互
- 文本不使用透明度降级，统一通过灰度控制层级（text-gray-700/900）

示例：
```
<header class="bg-white/90 backdrop-blur"></header>
<div class="pointer-events-none absolute inset-0"></div>
```

---

## 10. 组件级规范摘要

- Header（导航/吸顶）
  - 类：sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200
  - 桌面导航：text-sm text-gray-700 hover:text-gray-900 transition-colors
  - 移动端：优先显示“Browse”按钮，完整导航横向滚动 Chips

- Hero（首屏/品牌）
  - 背景：bg-gradient-to-b from-blue-50 via-white to-white
  - 标题：text-4xl sm:text-5xl font-extrabold tracking-tight
  - 段落：text-lg sm:text-xl text-gray-700 max-w-3xl
  - CTA 主次按钮组合，保持间距与对比

- Categories（分类导航）
  - 容器：border-t border-b border-gray-200 bg-white
  - Chip：inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-gray-100 text-gray-800 text-sm hover:bg-gray-200 transition-colors

---

## 11. 响应式断点使用

- 移动优先：默认样式优先适配 320px+
- 常用断点：
  - sm：≥640px（增大文字/内边距）
  - md：≥768px（显示桌面导航）
  - lg：≥1024px（容器横向内边距进一步增大）
- 模式：
  - 导航：md 以上显示完整链接；md 以下显示“Browse”与横向滚动 Chips

---

## 12. 无障碍（A11y）建议

- 焦点可见：
  - focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2
- 触控目标：
  - 可点击元素建议最小高度 40px（如 py-2 及以上）
- 对比度：
  - 文字与背景对比度 ≥ 4.5:1；深浅灰按规范选用。

示例：
```
<a class="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">可访问链接</a>
```

---

## 13. 项目中的 Tailwind 使用规范

- 仅使用官方标准工具类（禁止 bg-primary、text-foreground 等自定义类名）
- 禁止行内样式与 CSS-in-JS；样式全部使用工具类
- 唯一 CSS 文件：src/index.css，包含
  ```
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```
- 建议的交互过渡：
  - hover:bg-blue-700, hover:shadow-lg, transition-all duration-200
- 布局：
  - 全宽区块 w-full；内容容器 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
- 滚动：
  - 根元素启用 scroll-smooth

---

## 14. 示例片段合集

- Primary CTA
```
<a class="px-5 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 hover:shadow-lg transform hover:scale-105 transition-all">Explore all articles</a>
```

- Secondary CTA
```
<a class="px-5 py-3 bg-white text-gray-900 rounded-lg border border-gray-200 shadow-sm hover:shadow transition-all">Join the community</a>
```

- Category Chip
```
<a class="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-gray-100 text-gray-800 text-sm hover:bg-gray-200 transition-colors">All</a>
```

- Header 链接
```
<a class="text-sm text-gray-700 hover:text-gray-900 transition-colors">Community</a>
```

- 吸顶头部
```
<header class="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">...</header>
```

---

如需扩展（例如卡片/文章网格/页脚等），请在上述色板、间距、圆角、阴影和动效的范围内选取相邻强度，确保风格一致、层级清晰。