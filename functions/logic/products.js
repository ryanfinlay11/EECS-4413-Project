const { get, update } = require('../db/db');

const crypto = require("crypto");

// Returns all products
async function getAllProducts() {
  try {
    const products = await get('/products');

    // Remove products whose quantity is <= 0
    for (let product in products) {
      if (products[product].quantity <= 0) {
        delete products[product];
      }
    }

    return products;
  }
  catch (error) {
    console.error(`Error getting products: ${error}`);
    return JSON.stringify({ error: 'Error getting products' });
  }
}

// Edits the quantity of a product
async function editQuantity(item) {
  try {
    await update('/products/' + item.itemID, { "quantity": parseInt(item.quantity)} );
    return JSON.stringify({ success: true, message: "Quantity updated" });
  }
  catch (error) {
    console.error(`Error editing quantity: ${error}`);
    return JSON.stringify({ error: 'Error editing quantity' });
  }
}

// Adds a product
async function addProduct(product) {
  try {
    const newProduct = {
      itemID: crypto.randomUUID(),
      name: product.name,
      equipmentType: product.equipmentType,
      description: product.description,
      image: product.image,
      price: parseFloat(product.price),
      quantity: parseInt(product.quantity)
    }
    await update('/products/' + newProduct.itemID, newProduct);
    return JSON.stringify({ success: true, message: "Product added" });
  }
  catch (error) {
    console.error(`Error adding product: ${error}`);
    return JSON.stringify({ error: 'Error adding product' });
  }
}

module.exports = {
  getAllProducts,
  editQuantity,
  addProduct
};
