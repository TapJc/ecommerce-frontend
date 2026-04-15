export function closePopup() {
  document.querySelector(".js-popup-container").classList.remove("visible");
  document.querySelector(".js-overlay").classList.remove("visible");
}