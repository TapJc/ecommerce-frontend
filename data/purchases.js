class Orders {
  id;
  orderDate;
  totalPrice;
  orderItems;

  constructor(orderDetails) {
    this.id = orderDetails.id;
    this.orderDate = orderDetails.orderDate;
    this.totalPrice = orderDetails.totalPrice;
    this.orderItems = orderDetails.orderItems;
  }
}

export async function fetchOrders() {
  try {
    const response = await fetch("http://localhost:8080/api/orders");
    const data = await response.json();
    
    return data.map(orderDetails => new Orders(orderDetails));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}