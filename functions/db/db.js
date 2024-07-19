const admin = require('firebase-admin');

if (process.env.FUNCTIONS_EMULATOR) {
  const databaseURL = `http://localhost:9000?ns=${process.env.GCLOUD_PROJECT}`;
  admin.initializeApp({
      databaseURL: databaseURL
  });
} else {
  admin.initializeApp();
}

const db = admin.database();

/**
 * Retrieves data from the database at refPath
 * 
 * @param {string} refPath 
 * @returns {any}
 */
async function get(refPath) {
  try {
    const snapshot = (await db.ref(refPath).once('value'));
    const data = snapshot.val();
    return data;
  } 
  catch (error) {
    console.error(`Error reading from ${refPath}:`, error);
    throw new Error(`Unable to retrieve data from ${refPath}`);
  }
}

/**
 * Updates data refPath with newValue in the database
 *
 * @param {string} refPath
 * @param {any} newValue
 */
async function update(refPath, newValue) {
  try {
    await db.ref(refPath).update(newValue);
    console.log(`Data updated at ${refPath}:`, newValue);
  } catch (error) {
    console.error(`Error updating data at ${refPath}:`, error);
    throw new Error(`Unable to update data at ${refPath}`);
  }
}

async function deleteItem(refPath) {
  try {
    await db.ref(refPath).remove();
  }
  catch (error) {
    console.error(`Error deleting data at ${refPath}:`, error);
    throw new Error(`Unable to delete data at ${refPath}`);
  }
}

module.exports = {
  get,
  update,
  deleteItem
};