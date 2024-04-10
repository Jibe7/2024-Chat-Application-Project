/**
 * @module add-user
 * @description Allow to add users to the database. Contains only one big function.
 * @exports {AddUserToDatabase} moduleExports 
 */
const users = require('./users-db.js');
const co = require('./connect-db.js');
const crypt = require('./crypt.js')

module.exports = { AddUserToDatabase };

/**
 * 
 * @param {String} username 
 * @param {String} password  
 * @param {mysql.Connection} connection - Returned object from mysql2.createConnection function call 
 * @returns {Boolean}- A boolean representing if the user was added or not
 */
async function AddUserToDatabase(username, password, connection = undefined) {
    // Use existing connection or create a new one. Note : upcoming modification -> we should not manage this kind of thing here but let the right class / module manage that the code is not mature yet to consider it but to keep in mind.
    try {
        connection = connection ?? await co.connectToDatabase()
    } catch (error) {
        console.error("Couldn't connect to db."+error)
    }
    if (connection === undefined) { return connection}

    // Verify that username is not already taken
    let create = true;
    const userNames = await users.getAllUserNames(connection);
    try {
        userNames.forEach(element => {
            if (username === element.username) {
                throw new Error('Existing Username !');
            }
        })
    } catch (error) {
        console.error(error)
        create = false;
        console.log("Create state: "+create)
    }
    
    // FUTURE : add salt and hash the password + add salt column in database
    let salt = await crypt.createSalt();
    let [hashedPassword, resSalt] = await crypt.createHash(password, salt)

    // Update the database
    if (create) {
        users.createNewUser(connection, username, hashedPassword, resSalt)
            .catch((e) => console.log("Error creating new user: "+e))
    } else {
        // TODO [FUTURE] : says to the user that this username is already taken, we should print a message to the user. 
    }
    return connection;
}


// Expected behavior when the username does not exist or already exists. Have not tested yet with images and how to do with blob conversion.
// const run = async () => {
//     const conn = await co.connectToDatabase();
//     await AddUserToDatabase("JacobCollier", "B0TwSmrR3!Arkc", conn)
//     co.closeConnection(conn);
// }

// run()