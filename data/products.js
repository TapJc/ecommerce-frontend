import { formatCurrency } from "../scripts/utils/money.js";
export class Product {
  id;
  image;
  name;
  stars;
  ratingCount;
  priceCents;

  constructor(productDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.stars = productDetails.stars;
    this.ratingCount = productDetails.ratingCount;
    this.priceCents = productDetails.priceCents;
  }

  getStarsURL() {
    return `images/ratings/rating-${this.stars * 10}.png`;
  }

  getPrice() {
    return `$${formatCurrency(this.priceCents)}`;
  }

  extraInfoHTML() {
    return ``;
  }
}

export class Clothing extends Product {
  sizeChartLink;

  constructor(productDetails) {
    super(productDetails);
    this.sizeChartLink = productDetails.sizeChartLink;
  }

  extraInfoHTML() {
    return `
      <a href="${this.sizeChartLink}" target="_blank">
      Size Chart
      </a>
    `;
  }
}

export class Appliance extends Product {
  instructionsLink;
  warrantyLink;

  constructor(productDetails) {
    super(productDetails);
    this.instructionsLink = productDetails.instructionsLink;
    this.warrantyLink = productDetails.warrantyLink;
  }

  extraInfoHTML() {
    return `
      <a href="${this.instructionsLink}" target="_blank">
      Instructions
      </a>
      <a href="${this.warrantyLink}" target="_blank">
      Warranty
      </a>
    `;
  }
}

export async function fetchProducts() {
  try {
    const response = await fetch("http://localhost:8080/api/products");
    const data = await response.json();

    return data.map((productDetails) => {
      if (productDetails.type === "clothing") {
        return new Clothing(productDetails);
      } else if (productDetails.type === "appliance") {
        return new Appliance(productDetails);
      } else {
        return new Product(productDetails);
      }
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// Get single product by id
export async function getProduct(productId) {
  try {
    const response = await fetch(`http://localhost:8080/api/products/${productId}`)
    const data = await response.json();
    
    if (data.type === "clothing") {
      return new Clothing(data);
    } else if (data.type === "appliance") {
      return new Appliance(data);
    } else {
      return new Product(data);
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    return [];
  }
}
