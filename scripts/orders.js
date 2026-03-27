import { fetchOrders } from "../data/purchases.js";
import { cart } from "../data/cart.js";

let setTimeOutIds = {};

function showAddedMessage(productId, orderId) {
  const addedMessage = document.querySelector(`.js-bought-product-${orderId}-${productId}`);
  console.log("adding msg");
  addedMessage.classList.add("show-bought-product");

  clearTimeout(setTimeOutIds[productId]);

  setTimeOutIds[productId] = setTimeout(() => {
    console.log("removing msg");
    addedMessage.classList.remove("show-bought-product");
  }, 2000)
}

async function renderOrders() {
  const orders = await fetchOrders();
  
  cart.updateCartQuantity(".js-cart-quantity");

  let orderHTML = "";
  orders.forEach(order => {
    orderHTML += `
          <div class="order-container">
          
            <div class="order-header">
              <div class="order-header-left-section">
                <div class="order-date">
                  <div class="order-header-label">Order Placed:</div>
                  <div>${order.orderDate}</div>
                </div>
                <div class="order-total">
                  <div class="order-header-label">Total:</div>
                  <div>$${order.totalPrice}</div>
                </div>
              </div>

              <div class="order-header-right-section">
                <div class="order-header-label">Order ID:</div>
                <div>${order.id}</div>
              </div>
            </div>

            <div class="order-details-grid">
              ${orderDetailsHTML(order.orderItems, order.id)}
            </div>
          </div>`;
    });

  function orderDetailsHTML(orderItems, orderId) {
    let orderDetailsHTML = "";
    
    orderItems.forEach(item => {
        orderDetailsHTML += `
            <div class="product-image-container">
              <img src="${item.product.image}">
            </div>

            <div class="product-details">
              <div class="product-name">
                ${item.product.name}
              </div>
              <div class="product-delivery-date">
                Arriving on: ${item.arrivalDate}
              </div>
              <div class="product-quantity">
                Quantity: ${item.quantity}
              </div>

              <div class="product-purchased">
                <button class="buy-again-button button-primary js-buy-again" data-product-id="${item.product.id}" data-order-id="${orderId}">
                  <img class="buy-again-icon" src="images/icons/buy-again.png">
                  <span class="buy-again-message">Buy it again</span>
                </button>
                <div class="bought-product js-bought-product-${orderId}-${item.product.id}">
                  <img src="images/icons/checkmark.png">
                  Added to Cart
                </div>
              </div>
            </div>

            <div class="product-actions">
              <a href="tracking.html">
                <button class="track-package-button button-secondary js-track-package" data-item-info='${JSON.stringify(item)}'>
                Track package
                </button>
              </a>
            </div>`;
    })
    return orderDetailsHTML;
  }

  document.querySelector(".js-orders-grid").innerHTML = orderHTML;

  document.querySelectorAll(".js-track-package").forEach(button => {
    button.addEventListener("click", () => {
      // Store item info in sessionStorage so it survives the page navigation
      sessionStorage.setItem("trackingItem", button.dataset.itemInfo);
    })
  });

  document.querySelectorAll(".js-buy-again").forEach(button => {
    button.addEventListener("click", () => {
      const { productId, orderId } = button.dataset;

      cart.addToCart(productId, 1);
      showAddedMessage(productId, orderId);
      cart.updateCartQuantity(".js-cart-quantity");
    })
  })
}

renderOrders();