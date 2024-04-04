const users = require('./users-db.js');
const co = require('./connect-db.js')


// Works fine
co.connectToDatabase().then((connection) => {
    users.deleteUserID(connection, 2)
    .then((deleteResult) => {
        console.log(deleteResult[0]);
    })
    .catch((e) => console.log("Deletion error: " + e))
    .finally(() => co.closeConnection(connection))
})
.catch((e) => console.log("Connection error: " + e))
