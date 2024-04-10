/**
 * @module conv-manager
 * @description Database interaction for conversations related tasks. 
 * Allow to create new conversations, get and update the list of authorized users. 
 * This module is not about managing messages inside a conversation but managing all of the different conversations.
 * Only few JS files should interact with the database using SQL queries, thus 'high-level' function should be implemented in other files/modules and rely on this 'low-level' one.
 * @exports { createConversation, updateAuthorizedUsers, getAuthorizedUsers } moduleExports - 
 */

const co = require('./connect-db.js');
const date = require('dayjs');

module.exports = { createConversation, updateAuthorizedUsers, getAuthorizedUsers };

/**
 * @description Takes a request from a user willing to create a new conversation with certain other users. Creates a new conversation in the conv_history table (described in generalProjectArchitecture.drawio) and create a new conversation table.
 * // FUTURE : we will need to introduce synchronization mechanisms so that we don't have concurrent request for writing a conversation with the same number in the database.
 * @param {mysql.Connection} connection - An object returned from mysql2.createConnection function call.
 * @param {String | user_id} requester - Username or user_id allowing to identify the sender.
 * @param {Array} allowed_users - Array of users that will take part of the conversation. The requester is automatically added into it so do not put it there. Default value is an empty array [].
 * @returns {Boolean} State of the completion of the request.
 */
async function createConversation(connection, requester, allowed_users = []) { // TESTED OK, when there are no entities in the table as well as when there are
    // To create a new conversation we need to know what the last conversation was.
    let finalResult = true;
    // Get the last conv_id in the db
    let conv_id;
    try {
        conv_id = await getLastConversationsID(connection);
    } catch (error) {
        console.error(error);
        return false;
    }
    conv_id++;
    console.log("conv_id: "+conv_id)

    // Prepare data for the query
    allowed_users.push(requester); // The creator of the request should be authorized
    let currentDate = date();
    let formattedDate = currentDate.format('YYYY-MM-DD HH:mm:ss')

    // Define & execute the query for conv_history
    let sqlQuery = `INSERT INTO conv_history (conv_id, conv_creation_date, authorized_users, conv_creator, status) VALUES (?, ?, ?, ?, ?)`; // This is how to protect against SQL injection. At least better than passing arguments directly with ${}.
    try {
        let res = await connection.execute(sqlQuery, [conv_id, formattedDate, allowed_users, requester, 'active']);
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
    } catch (error) {
        console.error(error);
        return false;
    }
    
    // Define & execute the query for a new conversation
    let tableName = `conversation${conv_id}`;
    let newConvQuery = `CREATE TABLE ${tableName} (
        msg_id INT AUTO_INCREMENT PRIMARY KEY,
        time_sent DATETIME NOT NULL,
        msg_sender VARCHAR(255) NOT NULL,
        msg_content TEXT,
        conv_id INT UNIQUE
    );`; // conv_id is not user input.
    let newConvExecRes;
    try {
        newConvExecRes = await connection.execute(newConvQuery);
    } catch (error) {
        console.error(error);
        try {
            let delQuery = `DELETE FROM conv_history WHERE conv_id = ${conv_id}`;
            _ = await connection.execute(delQuery);
            finalResult = false;
        } catch (error) {
            console.error(delQueryExecRes);
            return false;
        }
    }
    return finalResult;
}

// const run = async () => {
//     const conn = await co.connectToDatabase();
//     let res1 = await createConversation(conn, "SoloConversationnist");
//     console.log(typeof(res1));
//     console.log(res1);
//     // console.log(res[0]);
//     // console.log(res[0].conv_id);
//     co.closeConnection(conn);
// }
// run()

// const run = async () => {
//     let conn;
//     try {
//     conn = await co.connectToDatabase();
  
//       await createConversation(conn, "Random", ["Name1", "Username", "Thirdname"])
//         .then((res) => {
//           console.log(typeof(res));
//           console.log(res);
//         });
// const run = async () => {
//     let conn;
//     try {
//     conn = await co.connectToDatabase();
//       await createConversation(conn, "Random", ["Name1", "Username", "Thirdname"])
//         .then((res) => {
//           console.log(typeof(res));
//           console.log(res);
//         });
//       await createConversation(conn, "Metallica", ["James Hetfield", "Kirk Hammett", "Lars Ulrich"])
//         .then((res1) => {
//           console.log(typeof(res1));
//           console.log(res1);
//         });
//     } catch (err) {
//       console.error(err);
//     } finally {
//       co.closeConnection(conn); // Close the connection only after all queries are done
//     }
//   };
//   run();

// const run = async () => {
//     const conn = await co.connectToDatabase();
//     let res1 = await createConversation(conn, "Metallica", ["James Hetfield", "Kirk Hammett", "Lars Ulrich"]);
//     console.log(typeof(res1));
//     console.log(res1);
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

/**
 * @description Returns all the conversations IDs available.
 * @param {mysql.Connection} connection - An object returned from mysql2.createConnection function call.
 * @returns {Array/Object} Returns an array containing the available conversations ID. eg : [ 1, 2 ]. However in reality it is an object when we use typeof...
 */
