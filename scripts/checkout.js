import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { renderCheckoutHeader } from "./checkout/checkoutHeader.js";

export function renderCheckoutPage() {
	renderCheckoutHeader();
	renderOrderSummary();
	renderPaymentSummary();
};

renderCheckoutPage();