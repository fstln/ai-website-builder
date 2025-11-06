# Horizon 架构说明

本项目完全遵循 Shopify Horizon 主题的架构模式。

## 🏗️ 核心架构

### 1. Component Base（组件基类）

**文件**: `src/js/utils/component-base.js`

所有 Web Components 继承自 `Component` 基类，提供：

- **Ref 管理**: 使用 `ref` 属性自动收集 DOM 元素引用
  ```html
  <button ref="submitButton">Submit</button>
  <div ref="items[]">Item 1</div>
  <div ref="items[]">Item 2</div>
  ```

- **声明式事件处理**: 使用 `on:event` 属性自动绑定事件
  ```html
  <button on:click="/handleClick">Click Me</button>
  <button on:click="/handleClick/arg1/arg2">With Args</button>
  ```

- **工具方法**:
  - `$(selector)` - querySelector 快捷方式
  - `$$(selector)` - querySelectorAll 快捷方式
  - `emit(eventName, detail)` - 触发自定义事件
  - `announceToScreenReader(message)` - 屏幕阅读器通知
  - `debounce(func, wait)` - 防抖
  - `throttle(func, limit)` - 节流

### 2. Events System（事件系统）

**文件**: `src/js/utils/events.js`

定义主题级事件和事件构造器：

```javascript
import { ThemeEvents, QuantitySelectorUpdateEvent } from '../utils/events.js';

// 监听事件
document.addEventListener(ThemeEvents.quantitySelectorUpdate, (e) => {
  console.log('Quantity changed:', e.detail.quantity);
});

// 触发事件
document.dispatchEvent(QuantitySelectorUpdateEvent({
  quantity: 5,
  cartLine: 1,
  variantId: '12345'
}));
```

**可用事件**:
- `theme:cart:update` - 购物车更新
- `theme:cart:add` - 添加到购物车
- `theme:quantity-selector:update` - 数量选择器更新
- `theme:discount:update` - 折扣更新
- `theme:variant:change` - 变体切换

### 3. Section Renderer（区块渲染器）

**文件**: `src/js/utils/section-renderer.js`

处理 Shopify Section Rendering API：

```javascript
import { sectionRenderer, morphSection } from '../utils/section-renderer.js';

// 获取更新后的 section HTML
const html = await sectionRenderer('main-cart');

// 更新 DOM
morphSection(targetElement, html);
```

## 📦 组件架构

### Quantity Selector（数量选择器）

**继承链**: 
- `QuantitySelectorComponent` (基础) → `CartQuantitySelectorComponent` (购物车特化)

**文件**:
- `src/js/components/quantity-selector.js` - 基础组件
- `src/js/components/cart-quantity-selector.js` - 购物车特化

**关键特性**:
- 自动禁用状态管理
- 服务器禁用状态保留
- 最大值计算（产品页 vs 购物车页不同逻辑）
- 事件驱动更新

**区别**:
- **产品页**: `max - cartQuantity` (还能加多少)
- **购物车页**: `max` (购物车中总共能有多少)

### Cart Items（购物车项）

**文件**: `src/js/components/cart-items-new.js`

**工作流程**:
1. 监听 `theme:quantity-selector:update` 事件
2. 调用 Shopify Cart API (`/cart/change.js`)
3. 请求时包含 `sections` 参数获取更新后的 HTML
4. 使用 `morphSection` 更新 DOM
5. 触发 `theme:cart:update` 事件通知其他组件

**关键特性**:
- 防抖处理 (300ms)
- AbortController 取消重复请求
- 加载状态管理
- 错误处理和屏幕阅读器通知
- 移除动画

## 🔧 使用方式

### 1. 创建新组件

```javascript
import { Component } from '../utils/component-base.js';

class MyComponent extends Component {
  // 声明必需的 refs
  requiredRefs = ['button', 'input'];

  connectedCallback() {
    super.connectedCallback();
    // 组件初始化
    // this.refs.button 和 this.refs.input 已自动填充
  }

  // 使用 on:click="/handleClick" 调用
  handleClick(event) {
    const value = this.refs.input.value;
    this.emit('my-component:click', { value });
  }
}

customElements.define('my-component', MyComponent);
```

### 2. 在 Liquid 中使用

```liquid
<my-component>
  <input type="text" ref="input" />
  <button on:click="/handleClick" ref="button">Click</button>
</my-component>
```

### 3. 监听组件事件

```javascript
document.addEventListener('my-component:click', (e) => {
  console.log('Value:', e.detail.value);
});
```

## 🎯 核心流程

### 购物车更新流程

