const mysql = require('mysql2/promise');

module.exports = {
  connectToDatabase,
  closeConnection,
  mysql
}

// FUTURE : Create a proxy (with or without a singleton instance?) to have one or several connection(s) to the database and give that connection when a thread request one.
// I think I will need listenner thread(s) communicating with the front-end and 'maker' threads that communicate with the database.
// But for a start and simplicity I can just have one thread for all.   
// FUTURE - SECURITY : Configure and setup a secure ssl connection to the database.
// FUTURE - CODE IMPROVMENT : Make the connection config private, why not inside a class as a private variable. 

const CONNECTION_CONFIG = {
    host: 'localhost',
    user: process.env.RW_USER_DB,
    password: process.env.DB_PASSWORD,
    database: process.env.WB_CHAT_DB
};

async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection(CONNECTION_CONFIG);
    console.log('Successfully connected to the MySQL database');
    return connection;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error; // Re-throw the error for handling in your application
  }
}
  
async function closeConnection(connection) {
  try {
    await connection.end();
  } catch (error) {
    console.error(error);
  }
}