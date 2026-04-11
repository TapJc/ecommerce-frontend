# E-Commerce Frontend
---
The frontend is a multi-page, dynamic web application built with vanilla JavaScript, HTML, and CSS, featuring a homepage with a real-time search bar for filtering products, a checkout page with live cart management, an orders page for viewing purchase history, and a dedicated tracking page for individual order items. UI interactivity is driven by DOM manipulation with instant visual feedback on cart actions.

💻 **Technologies**
---
- JavaScript
- HTML
- CSS
- DOM manipulation
- localstorage
- JSON serialization

📑 **Features**
---
- Product Catalog: Fetches and displays all products from the backend in an Amazon-style grid on the homepage.
- Cart Management: Each product has an add to cart button with a quantity selector; once in the cart, items can have their quantity updated or be removed entirely from the checkout page.
- Cart Persistence: Cart state is saved to localStorage, preserving it across page sessions.
- Order Placement: Confirming a purchase sends POST requests to create an Order and its associated OrderItems in the backend.
- Order History: The orders page fetches and displays all past orders, with each item offering a buy again button to re-add it to the cart or a track package button to navigate to its tracking page.
- Delivery Status: The tracking page displays real-time delivery information for individual order items.
- Product Search: A search bar on every page except checkout dynamically filters and displays matching products without a page reload.

🏃‍♂️ **Running the Project**
--- 
1. Clone both the frontend and backend repositories to your local machine.
2. Ensure you have Java JDK (17 or higher recommended) installed on your machine.
3. In the terminal, navigate to the backend repository root and run `./mvnw spring-boot:run`
4. Once the backend is running, open the frontend repository in VS Code and launch it using the Live Server extension. Right-click the amazon.html file and select Open with Live Server. 
5. The application should now be fully functional in your browser, with the frontend communicating with the Spring Boot backend at `http://localhost:8080/h2-console` or the address shown in your terminal.

🤖 **Backend Repository:**  
---
👉 [E-Commerce Backend](https://github.com/TapJc/ecommerce-backend)