```
用户点击 +/- 按钮
    ↓
<button on:click="/increaseQuantity">  [Horizon 声明式]
    ↓
QuantitySelector.increaseQuantity()  [ref 系统]
    ↓
document.dispatchEvent(QuantitySelectorUpdateEvent)  [事件]
    ↓
CartItems 监听到事件 (防抖 300ms)
    ↓
调用 /cart/change.js 并包含 sections 参数
    ↓
获取更新后的 section HTML
    ↓
使用 morphSection 替换 DOM
    ↓
触发 CartUpdateEvent 通知其他组件
    ↓
✅ 购物车实时更新！
```

### 变体选择流程

```
用户选择变体选项
    ↓
<input on:change> / <select on:change>  [Horizon 声明式]
    ↓
VariantSelector.variantChanged()  [自动触发]
    ↓
触发 VariantSelectedEvent (立即，禁用按钮)
    ↓
构建 Section Rendering URL (?variant=123&section_id=xxx)
    ↓
fetch() 获取更新后的产品数据和 HTML
    ↓
触发 VariantUpdateEvent (包含完整变体数据)
    ↓
ProductForm 监听事件:
  - 更新隐藏的 variant ID input
  - 启用/禁用加购按钮
  - 更新产品图片 URL
  - 更新数量选择器约束
    ↓
ProductGallery 监听事件:
  - 根据 variant.featured_media.id 查找对应图片
  - 切换到变体主图
    ↓
更新浏览器历史 (history.replaceState)
    ↓
✅ 页面实时更新，URL 同步！
```

### 加购流程

```
用户点击"Add to Cart"
    ↓
<button on:click="/handleClick">  [Horizon 声明式]
    ↓
AddToCart.handleClick() - 播放动画
    ↓
<form on:submit="/handleSubmit">  [表单提交]
    ↓
ProductForm.handleSubmit(event)
  - event.preventDefault()
  - 验证表单
  - 禁用按钮
    ↓
调用 /cart/add.js 并包含 sections 参数
    ↓
获取更新的购物车数据
    ↓
触发 CartAddEvent
    ↓
更新购物车数量显示
    ↓
显示"Added!"状态 + 飞行动画
    ↓
✅ 商品已加入购物车！
```

## 📋 组件清单

### 已实现 (Horizon 模式)

#### 🛒 购物车系统
- ✅ `Component` - 基础组件类
- ✅ `QuantitySelectorComponent` - 数量选择器（基础）
- ✅ `CartQuantitySelectorComponent` - 购物车数量选择器（特化）
- ✅ `CartItemsComponent` - 购物车项列表（Section Rendering）

#### 🛍️ 产品购买系统
- ✅ `AddToCartComponent` - 加购按钮组件（动画+飞行效果）
- ✅ `ProductFormComponent` - 产品表单组件（处理提交）
- ✅ `VariantSelectorComponent` - 变体选择器（Section Rendering）
- ✅ `ProductGalleryComponent` - 产品图库（响应变体切换）

### 待迁移
- ⏳ `CartDrawerComponent` - 需要更新为监听 theme:cart:update 和使用 ref 系统

## 🎨 Liquid Template 规范

### Quantity Input Snippet

```liquid
{% render 'quantity-input',
  id: 'Quantity-123',
  name: 'updates[123]',
  value: item.quantity,
  min: 0,
  max: item.variant.inventory_quantity,
  label: item.product.title,
  line_index: forloop.index0,  ← 购物车必需
  variant_id: item.variant.id,
  class: 'w-auto'
%}
```

### Cart Section 规范

```liquid
<cart-items-component
  class="cart-items-wrapper"
  data-section-id="{{ section.id }}"  ← 必需用于 Section Rendering
>
  {% for item in cart.items %}
    {%- assign line_index = forloop.index0 -%}
    <div ref="cartItemRows[]">  ← 使用 ref 数组
      <div ref="quantitySelectors[]">  ← 使用 ref 数组
        {% render 'quantity-input',
          line_index: line_index  ← 传递索引
        %}
      </div>
    </div>
  {% endfor %}
</cart-items-component>
```

## 🔍 调试

所有组件都包含详细的控制台日志：

```javascript
console.log('[CartItems] Update cart quantity:', { line, quantity });
console.log('[QuantitySelector] Button clicked');
```

可以在浏览器控制台过滤 `[CartItems]` 或 `[QuantitySelector]` 查看详细日志。

## 📚 参考资料

- Shopify Section Rendering API: https://shopify.dev/docs/api/ajax/reference/cart
- Web Components: https://developer.mozilla.org/en-US/docs/Web/API/Web_components
- Horizon Theme (参考实现)

---

**重要提示**: 本架构遵循 Horizon 主题的设计哲学，强调：
1. 声明式 > 命令式
2. 事件驱动 > 直接调用
3. Section Rendering > 手动 DOM 操作
4. Ref 系统 > querySelector 查找

