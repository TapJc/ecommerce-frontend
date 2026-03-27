import { cart } from "../data/cart.js";

function renderTrackingInfo() {
  const item = JSON.parse(sessionStorage.getItem("trackingItem"));

  cart.updateCartQuantity(".js-cart-quantity");
  let trackingInfoHTML = "";

  trackingInfoHTML += `
      <div class="order-tracking">
        <a class="back-to-orders-link link-primary" href="orders.html">
          View all orders
        </a>

        <div class="delivery-date">
          Arriving on ${item.arrivalDate}
        </div>

        <div class="product-info">
          ${item.product.name}
        </div>

        <div class="product-info">
          Quantity: ${item.quantity}
        </div>

        <img class="product-image" src="${item.product.image}">

        <div class="progress-labels-container">
          <div class="progress-label">
            Preparing
          </div>
          <div class="progress-label current-status">
            Shipped
          </div>
          <div class="progress-label">
            Delivered
          </div>
        </div>

        <div class="progress-bar-container">
          <div class="progress-bar"></div>
        </div>
      </div>`;

  document.querySelector(".js-order-tracking").innerHTML = trackingInfoHTML;
}

renderTrackingInfo();