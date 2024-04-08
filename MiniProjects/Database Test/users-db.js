/**
 * @module users-bd
 * @description Database interaction for user related tasks. 
 * Only few JS files should interact with the database using SQL queries, thus 'high-level' function should be implemented in other files/modules and rely on this one.  
 * Define the functions getAllUsers, getAllUserNames, getAllUserNamesAndIDs, getUserNameAndID, getUserFromID, getAllFromUserName, createNewUser, deleteUserID and exports them all.   
 * @exports {getAllUserNames,
    getAllUsers,
    getUserFromID,
    getAllFromUserName,
    createNewUser,
    deleteUserID,
    getAllUserNamesAndIDs,
    getUserNameAndID} moduleExports - 
 */
const connect = require('./connect-db.js');

module.exports = {
    getAllUserNames,
    getAllUsers,
    getUserFromID,
    getAllFromUserName,
    createNewUser,
    deleteUserID,
    getAllUserNamesAndIDs,
    getUserNameAndID
  }

// FUTURE - SECURITY : Think about how to prevent SQL injection in functions that uses user input to query the database.
// Basic Prevention System would verify that SQL key words are not present in string, that the string has a maximum length and that the type of the variable is the good one.
// More advanced Prevention System would require researches on that subject.

/**
 * 
 * @param {mysql.Connection} connection - returned object from mysql2.createConnection function call 
 * @returns {Array} - An array containing objects that have all of the data (user_id, username, password, conversations, profile_img...) of all of the users inside the database. 
 * Return value example if there is only one user :
 [
  {
    user_id: 1,
    username: 'AdaLovelace',
    password: 'adaxbabbage1',
    conversations: { authorized_list: [] },
    profile_img: null
  }
]
 */
async function getAllUsers(connection) { // TEST OK
    try {
      const [rows] = await connection.execute('SELECT * FROM USER');
      return rows;
    } catch (error) {
      console.error('Error fetching users:', error);
    } 
}

/**
 * 
 * @param {mysql.Connection} connection - is a returned object from mysql2.createConnection function call 
 * @returns {Array} - An array containing objects that have all of the username of all of the users inside the database. 
 * Return value example :
[
  { username: 'AdaLovelace' },
  { username: 'JoeSatriani0' },
  { username: 'SteveVai' }
]
* @description We access a username using >>> returnedResult.username  (prints :) AdaLovelace.
 */
async function getAllUserNames(connection) { // TEST OK
    try {
      const [rows] = await connection.execute('SELECT username FROM USER');
      return rows;
    } catch (error) {
      console.error('Error fetching usernames:', error);
    } 
}

/**
 * 
 * @param {mysql.Connection} connection - is a returned object from mysql2.createConnection function call 
 * @returns {Array} - An array containing objects that have all of the username of all of the users inside the database. 
 * Return value example : 
[
  { username: 'AdaLovelace' },
  { username: 'JoeSatriani0' },
  { username: 'SteveVai' }
]
* @description We access a username using returnedResult.username and the user_id with returnedResult.user_id.
 */
async function getAllUserNamesAndIDs(connection) { // TEST OK
  try {
    const [rows] = await connection.execute('SELECT username, user_id FROM USER');
    return rows;
  } catch (error) {
    console.error('Error fetching usernames and ids:', error);
  } 
}

/**
 * 
 * @param {mysql.Connection} connection - is a returned object from mysql2.createConnection function call 
 * @param {Number | String} user - Represents a user : is either a username or a user_id.
 * @returns {Array} - An array containing an object that have the username and the user_id of the user inside the database. 
 * @example 
 * Return value example : 
[
  { username: 'AdaLovelace',
    user_id: 1
  }
]
We access a username using array[0].username >>> AdaLovelace
We access a user_id using array[0].user_id >>> 1
 */
async function getUserNameAndID(connection, user) { // TESTED OK
  try {
    const [rows] = typeof(user) === typeof(1) ? await connection.execute(`SELECT username, user_id FROM USER WHERE user_id = ${user}`) : await connection.execute(`SELECT username, user_id FROM USER WHERE username = '${user}'`);
    return rows;
  } catch (error) {
    console.error('Error fetching usernames and ids:', error);
  } 
}

