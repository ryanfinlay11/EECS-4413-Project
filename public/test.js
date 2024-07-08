function login() {
    const gridContainer = document.getElementById('grid-container');

    // get rand num 1 or 2
    let randNum = Math.floor(Math.random() * 2) + 1;

    let item;
    if (randNum === 1) {
        item = {name: 'really very long item name lmao how would this work', price: "$100.00", imageUrl: 'https://www.sourceforsports.ca/cdn/shop/products/ea3fdc176f0f35fde1a1e3d5dd22fe0a_500x500_crop_center.jpg?v=1684145958'};
    } else {
        item = {name: 'even longer item name lmao, how will this work with the long images?', price: "$190.00", imageUrl: 'https://www.cjonline.com/gcdn/authoring/2018/08/03/NTCJ/ghows-KS-728b9292-697f-0a11-e053-0100007f85c2-1eeef60f.jpeg'};
    }    

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('grid-item');
    
    const img = document.createElement('img');
    img.src = item.imageUrl;
    img.alt = item.name;

    const nameDiv = document.createElement('div');
    nameDiv.classList.add('item-name');
    nameDiv.textContent = item.name;

    const priceDiv = document.createElement('div');
    priceDiv.classList.add('item-price');
    priceDiv.textContent = item.price;

    itemDiv.appendChild(img);
    itemDiv.appendChild(nameDiv);
    itemDiv.appendChild(priceDiv);

    gridContainer.appendChild(itemDiv);
}

function cart() {
    const gridContainer = document.getElementById('grid-container');
    // clear all items in the grid
    gridContainer.innerHTML = '';
}

function showItemDetails(item) {
    const modal = document.getElementById('item-modal');
    const modalContent = document.getElementById('modal-item-info');
    const span = document.getElementsByClassName('close')[0];
    const addToCartButton = document.getElementById('add-to-cart');

    item = {name: 'really very long item name lmao how would this work', price: "$100.00", imageUrl: 'https://media.istockphoto.com/id/1172427455/photo/beautiful-sunset-over-the-tropical-sea.jpg?s=612x612&w=0&k=20&c=i3R3cbE94hdu6PRWT7cQBStY_wknVzl2pFCjQppzTBg='};
    currentItem = item;
    
    modalContent.innerHTML = `
      <h2 id="modal-title">${item.name}</h2>
      <img src="${item.imageUrl}" alt="${item.name}" id="modal-image">
      <p id="modal-description">Very W and poggers item right here folksVery W and poggers item right here folksVery W and poggers item right here folksVery W and poggers item right here folksVery W and poggers item right here folksVery W and poggers item right here folksVery W and poggers item right here folksVery W and poggers item right here folksVery W and poggers item right here folksVery W and poggers item right here folksVery W and poggers item right here folksVery W and poggers item right here folksVery W and poggers item right here folks</p>
      <p id="modal-price">${item.price}</p>
      <p id="modal-quantity">Quantity Remaining: x</p>
    `;
    modal.style.display = 'block';
  }
  /*
  const modal = document.getElementById('item-modal');
  const modalContent = document.getElementById('modal-item-info');
  const span = document.getElementsByClassName('close')[0];
  const addToCartButton = document.getElementById('add-to-cart');
  
  span.onclick = function() {
    modal.style.display = 'none';
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  }

  addToCartButton.onclick = function() {
    alert(`Added ${currentItem.name} to cart!`);
    modal.style.display = 'none';
  }
    */

function hideModal() {
    const modal = document.getElementById('item-modal');
    modal.style.display = 'none';
}

function addToCart() {
  const button = document.getElementById('add-to-cart');
  console.log("here");
  button.innerText = 'Added to Cart!';
  button.style.backgroundColor = 'rgb(0, 145, 36)';
  button.style.cursor = 'default';
  button.disabled = true;
  setTimeout(() => {
    button.innerText = 'Add to Cart';
    button.style.backgroundColor = 'rgb(0, 110, 28)';
    button.style.cursor = 'pointer';
    button.disabled = false;
  }, 2000);
}
