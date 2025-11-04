/**
 * 购物车功能模块
 * 处理购物车的添加、更新和删除操作
 */

export function initCart() {
  // 购物车图标和数量
  const cartIcon = document.querySelector('[data-cart-icon]');
  const cartCount = document.querySelector('[data-cart-count]');
  
  // 购物车表单
  const cartForm = document.querySelector('[data-cart-form]');
  if (cartForm) {
    setupCartForm(cartForm);
  }
  
  // 监听添加到购物车事件
  document.addEventListener('submit', async (e) => {
    if (e.target.matches('[data-product-form]')) {
      e.preventDefault();
      await addToCart(e.target);
    }
  });
  
  // 监听移除商品事件
  document.addEventListener('click', async (e) => {
    const removeBtn = e.target.closest('[data-cart-remove]');
    if (removeBtn) {
      e.preventDefault();
      const itemKey = removeBtn.dataset.cartRemove;
      await removeFromCart(itemKey);
    }
  });
}

/**
 * 添加商品到购物车
 */
async function addToCart(form) {
  const formData = new FormData(form);
  
  try {
    const response = await fetch('/cart/add.js', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Failed to add to cart');
    }
    
    const item = await response.json();
    
    // 更新购物车数量
    await updateCartCount();
    
    // 显示成功消息
    showNotification('商品已添加到购物车');
    
    return item;
  } catch (error) {
    console.error('Add to cart error:', error);
    showNotification('添加失败，请重试', 'error');
  }
}

/**
 * 从购物车移除商品
 */
async function removeFromCart(itemKey) {
  try {
    const response = await fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: itemKey,
        quantity: 0
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to remove from cart');
    }
    
    // 重新加载页面以更新购物车
    window.location.reload();
  } catch (error) {
    console.error('Remove from cart error:', error);
    showNotification('删除失败，请重试', 'error');
  }
}

/**
 * 设置购物车表单
 */
function setupCartForm(form) {
  // 监听数量变化
  const quantityInputs = form.querySelectorAll('[data-quantity-input]');
  quantityInputs.forEach(input => {
    input.addEventListener('change', () => {
      // 自动提交表单更新
      form.querySelector('[name="update"]')?.click();
    });
  });
}

/**
 * 更新购物车数量显示
 */
async function updateCartCount() {
  try {
    const response = await fetch('/cart.js');
    const cart = await response.json();
    
    const cartCountElements = document.querySelectorAll('[data-cart-count]');
    cartCountElements.forEach(el => {
      el.textContent = cart.item_count;
    });
  } catch (error) {
    console.error('Update cart count error:', error);
  }
}

/**
 * 显示通知消息
 */
function showNotification(message, type = 'success') {
  // 简单的通知实现
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
    type === 'error' ? 'bg-red-600' : 'bg-green-600'
  } text-white`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