/**
 * 
 * @param {mysql.Connection} connection - returned object from mysql2.createConnection function call 
 * @param {Number} user_id - unique user ID
 * @returns - An array containing an object with all the user's metadata.
 * @example Return example :
 * [
  {
    user_id: 1,
    username: 'AdaLovelace',
    password: 'adaxbabbage1',
    conversations: { authorized_list: [] },
    profile_img: null,
    salt: null
  }
]
 */
async function getUserFromID(connection, user_id) { // TEST OK
    try {
        const [rows] = await connection.execute(`SELECT * FROM user WHERE user_id = ${user_id}`);
        return rows;
      } catch (error) {
        console.error('Error fetching user with user_id:', error);
      }
}

/**
 * 
 * @param {mysql.Connection} connection - returned object from mysql2.createConnection function call 
 * @param {Number} username - A username
 * @returns - An array containing an object which possess the user metadata.
 * @example Example of a returned array  :
 * [
  {
    user_id: 1,
    username: 'AdaLovelace',
    password: 'adaxbabbage1',
    conversations: { authorized_list: [] },
    profile_img: null
  }
]
 */
async function getAllFromUserName(connection, username) { // NOT TESTED
    try {
        const rows = await connection.execute(`SELECT * FROM user WHERE username = ${username}`);
        return rows;
      } catch (error) {
        console.error(`Error fetching user ${username} with username:`, error);
      }
}

/**
 * 
 * @param {mysql.Connection} connection - returned object from mysql2.createConnection function call 
 * @param {Array} data - Using spread syntax for an array containing in the following order : the username, the password, the salt and the profile img. Username, password and salts are required, profile image facultative.
 * // TODO [FUTURE] Test the storage of a profile image. I considere this as an advanced feature so it will be added later.  
 * @returns - An array containing database data (affectedRows, serverStatus...).
 * @example Returns an object like that :
[
  ResultSetHeader {
    fieldCount: 0,
    affectedRows: 1,
    insertId: 18,
    info: '',
    serverStatus: 2,
    warningStatus: 0,
    changedRows: 0
  },
  undefined
]
 */
async function createNewUser(connection, ...data) { // TEST OK EXCEPT blob image NOT TESTED
    try {
        let nbOfArgs = data.length;
        let sqlQuery;
        switch (nbOfArgs) {
          case 3:
            sqlQuery = `INSERT INTO user (username, password, conversations, salt) VALUES (\'${data[0]}\', \'${data[1]}\', '{"authorized_list": []}', \'${data[2]}\');`;
            break;
          case 4:
            sqlQuery = `INSERT INTO user (username, password, conversations, salt, profile_img) VALUES (\'${data[0]}\', \'${data[1]}\', '{"authorized_list": []}', \'${data[2]}\', ${data[3]});`;
            break;
          default:
            throw new Error('Arguments length outside of [2, 3].')
        }
        const rows = await connection.execute(sqlQuery);
        return rows;
      } catch (error) {
        console.error(`Error creating a new user with ${data} :`, error);
      }
}

/**
 * 
 * @param {mysql.Connection} connection - returned object from mysql2.createConnection function call 
 * @param {Number} user_id - Unique user id. 
 * @returns - An array with database response data (affectedRows, serverStatus).
 * @example An array like : 
 * Type of return : object
[
  ResultSetHeader {
    fieldCount: 0,
    affectedRows: 1,
    insertId: 0,
    info: '',
    serverStatus: 2,
    warningStatus: 0,
    changedRows: 0
  },
  undefined
]
 */
async function deleteUserID(connection, user_id) {
  try {
    let sqlQuery = `DELETE FROM user WHERE user_id = ${user_id}`;
    const result = await connection.execute(sqlQuery);
    console.log("When we delete a user :")
    console.log('Type of return : '+typeof(result))
    console.log(result)
    return result;
  } catch (error) 
  {
    console.log("Deletion error.")
    console.error(error)
  }
} 