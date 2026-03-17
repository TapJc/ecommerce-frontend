import { cart } from "../data/cart-class.js";
import { fetchProducts } from "../data/products.js";

// Keep track of the active timeout ID between multiple “Add to Cart” clicks.
let setTimeoutIds = {};

// Shows the "Added" confirmation message for 2 seconds.
// Resets the timer if the button is clicked again before it disappears.
function showAddedMessage(productId) {
  const addedMessage = document.querySelector(`.js-added-to-cart-${productId}`);
  addedMessage.classList.add("show-added-to-cart");

  clearTimeout(setTimeoutIds[productId]);

  setTimeoutIds[productId] = setTimeout(() => {
    addedMessage.classList.remove("show-added-to-cart");
  }, 2000);
}

async function renderProducts() {
  const products = await fetchProducts();

  cart.updateCartQuantity(".js-cart-quantity");

  let productHTML = "";

  products.forEach((product) => {
    productHTML += ` 
          <div class="product-container">
            <div class="product-image-container">
              <img class="product-image"
                src="${product.image}">
            </div>

            <div class="product-name limit-text-to-2-lines">
              ${product.name}
            </div>
           
            <div class="product-rating-container">
              <img class="product-rating-stars"
                src="${product.getStarsURL()}">
              <div class="product-rating-count link-primary">
                ${product.ratingCount}
              </div>
            </div>

            <div class="product-price">
              ${product.getPrice()}
            </div>

            <div class="product-quantity-container">
              <select class="js-quantity-selector-${product.id}">
                <option selected value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </div>

            ${product.extraInfoHTML()}

            <div class="product-spacer"></div>

            <div class="added-to-cart js-added-to-cart-${product.id}">
              <img src="images/icons/checkmark.png">
              Added to Cart
            </div>

            <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id = "${
              product.id
            }">
              Add to Cart
            </button>
          </div>`;
  });

  document.querySelector(".js-products-grid").innerHTML = productHTML;

  // On "Add to Cart" click, add the product and quantity to the cart,
  // show the "Added" message, and update the navbar cart quantity.
  document.querySelectorAll(".js-add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const { productId } = button.dataset;
      const quantity = Number(
        document.querySelector(`.js-quantity-selector-${productId}`).value
      );

      cart.addToCart(productId, quantity);
      showAddedMessage(productId);
      cart.updateCartQuantity(".js-cart-quantity");
    });
  });
}

renderProducts();