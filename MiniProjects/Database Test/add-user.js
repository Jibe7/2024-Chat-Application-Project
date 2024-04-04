const users = require('./users-db.js');
const co = require('./connect-db.js')

module.exports = { AddUserToDatabase };

async function AddUserToDatabase(username, password, connection = undefined) {
    // Use existing connection or create a new one
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
    }
    
    // FUTURE : add salt and hash the password + add salt column in database
    let modifiedPass = password;


    // Update the database
    if (create) {
        users.createNewUser(connection, username, modifiedPass)
            .catch((e) => console.log("Error creating new user: "+e))
            // .finally(() => co.closeConnection(connection)) Do we manage the closing there or elsewhere ?
    } else {
        // FUTURE : says that this username is already taken, we should print a message to the user.
    }
    return connection;
}


// Expected behavior when the username does not exist or already exists. Have not tested yet with images and how to do with blob conversion.
const run = async () => {
    const conn = await co.connectToDatabase();
    await AddUserToDatabase("Kirk Hammett", "MetaGuitar", conn)
    co.closeConnection(conn);
}

run()