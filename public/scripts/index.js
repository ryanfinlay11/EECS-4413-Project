const accountButton = document.getElementById('accountButton');

const dropdownSort = document.getElementById('sorting-type');
const dropdownType = document.getElementById('equipment-type');

const gridContainer = document.getElementById('grid-container');

const itemModal = document.getElementById('item-modal');
const addToCartButton = document.getElementById('add-to-cart');

const accountModal = document.getElementById('account-modal');
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');

let items = [];
let filteredItems = [];

let selectedItem = null;

loadItems();
initalizeLogin();

// onclick functions

function showItemDetails(item) {
  const modalContent = document.getElementById('modal-item-info');
  
  modalContent.innerHTML = `
    <h2 id="modal-title">${item.name}</h2>
    <img src="${item.image}" alt="${item.name}" id="modal-image">
    <p id="modal-description">${item.description}</p>
    <p id="modal-price">$${item.price}</p>
    <p id="modal-quantity">Quantity Remaining: ${item.quantity}</p>
  `;

  itemModal.style.display = 'block';
}

async function login() {
  try {
    document.getElementById('loginButton').disabled = true;

    const data = await postRequest('login', {
      username: document.getElementById('login-username').value,
      password: document.getElementById('login-password').value
    });

    if (data) {
      if (!data.success) {
        alert(data.message);
      }
      else {
        hideModals();
        localStorage.setItem('user', JSON.stringify(data.message));
        initalizeLogin();
        alert("Login successful!");
      }
    }
    else {
      console.error("Error logging in");
    }

    document.getElementById('loginButton').disabled = false;
  }
  catch (error) {
    alert("Error logging in");
    console.error(error);
    document.getElementById('loginButton').disabled = false;
  }
}

async function register() {
  try {
    document.getElementById('registerButton').disabled = true;
    
    const data = await postRequest('register', {
      username: document.getElementById('register-username').value,
      password: document.getElementById('register-password').value,
      creditCard: document.getElementById('register-creditcard').value,
      address: document.getElementById('register-address').value
    });

    if (data) {
      if (!data.success) {
        alert(data.message);
      }
      else {
        hideModals();
        localStorage.setItem('user', JSON.stringify(data.message));
        initalizeLogin();
        alert("Registration successful!")
      }
    }
    else {
      alert("Error registering");
      console.error("Error registering");
    }

    document.getElementById('registerButton').disabled = false;
  }
  catch (error) {
    alert("Error registering");
    console.error(error);
    document.getElementById('registerButton').disabled = false;
  }
}

function showModal(type) {
  hideModals();
  if (type === 'account') accountModal.style.display = 'block';
  else if (type === 'login') loginModal.style.display = 'block';
  else if (type === 'register') registerModal.style.display = 'block';
}

function hideModals() {
  // hide all modals
  itemModal.style.display = 'none';
  accountModal.style.display = 'none';
  loginModal.style.display = 'none';
  registerModal.style.display = 'none';

  // clear input fields
  document.getElementById('login-username').value = '';
  document.getElementById('login-password').value = '';

  document.getElementById('register-username').value = '';
  document.getElementById('register-password').value = '';
  document.getElementById('register-creditcard').value = '';
  document.getElementById('register-address').value = '';
}

function addToCart() {
  console.log("added " + selectedItem.name + " to cart!");

  // add item to local storage
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // check if item is already in cart
  let added = false;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === selectedItem.id) {
    cart[i].occurance++;
    localStorage.setItem('cart', JSON.stringify(cart));
    added = true;
    }
  }

  if (!added) {
    selectedItem.occurance = 1;
    cart.push(selectedItem);
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  console.log("cart:", cart);

  addToCartButton.innerText = 'Added to Cart!';
  addToCartButton.style.backgroundColor = 'rgb(0, 145, 36)';
  addToCartButton.style.cursor = 'default';
  addToCartButton.disabled = true;

  setTimeout(() => {
    addToCartButton.innerText = 'Add to Cart';
    addToCartButton.style.backgroundColor = 'rgb(0, 110, 28)';
    addToCartButton.style.cursor = 'pointer';
    addToCartButton.disabled = false;
  }, 2000);
}

// Helper functions

function initalizeLogin() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user) {
    accountButton.innerText = "My Account"
    // make button href to "/account.html"
    accountButton.onclick = () => {
      window.location.href = "/account.html";
    }
  }
}

function simulateDelay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadItems() {
  console.log("Loading items");

  try {
    // await simulateDelay(100000);
    // send post request to get items
    const data = await postRequest('getAllProducts', {});

    if (data) {
      items = Object.keys(data).map(key => {
        return {
          id: key,
          ...data[key]
        };
      });

      // sort items alphabetically
      items.sort((a, b) => a.name.localeCompare(b.name));

      setGridItems(items);
    }
    else {
      console.error("Error getting items");
    }
  }
  catch (error) {
    console.error(error);
  }
  finally {
    document.getElementById('loading-image-container').style.display = 'none';
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
    console.error('Error getting items:', error);
  }
}

function setGridItems(items) {
  gridContainer.innerHTML = '';

  items.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('grid-item');
    
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.name;

    const nameDiv = document.createElement('div');
    nameDiv.classList.add('item-name');
    nameDiv.textContent = item.name;

    const priceDiv = document.createElement('div');
    priceDiv.classList.add('item-price');
    priceDiv.textContent = "$" + item.price;

    itemDiv.appendChild(img);
    itemDiv.appendChild(nameDiv);
    itemDiv.appendChild(priceDiv);

    itemDiv.onclick = () => {
      showItemDetails(item);
      selectedItem = item;
    }

    gridContainer.appendChild(itemDiv);
  });
}

function filterThenSort(equipmentType, sortingType) {
  if (equipmentType == "allEquipment") {
    filteredItems = items;
  }
  else {
    filteredItems = [];
    items.forEach(item => {
      if (item.equipmentType == equipmentType) {
        filteredItems.push(item);
      }
    });
  }

  if (sortingType == "sortAlphabetical") {
    filteredItems.sort((a, b) => a.name.localeCompare(b.name));
  }
  else if (sortingType == "sortLowToHigh") {
    filteredItems.sort((a, b) => a.price - b.price);
  }
  else if (sortingType == "sortHighToLow") {
    filteredItems.sort((a, b) => b.price - a.price);
  }

  setGridItems(filteredItems);
}

// Event listeners

dropdownSort.addEventListener('change', function() {
  filterThenSort(document.getElementById('equipment-type').value, dropdownSort.value);
});

dropdownType.addEventListener('change', function() {
  filterThenSort(dropdownType.value, document.getElementById('sorting-type').value);
});

window.onclick = function(event) {
  if (event.target == itemModal || event.target == accountModal || event.target == loginModal || event.target == registerModal) {
    itemModal.style.display = 'none';
    accountModal.style.display = 'none';
    loginModal.style.display = 'none';
    registerModal.style.display = 'none';
  }
}
