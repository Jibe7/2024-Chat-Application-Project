/**
 * @module conversation
 * @description Database interaction for messages inside a given conversation : we can add new messages, retrieve the msg_id of the last messages sent in this conversation and retrieve messages from a range of msg_ids. 
 * Only few JS files should interact with the database using SQL queries, thus 'high-level' function should be implemented in other files/modules and rely on this one.
 * Allow to add, retrieve messages inside a conversation (represented as a table in mysql database). 
 * @exports { addNewMessage, retrieveMessageFromRange, getLastMessageIndex } moduleExports - 
 */

const date = require('dayjs');
const co = require('./connect-db.js');

module.exports = { addNewMessage, retrieveMessageFromRange, getLastMessageIndex };


/**
 * @description Add a new message to the conversation.
 * @param {mysql.Connection} connection - An object returned from mysql2.createConnection function call.
 * @param {String} sender - Username of the sender.
 * @param {String} msg_content - Message content (text only) sent by the user.
 * @param {Number} conversation_id - Conversation the user is sending the message in.
 * @param {Daysjs object} time_sent - Time the message was sent. It's value if not set is undefined and will be set at the time the function is called as the default behavior.
 * @returns {Boolean} State of the completion of the request.
 */
async function addNewMessage(connection, sender, msg_content, conversation_id, time_sent = undefined) { // TESTED OK when it is the first message of the conversation and when its not.
    time_sent = time_sent ?? date();
    let formattedDate = time_sent.format('YYYY-MM-DD HH:mm:ss')

    let addMsgQuery = `INSERT INTO conversation${conversation_id} (time_sent, msg_sender, msg_content, conv_id) VALUES (?, ?, ?, ?)`;
    try {
        await connection.execute(addMsgQuery, [formattedDate, sender, msg_content, conversation_id]);

    } catch (error) {
        console.error(error);
        return false;
    }
    return [addMsgQuery, true];
}

// Function tests 
//
// const run = async () => {
//     const conn = await co.connectToDatabase();
//     let res1 = await addNewMessage(conn, "SoloConversationnist", `\0, conversation_id]); 
//     console.log("Am I hacking into the system like that ?");`, 5);
//     console.log(typeof(res1));
//     console.log(res1);
//     // console.log(res[0]);
//     // console.log(res[0].conv_id);
//     co.closeConnection(conn);
// }
// run()

// const run = async () => {
//     const conn = await co.connectToDatabase();
//     let res1 = await addNewMessage(conn, "SoloConversationnist", `- I'm quite happy that my first test was a success.
//     - Are you ?
//     - I expected it to not work, so yes.
//     - Why ?
//     - That's usually what happends.
//     - I see.
//     `, 5);
//     console.log(typeof(res1));
//     console.log(res1);
//     // console.log(res[0]);
//     // console.log(res[0].conv_id);
//     co.closeConnection(conn);
// }
// run()

// const run = async () => {
//     const conn = await co.connectToDatabase();
//     let res1 = await addNewMessage(conn, "SoloConversationnist", "I love to talk alone in a conversation made of me and my other self ! Is that so ? No but I first need to test before this app before talking to other people.If you say so.", 5);
//     console.log(typeof(res1));
//     console.log(res1);
//     // console.log(res[0]);
//     // console.log(res[0].conv_id);
//     co.closeConnection(conn);
// }
// run()

/**
 * @description Retrieve message from a range (last message to last 10th message, last 10th message to last 25th message...). It is a dumb function, the existence of the start and end indexes have to be checked before hand or it will cause an error. The right of the requester to get the messages should also be checked before calling this function.
 * @param {mysql.Connection} connection - An object returned from mysql2.createConnection function call.
 * @param {Number} start_msg - First message the user is requesting
 * @param {Number} end_msg - Last message the user is requesting
 * @param {Number} conversation_id - Conversation the user is sending the message in.
 * @returns {Object} Object containing the messages the user has requested, false if it didn't achieve the retrieval. If start_msg > end_msg returns undefined.
 * @example // Returned object sample below.
 * // We can access data with result[0].msg_content, result[1].msg_content ...
 * [
  {
    time_sent: 2024-04-10T12:49:56.000Z,
    msg_sender: 'SoloConversationnist',
    msg_content: "- I'm quite happy that my first test was a success.\n" +
      '    - Are you ?\n' +
      '    - I expected it to not work, so yes.\n' +
      '    - Why ?\n' +
      "    - That's usually what happends.\n" +
      '    - I see.\n' +
      '    '
  },
  {
    time_sent: 2024-04-10T12:49:58.000Z,
    msg_sender: 'SoloConversationnist',
    msg_content: "- I'm quite happy that my first test was a success.\n" +
      '    - Are you ?\n' +
      '    - I expected it to not work, so yes.\n' +
      '    - Why ?\n' +
      "    - That's usually what happends.\n" +
      '    - I see.\n' +
      '    '
  }
]
 */
async function retrieveMessageFromRange(connection, start_msg, end_msg, conversation_id) { // Works well even with out of boundary indexes (-1, +inifity...), in this case would return all of the messages. Returns undefined when start_msg > end_msg. We can test against this case if we want to but it does not cause any error.
    let msgRequest = `SELECT time_sent, msg_sender, msg_content from conversation${conversation_id} WHERE msg_id BETWEEN ? AND ?`;
    let resQuery;
    try {
        [resQuery] = await connection.execute(msgRequest, [start_msg, end_msg])
    } catch (error) {
        console.error(error);
    }
    return resQuery;
}

// const run = async () => {
//     const conn = await co.connectToDatabase();
//     let res1 = await retrieveMessageFromRange(conn, -1, 7, 5);
//     console.log(typeof(res1));
//     console.log(res1);
//     // console.log(res1[0]);
//     co.closeConnection(conn);
// }
// run()


// const run = async () => {
//     const conn = await co.connectToDatabase();
//     let res1 = await retrieveMessageFromRange(conn, 1, 3, 5);
//     console.log(typeof(res1));
//     console.log(res1);
//     console.log("----------------------------------")
//     console.log(res1[0]);
//     console.log(res1[0].time_sent);
//     console.log(res1[0].msg_sender);
//     console.log(res1[0].msg_content);
//     console.log("----------------------------------")
//     console.log(res1[1]);
//     console.log("----------------------------------")
//     console.log(res1[3]);
//     co.closeConnection(conn);
// }
// run()

/**
 * @description Retrieve the last message's index.
 * @param {mysql.Connection} connection - An object returned from mysql2.createConnection function call.
 * @param {Number} conversation_id - Conversation the user is sending the message in.
 * @returns {Number} The msg_id of the last message sent. Returns -1 if the conversation is empty.
 */
async function getLastMessageIndex(connection, conversation_id) { // TESTED OK when conversation is and is not empty.
    let query = `SELECT msg_id FROM conversation${conversation_id}`;
    let msg_ids;
    try {
        [msg_ids] = await connection.execute(query);
    } catch (error) {
        console.error(error)
    }
    if (msg_ids.length === 0) {return -1}
    return msg_ids[msg_ids.length-1].msg_id;
}

// const run = async () => {
//     const conn = await co.connectToDatabase();
//     let res1 = await getLastMessageIndex(conn, 5);
//     console.log(typeof(res1));
//     console.log(res1);
//     // console.log(res1[0]);
//     co.closeConnection(conn);
// }
// run()