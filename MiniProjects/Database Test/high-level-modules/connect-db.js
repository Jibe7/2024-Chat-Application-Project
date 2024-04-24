/**
 * @module connect-db
 * @description Provide functions to access the MySQL database. Possess the database configuration with env variables.
 * @exports {connectToDatabase, closeConnection, mysql} moduleExports - mysql is the entire mysql2 module.
 */
const mysql = require('../mysql2/promise');
// TODO [AFTER THE PROJECT] Look if there are no equivalent to Django that allows to automatically manage the database with class definitions (ORM). I've heard about Expressjs that is a node framework but I've understood that it is smaller (means more manual configuration) than Django. Need to make my researches and find what is best to do db management quickly.

module.exports = {
  connectToDatabase,
  closeConnection,
  mysql
}

// TODO FUTURE : Create a proxy (with or without a singleton instance?) to have one or several connection(s) to the database and give that connection when a thread request one. ❌
// TODO FUTURE : I think I will need listenner thread(s) communicating with the front-end and 'maker' threads that communicate with the database. ❌
// But for a start and simplicity I can just have one thread for all.   
// TODO FUTURE - SECURITY : Configure and setup a secure ssl connection to the database. ❌
// TODO FUTURE - CODE IMPROVMENT : Make the connection config private, as an enviornment variable. DONE 🆗

const CONNECTION_CONFIG = {
    host: 'localhost',
    user: process.env.RW_USER_DB,
    password: process.env.DB_PASSWORD,
    database: process.env.WB_CHAT_DB
};

/**
 * 
 * @returns {mysql.Connection} connection - An object that is a returned object from mysql2.createConnection function call 
* @description We access a username using returnedResult.username and the user_id with returnedResult.user_id.
* @example Returns an object like:
object
PromiseConnection {
  _events: [Object: null prototype] {
    newListener: [Function (anonymous)],
    removeListener: [Function (anonymous)]
  },
  _eventsCount: 2,
  _maxListeners: undefined,
  connection: Connection {
    _events: [Object: null prototype] { error: [Function] },
    _eventsCount: 1,
    _maxListeners: undefined,
    config: ConnectionConfig {
      isServer: undefined,
      stream: undefined,
      host: 'localhost',
      port: 3306,
      localAddress: undefined,
      socketPath: undefined,
      user: 'BackendReadWrite',
      password: 'nG)eS(%+4]78DH9xQvu4',
      password2: undefined,
      password3: undefined,
      passwordSha1: undefined,
      database: 'web_chat_app',
      connectTimeout: 10000,
      insecureAuth: false,
      infileStreamFactory: undefined,
      supportBigNumbers: false,
      bigNumberStrings: false,
      decimalNumbers: false,
      dateStrings: false,
      debug: undefined,
      trace: true,
      stringifyObjects: false,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      timezone: 'local',
      queryFormat: undefined,
      pool: undefined,
      ssl: false,
      multipleStatements: false,
      rowsAsArray: false,
      namedPlaceholders: false,
      nestTables: undefined,
      typeCast: true,
      maxPacketSize: 0,
      charsetNumber: 224,
      compress: false,
      authPlugins: undefined,
      authSwitchHandler: undefined,
      clientFlags: 12252111,
      connectAttributes: [Object],
      maxPreparedStatements: 16000
    },
    stream: Socket {
      connecting: false,
      _hadError: false,
      _parent: null,
      _host: 'localhost',
      _closeAfterHandlingError: false,
      _events: [Object],
      _readableState: [ReadableState],
      _writableState: [WritableState],
      allowHalfOpen: false,
      _maxListeners: undefined,
      _eventsCount: 5,
      _sockname: null,
      _pendingData: null,
      _pendingEncoding: '',
      server: null,
      _server: null,
      autoSelectFamilyAttemptedAddresses: [Array],
      [Symbol(async_id_symbol)]: 3,
      [Symbol(kHandle)]: [TCP],
      [Symbol(lastWriteQueueSize)]: 0,
      [Symbol(timeout)]: null,
      [Symbol(kBuffer)]: null,
      [Symbol(kBufferCb)]: null,
      [Symbol(kBufferGen)]: null,
      [Symbol(shapeMode)]: true,
      [Symbol(kCapture)]: false,
      [Symbol(kSetNoDelay)]: true,
      [Symbol(kSetKeepAlive)]: true,
      [Symbol(kSetKeepAliveInitialDelay)]: 0,
      [Symbol(kBytesRead)]: 0,
      [Symbol(kBytesWritten)]: 0
    },
    _internalId: 0,
    _commands: Denque {
      _capacity: undefined,
      _head: 0,
      _tail: 0,
      _capacityMask: 3,
      _list: [Array]
    },
    _command: undefined,
    _paused: false,
    _paused_packets: Denque {
      _capacity: undefined,
      _head: 0,
      _tail: 0,
      _capacityMask: 3,
      _list: [Array]
    },
    _statements: LRUCache {
      ttl: 0,
      ttlResolution: 1,
      ttlAutopurge: false,
      updateAgeOnGet: false,
      updateAgeOnHas: false,
      allowStale: false,
      noDisposeOnSet: false,
      noUpdateTTL: false,
      maxEntrySize: 0,
      sizeCalculation: undefined,
      noDeleteOnFetchRejection: false,
      noDeleteOnStaleGet: false,
      allowStaleOnFetchAbort: false,
      allowStaleOnFetchRejection: false,
      ignoreFetchAbort: false
    },
    serverCapabilityFlags: 3758096383,
    authorized: true,
    sequenceId: 6,
    compressedSequenceId: 0,
    threadId: 45,
    _handshakePacket: Handshake {
      protocolVersion: 10,
      serverVersion: '8.3.0',
      capabilityFlags: 3758096383,
      connectionId: 45,
      authPluginData1: <Buffer 3b 68 6f 11 59 60 3e 64>,
      authPluginData2: <Buffer 7e 7c 4b 2b 28 13 16 25 04 5a 27 4a 00>,
      characterSet: 255,
      statusFlags: 2,
      autPluginName: 'caching_sha2_password'
    },
    _fatalError: null,
    _protocolError: null,
    _outOfOrderPackets: [],
    clientEncoding: 'utf8',
    packetParser: PacketParser {
      buffer: [],
      bufferLength: 0,
      packetHeaderLength: 4,
      headerLen: 0,
      length: 24,
      largePacketParts: [],
      firstPacketSequenceId: 0,
      onPacket: [Function (anonymous)],
      execute: [Function: executeStart],
      _flushLargePacket: [Function: _flushLargePacket4]
    },
    serverEncoding: 'utf8',
    connectTimeout: null,
    connectionId: 45,
    _authPlugin: [Function (anonymous)],
    [Symbol(shapeMode)]: false,
    [Symbol(kCapture)]: false
  },
  Promise: [Function: Promise],
  [Symbol(shapeMode)]: false,
  [Symbol(kCapture)]: false
}

*/
async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection(CONNECTION_CONFIG);
    return connection;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    // throw error; // Re-throw the error for handling in your application
  }
}

/**
 * 
 * @param {mysql.Connection} connection - An object returned from mysql2.createConnection function call.
 * @description Close a given database connection.
 */
async function closeConnection(connection) {
  try {
    await connection.end();
  } catch (error) {
    console.error(error);
  }
}