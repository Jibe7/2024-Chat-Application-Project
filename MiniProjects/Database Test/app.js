// was the first file where I tested my functions and used as a playground.
const users = require('./users-db.js');
const co = require('./connect-db.js')

// My backend app (database side) will need to : 
// create users, store passwords and communicate with the database securately, authentify user connection, 
// send the right messages for the right conversation, create conversation, update the authorized_list of users, verify a conversation is inside that authorized list for a given user
// Talk with the front end, recognize and store a user session so that he does not have to login each time, send html files and messages of conversation, send profile images
// Messy, used this file for my first tests with the database



co.connectToDatabase().then((connection => 
    users.getAllFromUserID(connection, 2)
    .then((usersData) => {
        console.log(usersData)
        try {
            console.log("Type of userDataFromID: " +typeof(usersData))
            let obj = usersData[0];
            console.log("Type of userDataFromID[0]: " + typeof(obj))
            console.log(obj)
            console.log(obj.user_id)
            console.log(obj.username)
            console.log(obj.password)
            console.log(obj.profile_img)
            console.log(obj.conversations)
            console.log(obj.conversations.authorized_list)
        } catch (e) {
            console.log(e);
            // co.closeConnection(connection);
            console.log("Error getting a property from the returned object.")
            throw e;
        }
    })
    .catch((e) => {
        console.log(e)
        console.log("Error Getting User from ID")
    })
    .finally(() => {
        co.closeConnection(connection);
        console.log("Connection Closed normally.")
    })
    ))
    .catch((e) => console.log(e))
