const username = document.getElementById('username');
const password = document.getElementById('password');
const creditCard = document.getElementById('cc');
const address = document.getElementById('address');

initialize();

// onclick functions

// Update account information
async function updateAccount() {
  const data = await postRequest('updateAccount', {
    userID: JSON.parse(localStorage.getItem('user')).userID,
    oldUsername: JSON.parse(localStorage.getItem('user')).username,
    newUsername: username.value,
    newPassword: password.value,
    newCreditCard: creditCard.value,
    newAddress: address.value
  });

  if (data) {
    if (!data.success) {
      alert(data.message);
    }
    else {
      localStorage.setItem('user', JSON.stringify(data.message));
      alert("Update successful!");
    }
  }
  else {
    console.error("Error updating");
  }
}

// Log out
function logOut() {
  // confirm log out
  if (!confirm(" Your cart will be cleared. Are you sure you want to log out?")) return;
  localStorage.removeItem('cart');
  localStorage.removeItem('user');
  clearUserDataFromPage();
  window.location.href = '/';
}

// Helper functions

// Initialize account page with user data
function initialize() {
  if (localStorage.getItem('user') === null) {
    alert("You must be logged in to view your account");
    window.location.href = '/';
  }
  else {
    console.log("V2", JSON.parse(localStorage.getItem('user')));
  
    const user = JSON.parse(localStorage.getItem('user'));
  
    username.value = user.username;
    password.value = user.password;
    creditCard.value = user.creditCard;
    address.value = user.address;
  }
}

// Clear user data from page
function clearUserDataFromPage() {
  username.value = '';
  password.value = '';
  creditCard.value = '';
  address.value = '';
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
    console.error('Error getting items:', error);
  }
}

window.addEventListener('pageshow', function(event) {
  if (event.persisted) {
    window.location.reload();
  }
});
