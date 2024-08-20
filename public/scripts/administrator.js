window.onload = function() {
  if (localStorage.getItem('user') === null || !JSON.parse(localStorage.getItem('user')).isAdmin) {
    alert("You must be logged in as an administrator to access this page");
    return window.location.href = '/';
  }
}

async function salesHistory() {
  let content = "";
  try {
    const orders = await postRequest('getAllOrders', {});
    const items = orders.message;
    const itemKeys = Object.keys(items);

    for (let key of itemKeys) {
      let itemNames = "";
      for (let item of items[key].items) {
        itemNames += item.occurance + "x " + item.name + "<br>";
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
      <button class="edit" onclick="editQuantity('${items[key].itemID}')">Edit Quantity</button><br><br>`
    }

    content += `<button class="add" onclick="addProduct()">Add Product</button><br>`;
  }
  catch (error) {
    content = 'No inventory available';
    console.error(`Error getting inventory: ${error}`);
  }

  document.getElementById("content").innerHTML = content;
}

async function userAccounts() {
  let content = "";
  try {
    const usersResponse = await postRequest('getAllUsers', {});
    const users = usersResponse.message;
    const userKeys = Object.keys(users);

    for (let key of userKeys) {
      content += `Username: ${users[key].username}<br>Password: ${users[key].password}
      <br>Credit Card: ${users[key].creditCard}<br>Address: ${users[key].address}
      <br>Admin: ${users[key].isAdmin}
      <button class="edit" onclick="editUser('${users[key].username}')">Edit User</button><br><br>`
    }
  }
  catch (error) {
    content = 'No users available';
    console.error(`Error getting users: ${error}`);
  }

  document.getElementById("content").innerHTML = content;
}

async function editQuantity(itemID) {
  const quantity = prompt("Enter the new quantity");
  if (quantity === null) {
    return;
  }
  else if (quantity < 0) {
    return alert("Quantity cannot be negative");
  }

  try {
    const data = await postRequest('editQuantity', { itemID, quantity });

    if (data) {
      alert("Quantity successfully updated");
      return inventoryEditing();
    }
    else {
      return alert("Error editing quantity");
    }
  }
  catch (error) {
    console.error(`Error editing quantity: ${error}`);
    return alert("Error editing quantity");
  }
}

async function addProduct() {
  function promptForInput(message, validationFn) {
    const input = prompt(message);
    if (validationFn(input)) {
      return input;
    }
    return promptForInput(message, validationFn);
  }

  const name = promptForInput("Enter the name of the product", input => input !== null);

  const equipmentType = promptForInput(
    'Enter the equipment type ("goalie" or "player")',
    input => input !== null && (input === "goalie" || input === "player")
  );

  const price = promptForInput("Enter the price", input => input !== null && !isNaN(input) && input >= 0);

  const quantity = promptForInput("Enter the quantity", input => input !== null && !isNaN(input) && input >= 0);

  const image = promptForInput("Enter the image URL", input => input !== null);

  const description = promptForInput("Enter the description", input => input !== null);

  try {
    const data = await postRequest('addProduct', { name, equipmentType, price, quantity, image, description });

    if (data) {
      alert("Product successfully added");
      return inventoryEditing();
    }
    else {
      return alert("Error adding product");
    }
  }
  catch (error) {
    console.error(`Error adding product: ${error}`);
    return alert("Error adding product");
  }
}

async function editUser(username) {
  const changeType = prompt('Enter the field you would like to change ("password", "credit card", "address", or "admin")');
  if (changeType === null) return alert("No field entered");
  if (changeType !== "password" && changeType !== "credit card" && changeType !== "address" && changeType !== "admin") return alert("Invalid field entered");

  let newValue = "";
  if (changeType == "password") {
    newValue = prompt("Enter the new password");
  }

  if (changeType == "credit card") {
    newValue = prompt("Enter the new credit card");
    if (!newCreditCard.match(/^\d{4}-\d{4}-\d{4}-\d{4}$/)) return alert("Credit card number must be in the format: XXXX-XXXX-XXXX-XXXX");
  }

  if (changeType == "address") {
    newValue = prompt("Enter the new address");
  }
  if (changeType == "admin") {
    newValue = prompt('Enter the new admin status ("true" or "false")');
    if (newValue !== "true" && newValue !== "false") return alert("Invalid value entered");
  }

  if (newValue === null) return alert("No value entered");

  try {
    const data = await postRequest('updateAccountAttribute', { username, changeType, newValue });

    console.log(data);

    if (data) {
      alert("Account updated");
      return userAccounts();
    }
    else {
      return alert("Error editing user");
    }
  }
  catch (error) {
    console.error(`Error editing user: ${error}`);
    return alert("Error editing user");
  }

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