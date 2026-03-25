import { getDeliveryOption } from "./deliveryOptions.js";

class Cart {
  cartItems = [];
  #localStorageKey;

  constructor(localStorageKey) {
    this.#localStorageKey = localStorageKey;

    this.#loadFromStorage();
  }

  #loadFromStorage() {
    this.cartItems =
      JSON.parse(localStorage.getItem(this.#localStorageKey)) || [];
  }
  #saveToStorage() {
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems));
  }
  updateQuantity(productId, newQuantity) {
    if (newQuantity > 0 && newQuantity < 1000) {
      this.cartItems.forEach((cartItem) => {
        if (productId == cartItem.productId) {
          cartItem.quantity = newQuantity;
        }
      });

      this.#saveToStorage();
    }
  }
  updateCartQuantity(className) {
    let cartQuantity = 0;

    this.cartItems.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });

    document.querySelector(className).innerHTML = cartQuantity;
  }
  addToCart(productId, quantity) {
    let matchingItem;

    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });

    if (matchingItem) {
      matchingItem.quantity += quantity;
    } else {
      this.cartItems.push({
        productId,
        quantity,
        deliveryOptionId: "1",
      });
    }

    this.#saveToStorage();
  }
  clearCart() {
    this.cartItems = [];
    this.#saveToStorage();
  }
  removeFromCart(productId) {
    const newCart = [];

    this.cartItems.forEach((cartItem) => {
      if (cartItem.productId != productId) {
        newCart.push(cartItem);
      }
    });

    this.cartItems = newCart;
    this.#saveToStorage();
  }
  updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem;

    const deliveryOption = getDeliveryOption(deliveryOptionId);
    if (deliveryOption) {
      this.cartItems.forEach((cartItem) => {
        if (productId === cartItem.productId) {
          matchingItem = cartItem;
        }
      });

      if (matchingItem) {
        matchingItem.deliveryOptionId = deliveryOptionId;
        this.#saveToStorage();
      }
    }
  }
}

export const cart = new Cart("cart-items");