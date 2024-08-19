async function salesHistory() {
  let content = "";
  try {
    const orders = await postRequest('getAllOrders', {});
    const items = orders.message;
    const itemKeys = Object.keys(items);

    for (let key of itemKeys) {
      let itemNames = "";
      for (let item of items[key].items) {
        itemNames += item.occurance + " " + item.name + "<br>";
      }

      content += `Username: ${items[key].username}<br>Credit Card: ${items[key].creditCard}<br>Address: ${items[key].address}
      <br>Total: $${items[key].total}<br>Items: ${itemNames}<br>`;
    }

  }
  catch (error) {
    content = 'No sales history available';
    console.error(`Error getting sales history: ${error}`);
  }


  document.getElementById("content").innerHTML = content;
}

async function inventoryEditing() {
  let content = "";
  try {
    const products = await postRequest('getAllProducts', {});
    const items = products;
    const itemKeys = Object.keys(products);

    for (let key of itemKeys) {
      content += `Name: ${items[key].name}<br>Equipment Type: ${items[key].equipmentType}
      <br>Price: $${items[key].price}<br>Quantity: ${items[key].quantity}
      <button class="edit" onclick="editQuantity(${items[key].itemID})">Edit Quantity</button><br><br>`
    }
  }
  catch (error) {
    content = 'No inventory available';
    console.error(`Error getting inventory: ${error}`);
  }

  document.getElementById("content").innerHTML = content;
}

function userAccounts() {
  document.getElementById("content").innerHTML = '<p>userAccounts</p>';
}

async function editQuantity(itemID) {
  const quantity = prompt("Enter new quantity for :" + itemID);
  if (quantity === null) {
    return;
  }
  /*

  try {
    await postRequest('editQuantity', { itemID, quantity });
    alert("Quantity updated");
  }
  catch (error) {
    console.error(`Error editing quantity: ${error}`);
    return alert("Error editing quantity");
  }*/
}

async function postRequest(functionName, body) {
  try {
    const response = await fetch('/api/' + functionName, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return data;
  } 
  catch (error) {
    console.error('Error: ', error);
  }
}