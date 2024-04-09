/**
 * @module conv-manager
 * @description Database interaction for conversations related tasks. 
 * Only few JS files should interact with the database using SQL queries, thus 'high-level' function should be implemented in other files/modules and rely on this one.  
 * Allow the storage of conversations tables metadata such as conversationID, creationTime, authorized_users, creator of the conversation inside a unique database. Allow to create new conversations.
 * @exports { createConversation, updateAuthorizedUsers, updateStatus } moduleExports - 
 */

const co = require('./connect-db.js');
const date = require('dayjs');

module.exports = { createConversation, updateAuthorizedUsers, updateStatus };

/**
 * @description Takes a request from a user willing to create a new conversation with certain other users.
 * @param {String | user_id} request - Username or user_id allowing to identify the sender.
 * @param {Array} allowed_users - Array of users that will take part of the conversation.
 * @returns {Boolean} State of the completion of the request.
 */
async function createConversation(connection, requester, allowed_users) { // TESTED OK, when there are no entities in the table as well as when there are
    // To create a new conversation we need to know what the last conversation was.
    let conv_id;
    try {
        conv_id = await getLastConversationsID(connection);
        console.log("conv_id: "+conv_id)
    } catch (error) {
        console.error(error);
    }
    conv_id++;
    // Prepare data for the query
    allowed_users.push(requester);
    allowed_users = allowed_users.map((el) => "\""+el+"\"") 
    let currentDate = date();
    let formattedDate = currentDate.format('YYYY-MM-DD HH:mm:ss')

    // Define & execute the query
    let sqlQuery = `INSERT INTO conv_history (conv_id, conv_creation_date, authorized_users, conv_creator, status) VALUES (${conv_id}, \'${formattedDate}\', '{"authorized_list": [${allowed_users}]}', \'${requester}\','active');`;
    try {
        let res = await connection.execute(sqlQuery);
        /* Returns :
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
]*/ 
        console.log(res);
        return true;
    } catch (error) {
        console.error(error);
    }
}

const run = async () => {
    const conn = co.connectToDatabase();
    let res = createConversation(conn, "Random", ["Name1", "Username", "Thirdname"]);
    console.log(typeof(res));
    console.log(res);
    // console.log(res[0]);
    // console.log(res[0].conv_id);
    co.closeConnection(conn);
}
run()
// const run = async () => {
//     const conn = co.connectToDatabase();
//     let res = createConversation(conn, "Metallica", ["James Hetfield", "Kirk Hammett", "Lars Ulrich"]);
//     console.log(typeof(res));
//     console.log(res);
//     // console.log(res[0]);
//     // console.log(res[0].conv_id);
//     co.closeConnection(conn);
// }
// run()
// const run = async () => {
//     const conn = await co.connectToDatabase();
//     let res = await createConversation(conn, "JacobCollier", ["MichaelJackson", "TheWeeknd", "Bruno Mars"]);
//     console.log(typeof(res));
//     console.log(res);
//     // console.log(res[0]);
//     // console.log(res[0].conv_id);
//     co.closeConnection(conn);
// }
// run()

async function getConversationsID(connection) {
    
    let resQuery = await connection.execute(`SELECT conv_id FROM conv_history`);
    return resQuery

}

// const run = async () => {
//         const conn = await co.connectToDatabase();
//         let res = await getConversationsID(conn);
//         console.log(typeof(res));
//         console.log(res);
//         // console.log(res[0]);
//         // console.log(res[0].conv_id);
//         co.closeConnection(conn);
//     }
//     run()

async function getLastConversationsID(connection) { // TESTED when the table is new, it returned 0 as expected.
    let res;
    try {
        let resQuery = await connection.execute(`SELECT conv_id FROM conv_history`);
        res = resQuery[0][0] ?? {'conv_id': 0}
    } catch (error) {
        console.log(error);
    }
    return res.conv_id;

}

// const run = async () => {
//     const conn = await co.connectToDatabase();
//     let res = await getLastConversationsID(conn);
//     console.log(typeof(res));
//     console.log(res);
//     // console.log(res[0]);
//     // console.log(res[0].conv_id);
//     co.closeConnection(conn);
// }

// run()

/**
 * @description Takes a request to change the authorized user list and update the list. // Note : the list is present inside the conversation manager and also the user table. We will need to update the two of them or delete one.
 * @param {Array} users_updated - Array of users to add or remove from the authorized array.
 * @param {Number} type - 0 if we want to delete users, 1 if we want to add.
 * @returns {Boolean} State of the completion of the request.
 */
async function updateAuthorizedUsers(users_updated, type) {

}

/**
 * @description Takes a request to get the authorized user list and returns it.
 * @param {Number} conversation_id - 0 if we want to delete users, 1 if we want to add.
 * @returns {Boolean} State of the completion of the request.
 */
async function getAuthorizedUsers(connection, conversation_id) {
    let res = await connection.execute(`SELECT authorized_users FROM conv_history WHERE conv_id = ${conversation_id}`);
    return res;
}

// const run = async () => {
//     const conn = co.connectToDatabase();
//     let res = getAuthorizedUsers(conn, 1);
//     console.log(typeof(res));
//     console.log(res);
//     // console.log(res[0]);
//     // console.log(res[0].conv_id);
//     co.closeConnection(conn);
// }
// run()

/**
 * @description Takes a request to change the status of a conversation and update it in the database. 
 * @param {Number} conversation_id - Unique number representing a conversation.
 * @param {String} status - Can be active, inactive.
 * @returns {Boolean} State of the completion of the request.
 */
async function updateStatus(conversation_id, status) {

}