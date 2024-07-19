let cart = [];

initialize();

// Helper functions

function initialize() {
  if (localStorage.getItem('cart') === null) {
    alert("Your cart is empty");
    window.location.href = '/';
  }
  else {
    cart = JSON.parse(localStorage.getItem('cart'));

    cart = addQuantities(cart);

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
  }
}

function addQuantities(cart) {
  for (let item of cart) {
    item['occurance'] = findOccurance(item, cart);
  }

  return removeDuplicates(cart);
}

function findOccurance(item, cart) {
  let occurance = 0;
  
  for (const cartItem of cart) {
    if (cartItem.id === item.id) {
      occurance++;
    }
  }
  
  return occurance;
}

function removeDuplicates(cart) {
  let uniqueItems = [];
  
  for (const item of cart) {
    if (!uniqueItems.some(i => i.id === item.id)) {
      uniqueItems.push(item);
    }
  }
  
  return uniqueItems;
}

function getItemByID(id) {
  for (const item of cart) {
    if (item.itemID === id) {
      return item;
    }
  }
}

function updateCost() {

}

// Event listener to detect when the quantity of an item is changed
document.addEventListener('input', function(event) {
  if (event.target.classList.contains('quantity')) {
    const itemID = event.target.id.replace('quantity', '');
    const price = document.getElementById(`${itemID}price`);
    const quantity = event.target.value;

    let item = getItemByID(itemID);
    item.occurance = quantity;
    const cost = item.price;

    price.innerHTML = `$${(cost * quantity).toFixed(2)}`;

    updateCost();
  }
});

window.addEventListener('pageshow', function(event) {
  if (event.persisted) {
    window.location.reload();
  }
});