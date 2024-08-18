const { get } = require('../db/db');

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

module.exports = {
  getAllProducts
};
