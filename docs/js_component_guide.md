# JavaScript & Web Component Guide

> **目标**：描述本主题中原生 JS 与 Web Components 的编写方式，确保与 Liquid、Tailwind、可访问性及性能策略一致。默认使用无框架原生模块，必要时通过 Vite 打包。

---

## 1. 项目结构

- 源文件位于 `src/js/`：
  - `main.js`：入口文件，注册 Web Components、初始化全局模块。
  - `modules/`：独立功能（滑块、折叠面板、表单处理）。
  - `components/`（可选）：Web Components 定义。
- 构建产物由 Vite 输出到 `assets/main.js`，在 `layout/theme.liquid` 中通过 `{{ 'main.js' | asset_url | script_tag }}` 载入。

---

## 2. 编写原则

1. **渐进增强**：所有关键内容先由 Liquid 渲染；JS 仅负责交互/优化。JS 不可阻塞 SEO 内容。
2. **模块化**：每个功能放在单独文件中，使用 `export` / `import`，避免全局变量。
3. **懒加载**：对重型功能（视频播放器、图表）使用 `import()` 或 `IntersectionObserver` 延迟加载。
4. **可访问性**：遵循 `docs/accessibility_playbook.md`；组件需监听 `prefers-reduced-motion`、键盘交互、焦点管理。
5. **性能**：避免频繁 DOM 重排；使用 `requestAnimationFrame`/`requestIdleCallback`；必要时缓存计算结果。

---

## 3. Web Component 模板

```js
// src/js/components/countdown-timer.js
export class CountdownTimer extends HTMLElement {
  static get observedAttributes() {
    return ['data-deadline'];
  }

  connectedCallback() {
    this.deadline = new Date(this.getAttribute('data-deadline'));
    this.render();
    this.start();
  }

  disconnectedCallback() {
    cancelAnimationFrame(this.raf);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'data-deadline') {
      this.deadline = new Date(newValue);
      this.render();
    }
  }

  start() {
    const tick = () => {
      this.update();
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  update() {
    const remaining = Math.max(this.deadline - Date.now(), 0);
    this.dataset.minutes = Math.floor(remaining / 60000);
    // ...
  }

  render() {
    // 使用 shadow DOM 或直接 innerHTML
  }
}

customElements.define('countdown-timer', CountdownTimer);
```

- 每个组件负责自己的样式（使用 CSS 变量或 `@apply` 类），避免硬编码颜色/字体。
- 在 Liquid 中使用 `<countdown-timer data-deadline="{{ block.settings.deadline }}"></countdown-timer>`。

---

## 4. 与 Liquid 协作

- 使用 `data-section-id`, `data-section-type` 标记 Section 根节点，JS 在 `document.querySelectorAll('[data-section-type="hero"]')` 中初始化。
- `shopify:section:load` / `shopify:section:unload` 事件：在 Theme Editor 中热重载时，记得销毁并重建组件。
- `data-*` 传参：通过 `{{ some_value | json }}` 注入复杂数据，避免 XSS。
- Ajax 与 API：
  - 购物车：使用 [Cart AJAX API](https://shopify.dev/docs/api/ajax/reference/cart) 与 Fetch。
  - Section Rendering：`fetch('/?sections=section-id')` 获取更新片段。

---

## 5. 交互模式

| 模式 | 建议 |
| --- | --- |
| 表单处理 | 使用 `FormData` + Fetch，错误提示写入 DOM 并加 `aria-live`. |
| 动效 | 默认 `duration-200 ease-out`；检测 `matchMedia('(prefers-reduced-motion: reduce)')`，必要时禁用动画。 |
| 状态同步 | 在组件中使用自定义事件（`this.dispatchEvent(new CustomEvent('cart:updated', { bubbles: true })`）让其他模块监听。 |
| 错误处理 | 总是捕获 `try/catch`，并在 UI 显示 fallback（toast/alert）。 |

---

## 6. QA 清单

1. [ ] 组件以渐进增强方式实现；无 JS 时内容仍可用。
2. [ ] 文件模块化，未污染全局作用域。
3. [ ] 考虑 `shopify:section:load`/`unload`，能在 Theme Editor 中正常热更新。
4. [ ] 处理 `prefers-reduced-motion`、键盘导航、焦点管理。
5. [ ] 与 Liquid 数据交互安全，使用 `data-*` + `| json`.
6. [ ] Ajax 请求有错误处理与用户提示。
7. [ ] 性能友好：惰性加载、少量 DOM 更新、合适的节流/防抖。

遵循此指南即可在保持 Shopify 主题轻量、可维护的同时提供丰富交互，并与其他文档（设计、SEO、可访问性）保持一致。 
