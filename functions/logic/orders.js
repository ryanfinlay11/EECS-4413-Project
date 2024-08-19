const { get, update } = require('../db/db');

const crypto = require("crypto");

async function createOrder(orderInfo) {
  try {
    if (!orderInfo.address || !orderInfo.creditCard) {
      return { success: false, message: 'Not all fields complete' };
    }
    else if (!orderInfo.creditCard.match(/^\d{4}-\d{4}-\d{4}-\d{4}$/)) {
      return { success: false, message: 'Credit card number must be in the format: XXXX-XXXX-XXXX-XXXX' };
    }

    const order = {
      orderID: crypto.randomUUID(),
      userID: orderInfo.userID,
      creditCard: orderInfo.creditCard,
      address: orderInfo.address,
      total: orderInfo.total.match(/\$([0-9,.]+)/)[1],
      items: orderInfo.items
    }

    await update('/orders/' + order.orderID, order);

    // decrement stock
    order.items.forEach(async item => {
      const product = await get('/products/' + item.id);
      product.quantity -= item.occurance;
      await update('/products/' + item.id, product);
    }
    );

    let itemNames = "";
    for (let item of order.items) {
      itemNames += item.occurance + "x " + item.name + "\n";
    }

    const successMessage = "Order confirmed. Thank you for shopping with us!\n\n" + itemNames + "\nTotal: $" + order.total;

    return { success: true, message: successMessage };
  }
  catch (error) {
    console.error(`Error ordering: ${error}`);
    return JSON.stringify({ error: 'Error ordering' });
  }
}

module.exports = {
  createOrder
};
