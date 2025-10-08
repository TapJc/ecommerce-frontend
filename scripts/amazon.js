import { cart } from "../data/cart-class.js";
import { fetchProducts } from "../data/products.js";

// Keep track of the active timeout ID between multiple “Add to Cart” clicks.
let setTimeoutId;

function showAddedMessage(productId, currentTimeoutId) {
  const addedMessage = document.querySelector(`.js-added-to-cart-${productId}`);
  addedMessage.classList.add("show-added-to-cart");

  clearTimeout(currentTimeoutId);

  currentTimeoutId = setTimeout(() => {
    addedMessage.classList.remove("show-added-to-cart");
  }, 2000);

  return currentTimeoutId;
}

// Main async function to render products
async function renderProducts() {
  const products = await fetchProducts();

  // Update car quantity initially
  cart.updateCartQuantity(".js-cart-quantity");

  // Build HTML
  let productHTML = "";

  products.forEach((product) => {
    //console.log(product.constructor.name, product.rating);
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
              Added
            </div>

            <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id = "${
              product.id
            }">
              Add to Cart
            </button>
          </div>`;
  });

  document.querySelector(".js-products-grid").innerHTML = productHTML;

  document.querySelectorAll(".js-add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const { productId } = button.dataset;
      const quantity = Number(
        document.querySelector(`.js-quantity-selector-${productId}`).value
      );

      cart.addToCart(productId, quantity);
      setTimeoutId = showAddedMessage(productId, setTimeoutId);
      cart.updateCartQuantity(".js-cart-quantity");
    });
  });
}

// Call the function
renderProducts();
