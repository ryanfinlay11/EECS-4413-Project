const { get, update, deleteItem } = require('../db/db');

const crypto = require("crypto");

async function login(username, password) {
  try {
    if (!username || !password) {
      return { success: false, message: 'Username or password missing' };
    }

    const user = await get('/users/' + username);

    if (!user) {
      return { success: false, message: `Username doesn't exist` };
    }
    if (user.password == password) {
      return { success: true, message: user };
    }
    else {
      return { success: false, message: 'Incorrect password' };
    }
  }
  catch (error) {
    return { success: false, message: error};
  }
}

async function register(username, password, creditCard, address) {
  try {
    if (!username || !password || !creditCard || !address) {
      return { success: false, message: 'Not all fields complete' };
    }
    // Check if credit card is in the form XXXX-XXXX-XXXX-XXXX
    else if (!creditCard.match(/^\d{4}-\d{4}-\d{4}-\d{4}$/)) {
      return { success: false, message: 'Credit card number must be in the format: XXXX-XXXX-XXXX-XXXX' };
    }

    const user = await get('/users/' + username);

    if (user) {
      return { success: false, message: `Username already exists` };
    }
    else {
      const newUser = {
        username: username,
        userID: crypto.randomUUID(),
        password: password,
        creditCard: creditCard,
        address: address,
        isAdmin: false
      }

      await update('/users/' + username, newUser);
      
      return { success: true, message: newUser };
    }
  }
  catch (error) {
    return { success: false, message: error};
  }
}

async function updateAccount(userID, oldUsername, newUsername, newPassword, newCreditCard, newAddress) {
  try {
    if (!newUsername || !newPassword || !newCreditCard || !newAddress) {
      return { success: false, message: 'Not all fields complete' };
    }
    // Check if credit card is in the form XXXX-XXXX-XXXX-XXXX
    else if (!newCreditCard.match(/^\d{4}-\d{4}-\d{4}-\d{4}$/)) {
      return { success: false, message: 'Credit card number must be in the format: XXXX-XXXX-XXXX-XXXX' };
    }

    // Check if new username already exists
    let user = await get('/users/' + newUsername);

    if ((user) && (newUsername != oldUsername)) {
      return { success: false, message: `Username already exists` };
    }

    user = await get('/users/' + oldUsername);

    if (!user) {
      // Should never happen
      return { success: false, message: `Username doesn't exist` };
    }
    else if (user.userID != userID) {
      // Security check to ensure user is updating their own account
      return { success: false, message: `User ID doesn't match` };
    }
    else {
      const updatedUser = {
        username: newUsername,
        userID: userID,
        password: newPassword,
        creditCard: newCreditCard,
        address: newAddress,
        isAdmin: user.isAdmin
      }

      await update('/users/' + newUsername, updatedUser);

      // If user changed their username, delete the old user
      if (oldUsername !== newUsername) {
        await deleteItem('/users/' + oldUsername);
      }

      return { success: true, message: updatedUser };
    }
  }
  catch (error) {
    return { success: false, message: error};
  }
}

module.exports = {
  login,
  register,
  updateAccount
};
