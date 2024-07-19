const { get } = require('../db/db');

async function getAllProducts() {
  try {
    const products = await get('/products');
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
