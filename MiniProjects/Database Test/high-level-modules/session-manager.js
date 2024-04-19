/**
 * @module session-manager
 * @description When requests have been handled, these requests certify (when they were sucessful) that the users was logged in or had access to certain conversations. In order not to query the database too often we will store these informations in a Singleton class instance defined in this module. 
 * @exports { SessionManager } moduleExports - 
 */

class SessionManager {
    constructor() {
      if (!SessionManager.instance) {
        SessionManager.instance = this;
        this.sessions = new Map(); 
      }
      return SessionManager.instance;
    }
  
    static getInstance() {
      return SessionManager.instance;
    }
  
    addSession(sessionId, metadata) {
      this.sessions.set(sessionId, metadata);
    }
  
    getSession(sessionId) {
      return this.sessions.get(sessionId);
    }
  
    removeSession(sessionId) {
      this.sessions.delete(sessionId);
    }
  }
  