import { cart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import {
  deliveryOptions,
  getDeliveryOption,
  calculateDeliveryDate,
} from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import { renderCheckoutHeader } from "./checkoutHeader.js";

export async function renderOrderSummary() {
  let cartSummaryHTML = "";

  for (const cartItem of cart.cartItems) {
    const productId = cartItem.productId;

    const matchingProduct = await getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const dateString = calculateDeliveryDate(deliveryOption);

    cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: ${dateString}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name js-product-name-${matchingProduct.id}">
            ${matchingProduct.name}
          </div>
          <div class="product-price js-product-price-${matchingProduct.id}">
            ${matchingProduct.getPrice()}
          </div>
          <div class="product-quantity js-product-quantity-${matchingProduct.id}">
            <span>
              Quantity: <span class="quantity-label">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id="${matchingProduct.id}">
              Update
            </span>
            <input class="quantity-input js-quantity-input-${matchingProduct.id}">
            <span class="save-quantity-link link-primary js-save-quantity-link" data-product-id="${matchingProduct.id}">
              Save
            </span>
            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${deliveryOptionsHTML(matchingProduct, cartItem)}
        </div>
      </div>
    </div>
    `;
  }

  // Builds the HTML for all delivery options for a specific cart item, marking the currently selected option
  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = "";

    deliveryOptions.forEach((deliveryOption) => {
      const dateString = calculateDeliveryDate(deliveryOption);
      const priceString =
        deliveryOption.priceCents === 0
          ? `FREE Shipping`
          : `${formatCurrency(deliveryOption.priceCents)} - Shipping`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
      <div class="delivery-option js-delivery-option" 
      data-product-id="${matchingProduct.id}" 
      data-delivery-option-id="${deliveryOption.id}">
            <input type="radio"
              ${isChecked ? "checked" : ""}
              class="delivery-option-input 
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                ${dateString}
              </div>
              <div class="delivery-option-price">
                ${priceString}
              </div>
            </div>
          </div>
      `;
    });

    return html;
  }

  document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

  // Shows the quantity input box for the specific cart item when "Update" is clicked
  document.querySelectorAll(".js-update-quantity-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );

      container.classList.add("is-editing-quantity");
    });
  });

  // Saves the new quantity, re-renders the page, and resets the input box when "Save" is clicked
  document.querySelectorAll(".js-save-quantity-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;

      const quantityInput = Number(
        document.querySelector(`.js-quantity-input-${productId}`).value
      );

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );

      cart.updateQuantity(productId, quantityInput);

      renderCheckoutHeader();
      renderOrderSummary();
      renderPaymentSummary();

      document.querySelector(`.js-quantity-input-${productId}`).value = "";
      container.classList.remove("is-editing-quantity");
    });
  });

  // Removes the cart item from the cart and the page when "Delete" is clicked
  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      cart.removeFromCart(productId);

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.remove();

      renderCheckoutHeader();
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  // Updates the delivery option for the cart item and re-renders the page when a delivery option is clicked
  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;
      cart.updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}
