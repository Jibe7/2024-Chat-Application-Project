/**
 * @module conversation
 * @description Database interaction for messages inside a given conversation, related tasks. 
 * Only few JS files should interact with the database using SQL queries, thus 'high-level' function should be implemented in other files/modules and rely on this one.
 * Allow to add, retrieve, delete messages inside the database. 
 * @exports { addNewMessage, retrieveMessage, retrieveLastNMessages,  } moduleExports - 
 */


/**
 * @description Add a new message to the conversation.
 * @param {String} sender - Username of the sender.
 * @param {String} msg_content - Message sent by the user.
 * @param {Number} conversation_id - Conversation the user is sending the message in.
 * @returns {Boolean} State of the completion of the request.
 */
async function addNewMessage(sender, msg_content, conversation_id) {

}

/**
 * @description Retrieve message from a range (last message to last 10th message, last 10th message to last 25th message...).
 * @param {String | Number} user - User requesting the messages, represented by a username or a user_id.
 * @param {Number} start_msg - First message the user is requesting
 * @param {Number} end_msg - Last message the user is requesting
 * @param {Number} conversation_id - Conversation the user is sending the message in.
 * @returns {Object | Boolean} Object containing the messages the user has requested, false if it didn't achieve the retrieval.
 */
async function retrieveMessage(user, start_msg, end_msg, conversation_id) {

}

/**
 * @description Add a new message to the conversation.
 * @param {String} sender - Username of the sender.
 * @param {String} msg_content - Message sent by the user.
 * @param {Number} conversation_id - Conversation the user is sending the message in.
 * @returns {Boolean} State of the completion of the request.
 */
async function addNewMessage(sender, msg_content, conversation_id) {

}
