/**
 * @module remove-user
 * @description Allow to remove users from the database. Also exports a utility function that is used to get the user_id from a username.
 * It contains three functions : giveIDfromName, removeUserFromDatabaseWithID and removeUserFromDatabase which is built on top of the two others.
 * @exports {removeUserFromDatabase, giveIDfromName} moduleExports - 
 */
const users = require('../low-level-modules/users-db.js');
const co = require('./connect-db.js')
module.exports = { removeUserFromDatabase, giveIDfromName };


/**
 * 
 * @param {mysql.Connection} connection - Returned object from mysql2.createConnection function call 
 * @param {Number} user_id - Unique user id. 
 * @returns {Boolean}- A boolean representing if the user was deleted or not based on his user_id.
 */
async function removeUserFromDatabaseWithID(connection, user_id) { // TESTED OK, can remove a user from the database using an id. If there was no deletion returns false, true otherwise.
    try {
        let x = await users.deleteUserID(connection, user_id);
        return x[0].affectedRows === 1;
    } catch (error) {
        console.error(error);
        return false;   
    }
}

/**
 * 
 * @param {mysql.Connection} connection - Returned object from mysql2.createConnection function call 
 * @param {String | Number} user - Represents a user : either a user id or a username. 
 * @returns {Boolean}- A boolean representing if the user was deleted or not. 
 */
async function removeUserFromDatabase(connection, user) { // TESTED OK
    try {
        if (typeof(user) === typeof(1)) {
            return removeUserFromDatabaseWithID(connection, user)
        }
        let userData = await giveIDfromName(connection, user);
        return removeUserFromDatabaseWithID(connection, userData.user_id);
    } catch (error) {
        console.error(error);
        return false;   
    }
}

/**
 * 
 * @param {mysql.Connection} connection - Returned object from mysql2.createConnection function call 
 * @param {String | Number} user - Represents the user, it can be a user_id or a username. 
 * @returns {Object | Boolean}- False if there was an error, else returns an object with the username and the user_id.
 */
async function giveIDfromName(connection, user = -1) { // TESTED OK
    try {
        let [x] = await users.getUserNameAndID(connection, user);
        return x;
    } catch (error) {
        console.error(error);
        return false;   
    }
}

// Function tests :

// co.connectToDatabase()
//     .then((connection) => {
//         removeUserFromDatabase(connection, 18)
//         .then((res) => {
//             console.log(res);
//         })
//         .catch((err) => {console.log(err)})
//         .finally(() => co.closeConnection(connection))
//     })
//     .catch((e) => console.log("Connection error: " + e))

// co.connectToDatabase()
//     .then((connection) => {
//         giveIDfromName(connection, "AdaLovelace")
//         .then((res) => {
//             console.log(res);
//             console.log(res.username);
//             console.log(res.user_id);
//         })
//         .catch((err) => {console.log(err)})
//         .finally(() => co.closeConnection(connection))
//     })
//     .catch((e) => console.log("Connection error: " + e))

// co.connectToDatabase()
//     .then((connection) => {
//         removeUserFromDatabaseFromUsername(connection)
//         .then((res) => {console.log(res)})
//         .catch((err) => {console.log(err)})
//         .finally(() => co.closeConnection(connection))
//     })
//     .catch((e) => console.log("Connection error: " + e))

// co.connectToDatabase().then((connection) => {
//     users.deleteUserID(connection, 7)
//     .then((deleteResult) => {
//         console.log(deleteResult[0]);
//         console.log("---------------------")
//         console.log(deleteResult[0].affectedRows);
//     })
//     .catch((e) => console.log("Deletion error: " + e))
//     .finally(() => co.closeConnection(connection))
// })
// .catch((e) => console.log("Connection error: " + e))
