const connect = require('./connect-db.js');

module.exports = {
    getAllUserNames,
    getAllUsers,
    getAllFromUserID,
    getAllFromUserName,
    createNewUser,
    deleteUserID
  }

// FUTURE - SECURITY : Think about how to prevent SQL injection in functions that uses user input to query the database.
// Basic Prevention System would verify that SQL key words are not present in string, that the string has a maximum length and that the type of the variable is the good one.
// More advanced Prevention System would require researches on that subject.

/**
 * 
 * @param {mysql.Connection} connection - returned object from mysql2.createConnection function call 
 * @returns {Array} - An array containing objects that have all of the data (user_id, username, password, conversations, profile_img) of all of the users inside the database. 
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
      // connect.closeConnection(connection);
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
We access a username using array[0].username >>> AdaLovelace
 */
async function getAllUserNames(connection) { // TEST OK
    try {
      const [rows] = await connection.execute('SELECT username FROM USER');
      return rows;
    } catch (error) {
      console.error('Error fetching usernames:', error);
      // connect.closeConnection(connection);
    } 
}

/**
 * 
 * @param {mysql.Connection} connection - returned object from mysql2.createConnection function call 
 * @param {Number} user_id - unique user ID
 * @returns - An array containing an object like :
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
async function getAllFromUserID(connection, user_id) { // TEST OK
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
 * @returns - An array containing an object like :
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
 * @param {Array} data - Spread syntax containing either a username and a password or both of them and a profile image as blob data. 
 * @returns - An array containing an object like :
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
async function createNewUser(connection, ...data) { // TEST OK EXCEPT blob image NOT TESTED
    try {
        let nbOfArgs = data.length;
        let sqlQuery;
        switch (nbOfArgs) {
          case 2:
            sqlQuery = `INSERT INTO user (username, password, conversations) VALUES (\'${data[0]}\', \'${data[1]}\', '{"authorized_list": []}');`;
            break;
          case 3:
            sqlQuery = `INSERT INTO user (username, password, conversations, profile_img) VALUES (\'${data[0]}\', \'${data[1]}\', '{"authorized_list": []}', profile_img = ${data[2]});`;
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
 * @returns - An array containing an object like :
 * [
  ResultSetHeader {  
    fieldCount: 0,   
    affectedRows: 1, 
    insertId: 7,     
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
    return result;
  } catch (error) 
  {
    console.log("Deletion error.")
    console.error(error)
  }
} 