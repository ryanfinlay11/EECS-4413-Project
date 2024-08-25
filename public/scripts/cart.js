let cart = [];

initialize();

// Helper functions

// Initialize cart page with cart data
function initialize() {
  if (localStorage.getItem('cart') === null || JSON.parse(localStorage.getItem('cart')).length === 0) {
    alert("Your cart is empty");
    window.location.href = '/';
  }
  else {
    cart = JSON.parse(localStorage.getItem('cart'));

    cart = cart.filter(item => item.occurance > 0);

    console.log(cart);
    
    const cartList = document.getElementById('tableBody');
    
    for (const item of cart) {
      cartList.innerHTML += `
        <tr>
            <td class="quantity">
              <input id="${item.itemID}quantity" class="quantity" type="number" value="${item.occurance}" min="0" max="99">
            </td>
            <td class="name">
              <img src="${item.image}" class="productImage">
              <p class="nameText">${item.name}</p>
            </td>
            <td id="${item.itemID}price" class="price">$${(item.price * item.occurance).toFixed(2)}</td>
          </tr>
      `;
    }

    updateCost();
  }
}

// Returns the item in the cart with the given ID
function getItemByID(id) {
  for (const item of cart) {
    if (item.itemID === id) {
      return item;
    }
  }
}

// Updates the cost of the cart when the quantity of an item is changed
function updateCost() {
  const subtotal = document.getElementById('subtotal');
  const hst = document.getElementById('hst');
  const total = document.getElementById('total');

  let subtotalCost = 0;

  for (let item of cart) {
    subtotalCost += item.price * item.occurance;
  }

  const hstCost = subtotalCost * 0.13;
  const totalCost = subtotalCost + hstCost;

  subtotal.innerHTML = `Subtotal: $${subtotalCost.toFixed(2)}`;
  hst.innerHTML = `HST: $${hstCost.toFixed(2)}`;
  total.innerHTML = `Total: <b>$${totalCost.toFixed(2)}</b>`;
  console.log("updated cost");
}

// Returns to the home page
function continueShopping() {
  let isEmpty = true;
  for (let item of cart) {
    if (item.occurance > 0) {
      isEmpty = false;
      break;
    }
  }

  if (isEmpty) {
    localStorage.setItem('cart', JSON.stringify([]));
  }
  else {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
}

// Opens the checkout modal
function openCheckoutModal() {
  for (let item of cart) {
    if (item.occurance < 0) {
      return alert("Quantity cannot be negative");
    }
    if (item.occurance > item.quantity) {
      return alert(`There are only ${item.quantity} of ${item.name} left in stock`);
    }
  }

  if (localStorage.getItem('user') === null) {
    alert("Please login or register before checking out");
    return window.location.href = '/';
  }

  document.getElementById('register-modal').style.display = 'block';

  const user = JSON.parse(localStorage.getItem('user'));

  document.getElementById('register-username').value = user.username;
  document.getElementById('register-creditcard').value = user.creditCard;
  document.getElementById('register-address').value = user.address;
  
  document.getElementById('total-cost').innerHTML = document.getElementById('total').innerHTML;
}

// Closes the checkout modal
function hideModal() {
  document.getElementById('register-modal').style.display = 'none';
}

// Submits the order
async function confirmOrder() {
  document.getElementById('registerButton').disabled = true;

  const info = {
    userID: JSON.parse(localStorage.getItem('user')).userID,
    username: document.getElementById('register-username').value,
    creditCard: document.getElementById('register-creditcard').value,
    address: document.getElementById('register-address').value,
    total: document.getElementById('total').innerHTML,
    items: cart
  };

  try {
    const data = await postRequest('checkout', info);

    if (data) {
      if (!data.success) {
        console.log("Failed");
        alert(data.message);
      }
      else {
        console.log("Success");
        alert(data.message);
        localStorage.setItem('cart', JSON.stringify([]));
        window.location.href = '/';
      }
    }
    else {
      alert("An error occurred");
      console.error("Error checking out");
    }

    document.getElementById('registerButton').disabled = false;
  }
  catch (error) {
    alert("An error occurred");
    console.error("Error checking out");
    document.getElementById('registerButton').disabled = false;
  }
}

// POST request helper function
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

// Event listener to detect when the quantity of an item is changed
document.addEventListener('input', function(event) {
  if (event.target.classList.contains('quantity')) {
    const itemID = event.target.id.replace('quantity', '');
    const price = document.getElementById(`${itemID}price`);
    const quantity = event.target.value;

    let item = getItemByID(itemID);
    item.occurance = parseInt(quantity);
    const cost = item.price;

    price.innerHTML = `$${(cost * quantity).toFixed(2)}`;

    updateCost();
    console.log(cart);
  }
});

window.addEventListener('pageshow', function(event) {
  if (event.persisted) {
    window.location.reload();
  }
});
