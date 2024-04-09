/**
 * @module conv-manage
 * @description Database interaction for conversations related tasks. 
 * Only few JS files should interact with the database using SQL queries, thus 'high-level' function should be implemented in other files/modules and rely on this one.  
 * Allow the storage of conversations tables metadata such as conversationID, creationTime, authorized_users, creator of the conversation inside a unique database. Allow to create new conversations.
 * @exports { createConversation, updateAuthorizedUsers, updateStatus } moduleExports - 
 */