async function getConversationsID(connection) { // TESTED OK
    
    let resQuery = await connection.execute(`SELECT conv_id FROM conv_history`);
    const convIds = resQuery[0].map(obj => obj.conv_id);
    return convIds;
}

// const run = async () => {
//         const conn = await co.connectToDatabase();
//         let res = await getConversationsID(conn);
//         console.log(typeof(res));
//         console.log(res);
//         console.log(res[0]);
//         co.closeConnection(conn);
//     }
// run()

/**
 * @description Returns the last conversation ID in the conv_history db. Made this function so that we use last_conv_id + 1 when we create a new conversation. // Note : might be optimizable with a better SQL query ?
 * @returns {Number} The greatest conversation id in the conv_history database.
 */
async function getLastConversationsID(connection) { // TESTED when the table is not new and when it is empty as well.
    let res;
    try {
        let resQuery = await connection.execute(`SELECT conv_id FROM conv_history`);
        let size = resQuery[0].length;
        if (size === 0) {
            return 0;
        }
        res = resQuery[0][size-1];
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
 * @description Takes a request to change the authorized user list and update the list. // Note : the list is present inside the conversation manager and also the user table. We will need to update the two of them or delete one. // Note : this is a functionnality that needs to be done now because we need to have authorized users to send message inside a conversation.
 * // As a first approach we can get the stored list in the database, update the array and create a new query. Later, if needed (as querying the database costs resources), we can think of more intelligent ways of doing so by asking the database once, storing and updating the result in 'cache' on the server side and updating the database less frequently only when needed. Thus we would need to update the getAuthorizedUsers so that it first check this cache, and if the cache is empty query the database.
 * @param {mysql.Connection} connection - An object returned from mysql2.createConnection function call.
 * @param {Number} conversation_id - Unique ID representing a given conversation.
 * @param {Array} users_updated - Array of users to add or remove from the authorized array.
 * @param {Boolean} type - false if we want to delete users, true if we want to add them.
 * @returns {Boolean} State of the completion of the request.
 */
async function updateAuthorizedUsers(connection, conversation_id, users_updated, type) { // TESTED in case of addition and deletion
    // Retrieval of the current authorized list
    let currentList = await getAuthorizedUsers(connection, conversation_id);
    // Construction of the final authorized list
    let finalList = Array();
    if (!type) {
        for (usr of currentList) {
            if (!users_updated.includes(usr)) {
                finalList.push(usr);
            }
        };
    } else {
        for (usr of currentList) {
            users_updated.push(usr);
        }
        finalList = users_updated;
    }
    // Creation & execution of the query
    let updateQuery = `UPDATE conv_history SET authorized_users = (?) WHERE conv_id = ${conversation_id}`;
    try {
        await connection.execute(updateQuery, [finalList]);
    } catch (error) {
        console.error(error);
        return false;
    }
    return true;
}

// const run = async () => {
//     const conn = await co.connectToDatabase();
//     let res;
//     try {
//         res = await updateAuthorizedUsers(conn, 1, ["Name1", "Random"], true);
//         console.log(typeof(res));
//         console.log(res);
//     } catch (error) {
//         console.error(error);
//     } finally {
//         co.closeConnection(conn);
//     }
// }
// run()

// const run = async () => { // TEST FOR DELETION, WORKED
//     const conn = await co.connectToDatabase();
//     let res;
//     try {
//         res = await updateAuthorizedUsers(conn, 1, ["Name1", "Random"], false);
//         console.log(typeof(res));
//         console.log(res);
//     } catch (error) {
//         console.error(error);
//     } finally {
//         co.closeConnection(conn);
//     }
// }
// run()

/**
 * @description Takes a request to get the authorized user list and returns it.
 * @param {mysql.Connection} connection - An object returned from mysql2.createConnection function call.
 * @param {Number} conversation_id - 0 if we want to delete users, 1 if we want to add.
 * @returns {Array/Object} Array that contains the list of authorized users for a given conversation.
 * @example console.log(res);
 * [ 'James Hetfield', 'Kirk Hammett', 'Lars Ulrich', 'Metallica' ] // but it is an object if we use typeof.
 */
async function getAuthorizedUsers(connection, conversation_id) { // TESTED OK
    let res;
    try {
        res = await connection.execute(`SELECT authorized_users FROM conv_history WHERE conv_id = ${conversation_id}`);
    } catch (error) {
        console.log("getAuthorizedList error: "+error)
    }
    return res[0][0].authorized_users;
}

// const run = async () => {
//     const conn = await co.connectToDatabase();
//     let res = await getAuthorizedUsers(conn, 2);
//     console.log(typeof(res));
//     console.log(res);
//     console.log(res[0]);
//     co.closeConnection(conn);
// }
// run()

/**
 * @description Takes a request to change the status of a conversation and update it in the database. Note : this is not a functionnality yet, lets not do it until it becomes.
 * @param {Number} conversation_id - Unique number representing a conversation.
 * @param {String} status - Can be active, inactive.
 * @returns {Boolean} State of the completion of the request.
 */
async function updateStatus(conversation_id, status) {

}