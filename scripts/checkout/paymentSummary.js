import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { cart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption, calculateDeliveryDate } from "../../data/deliveryOptions.js";
import { renderCheckoutPage } from "../checkout.js";
import { formatCurrency } from "../utils/money.js";
import { closePopup } from "../utils/popup.js";

export async function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;
  let cartItemQuantity = 0;

  for (const cartItem of cart.cartItems) {
    const product = await getProduct(cartItem.productId);
    productPriceCents += product.priceCents * cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;

    cartItemQuantity += cartItem.quantity;
  }

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCents = totalBeforeTaxCents + taxCents;

  const paymentSummaryHTML = `
          <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (${cartItemQuantity}):</div>
            <div class="payment-summary-money">
            $${formatCurrency(productPriceCents)}
            </div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money js-shipping-price">
            $${formatCurrency(shippingPriceCents)}
            </div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">
            $${formatCurrency(totalBeforeTaxCents)}
            </div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">
            $${formatCurrency(taxCents)}
            </div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money js-total-price">
            $${formatCurrency(totalCents)}
            </div>
          </div>

          <button class="place-order-button button-primary js-place-order">
            Place your order
          </button>
  `;

  document.querySelector(".js-payment-summary").innerHTML = paymentSummaryHTML;

  const button = document.querySelector(".js-place-order");
  // diabled prevents orders when cart is empty
  button.disabled = cart.cartItems.length <= 0;

  button.addEventListener("click", async () => {
    // disabled prevents duplicate orders from multiple clicks during async operations
    button.disabled = true;
      try {
        const response = await fetch("http://localhost:8080/api/orders", {
          method: "POST",
          headers: {
          "Content-Type": "application/json" // Tell the server we're sending JSON
          },
          body: JSON.stringify({
            orderDate: dayjs().format("MMMM D, YYYY"),
            totalPrice: formatCurrency(totalCents)
          })
        });

        // response.ok is false for 4xx/5xx status codes which fetch won't throw on automatically
        if (!response.ok) throw new Error(`Order failed: ${response.status}`);

        const order = await response.json();

        // Place all order items in parallel — faster than sequential requests
        // If any single item fails, the entire order is aborted via the catch block
        await Promise.all(cart.cartItems.map(async (cartItem) => {
          const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
          const arrivalDate = calculateDeliveryDate(deliveryOption).format("MMMM D");

          const itemResponse = await fetch(`http://localhost:8080/api/orders/${order.id}/items?productId=${cartItem.productId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json" 
            },
            body: JSON.stringify({
              quantity: cartItem.quantity,
              arrivalDate: arrivalDate
            })
          });
          // Check each order item request individually inside Promise.all
          if (!itemResponse.ok) throw new Error(`Order item failed: ${itemResponse.status}`);
        }));

        document.querySelector(".js-popup-container").classList.add("visible");
        document.querySelector(".js-overlay").classList.add("visible");

        const popupMessage = document.querySelector(".js-popup-message");
        popupMessage.innerHTML = `Thanks for placing your order. Your order number is <strong>#${(order.id).slice(0,8)}</strong>.`;

        cart.clearCart();
      } catch (error) {
        console.error("Error placing order:", error);
        // Only re-enable the button if the order failed so the user can retry
        button.disabled = false;
      }
  });

  document.querySelector(".js-popup-button").addEventListener("click", () => {
    window.location.href = "orders.html";
  });

  document.querySelector(".js-close-popup-icon").addEventListener("click", () => {
    closePopup();
    renderCheckoutPage();
  });
  document.querySelector(".js-overlay").addEventListener("click", () => {
    closePopup();
    renderCheckoutPage();
  });
}
