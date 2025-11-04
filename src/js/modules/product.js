/**
 * 产品表单模块
 * 处理产品变体选择和数量选择
 */

export function initProduct() {
  const productForms = document.querySelectorAll('[data-product-form]');
  
  productForms.forEach(form => {
    setupProductForm(form);
  });
}

/**
 * 设置产品表单
 */
function setupProductForm(form) {
  const variantSelects = form.querySelectorAll('select[name^="options"]');
  
  // 监听变体选择变化
  variantSelects.forEach(select => {
    select.addEventListener('change', () => {
      updateVariant(form);
    });
  });
  
  // 初始化变体
  updateVariant(form);
}

/**
 * 更新选中的变体
 */
function updateVariant(form) {
  // 获取所有选项值
  const options = Array.from(form.querySelectorAll('select[name^="options"]'))
    .map(select => select.value);
  
  // 这里简化处理，实际应该根据选项匹配正确的变体
  // 在完整实现中，需要从产品数据中找到匹配的变体
  const variantIdInput = form.querySelector('input[name="id"]');
  
  // 检查变体是否可用
  const submitButton = form.querySelector('button[type="submit"]');
  // 简化处理，实际需要检查变体库存
  if (submitButton && variantIdInput) {
    submitButton.disabled = !variantIdInput.value;
  }
}

/**
 * 获取产品数据（如果页面中嵌入了产品JSON）
 */
export function getProductData() {
  const productScript = document.querySelector('[data-product-json]');
  if (productScript) {
    try {
      return JSON.parse(productScript.textContent);
    } catch (error) {
      console.error('Error parsing product JSON:', error);
      return null;
    }
  }
  return null;
}

/**
 * Web Component 示例：产品卡片
 * 优先使用原生 JavaScript Web Component
 */
if (typeof customElements !== 'undefined') {
  class ProductCard extends HTMLElement {
    connectedCallback() {
      this.render();
      this.attachEventListeners();
    }
    
    render() {
      const productData = this.dataset.product;
      if (!productData) return;
      
      try {
        const product = JSON.parse(productData);
        // 渲染产品卡片内容
        // 实际实现中，这里应该使用 Liquid 模板生成 HTML
        // Web Component 主要用于交互逻辑
      } catch (error) {
        console.error('Error rendering product card:', error);
      }
    }
    
    attachEventListeners() {
      const addToCartBtn = this.querySelector('[data-add-to-cart]');
      if (addToCartBtn) {
        addToCartBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.handleAddToCart();
        });
      }
    }
    
    async handleAddToCart() {
      const productId = this.dataset.productId;
      const quantity = this.dataset.quantity || 1;
      
      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: productId,
            quantity: parseInt(quantity)
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to add to cart');
        }
        
        // 触发自定义事件
        this.dispatchEvent(new CustomEvent('product-added-to-cart', {
          bubbles: true,
          detail: { productId, quantity }
        }));
      } catch (error) {
        console.error('Add to cart error:', error);
      }
    }
  }
  
  // 注册自定义元素
  if (!customElements.get('product-card')) {
    customElements.define('product-card', ProductCard);
  }
}

