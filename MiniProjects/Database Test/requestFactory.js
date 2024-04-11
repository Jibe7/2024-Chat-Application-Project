/**
 * @module requestFactory
 * @description For this web chat application, the client will send requests that will be handled by the server. 
 * This module defines a class for instantiating requests.
 * @exports { requestHandler } moduleExports - 
 */

class requestFactory {

    static createNewRequest(type, sessions, requestType, inputData, default_response, uuid) {
        let request;
        switch (type) { // we will set request to request = Request(...), request = RegistrationRequest(...) etc
            case "Registration":
                break;
            case "Login":
                break;
            case "CreateConv":
                break;
            case "SendMsg":
                break;
            case "GetMsg":
                break;
        }
        return request;
    }
}