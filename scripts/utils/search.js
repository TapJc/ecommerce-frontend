import { Product, Appliance, Clothing } from "../../data/products.js";

// Sets up the search bar and search button to trigger a search on Enter or click.
// Accepts a callback (onSearch) that is called with the search results and query.
export function setupSearch(onSearch) {
  document.querySelector(".js-search-bar").addEventListener("keydown", (e) => {
    if (e.key == "Enter") handleSearch(onSearch, e.target.value);
  });

  document.querySelector(".js-search-button").addEventListener("click", () => {
    handleSearch(onSearch, document.querySelector(".js-search-bar").value);
  });
}

// Validates the query and passes search results to the onSearch callback.
async function handleSearch(onSearch, query) {
  try {
    // If the search bar is empty or only contains whitespace,
    // pass an empty array to trigger the fallback to all products.
    if (query.trim().length === 0) {
      onSearch([], "");
      return;
    }

    const searchResults = await searchProducts(query);
    onSearch(searchResults, query);
  } catch (error) {
    console.error("Error handling search:", error);
    onSearch([], "");
  }
} 

// Fetches products from the backend matching the query and maps
// them into the appropriate product class instances.
export async function searchProducts(query) {
  try {
    const response = await fetch(`http://localhost:8080/api/products/search?query=${query}`);
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
    console.error("Error searching for products:", error);
    return [];
  }
}