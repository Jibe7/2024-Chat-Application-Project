/**
 * @module request
 * @description For this web chat application, the client will send requests that will be handled by the server. This module defines a class for the different type of requests that can be made and handled.
 * @exports { Request, RegistrationRequest, LoginRequest, CreateConvRequest, SendMsgRequest, GetMsgRequest } moduleExports - 
 */

class Request {
    static currentSessions;
    type; // type of request
    #session; // session, identify a client (use cookies or other alternatives)
    #client_data; // represents username / passwords, message content...
    #response; // the response that will be sent to the client
    #uuid; // unique request id
    #state; // state of the request, was it fullfilled ?

    constructor (sessions, requestType, inputData, default_response, uuid) {
        this.currentSessions = sessions;
        this.type = requestType;
        this.#client_data = inputData;
        this.#response = default_response;
        this.#uuid = uuid;
        this.#state = 0;
    }

    #execute(...args) {
        throw new Error("handleRequest() method must be implemented");
    }

    #answerClient(...args) {
        throw new Error("area() method must be implemented");
    }

    get uuid() {
        return this.#uuid;
    }
}

class RegistrationRequest extends Request {
    constructor(sessions, inputData, default_response, uuid) {
        super(sessions, "Registration", inputData, default_response, uuid)
    }

    #execute(username, password) {
        // Username Check

        // Respond to the client if the username already exists. Using #answerClient 

        // Password Check (FUTURE, not created yet. It could be check that it is a certain length and contain certain characters...)

        // Update the database

        // Respond to the client that he has been registered successfully ! Using #answerClient

    }

    #answerClient(isUsernameAvailable) {
        if (isUsernameAvailable) {

        } else {

        }
    // Update the request state
    }
}

class LoginRequest extends Request {
    constructor(sessions, inputData, default_response, uuid) {
        super(sessions, "Login", inputData, default_response, uuid)
    }

    #execute(username, password) {
        // Username & Password checks

        
        // Respond to the client that he has been logged successfully ! Or that loggin has failed. Sends him the conversation web page. Using #answerClient

        // Update the session-manager so that we won't have to check the passwords in the database for this session.
    }

    #answerClient(isPasswordCorrect) {
        if (isPasswordCorrect) {

        } else {

        }
        // Update the request state
    }
}

class CreateConvRequest extends Request {
    constructor(sessions, inputData, default_response, uuid) {
        super(sessions, "CreateConv", inputData, default_response, uuid)
    }

    #execute(authorized_users) {
        // Verify that the session corresponds to a authentified session.

        
        // Respond to the client that he needs to be logged in if he is not authentified. Using #answerClient

        // Else create the new conversation with authorized users and sends him the conversation data (new empty conversation in his conversation list)

        // Update the session-manager if the last request was made more than 30minutes ago (FUTURE we will probably disconnect sessions after a time of inactivity).
    }

    #answerClient(isPasswordCorrect) {
        if (isPasswordCorrect) {

        } else {

        }
    }
}

class SendMsgRequest extends Request {
    constructor(sessions, inputData, default_response, uuid) {
        super(sessions, "SendMsg", inputData, default_response, uuid)
    }

    #execute(msg_content, conversation_id) {
        // Check that the session has access to this conversation in the session manager.

        // If not, check in the database.

        // If not again, send him an error (he does not have access to this conversation)
        
        // If yes, update the database and if someone else that has access to this conversation is logged in, send him the msg.
    }

    #answerClient(hasAccessToConv) {
        if (hasAccessToConv) {

        } else {

        }
    }
}

class GetMsgRequest extends Request {
    constructor(sessions, inputData, default_response, uuid) {
        super(sessions, "GetdMsg", inputData, default_response, uuid)
    }

    #execute(msg_content, conversation_id) {
        // Check that the session has access to this conversation in the session manager.

        // If not, check in the database.

        // If not again, send him an error (he does not have access to this conversation)
        
        // If yes, send him the messages of the conversation.
    }

    #answerClient(hasAccessToConv) {
        if (hasAccessToConv) {

        } else {

        }
    }
}