"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const websocket_1 = require("websocket");
const http_1 = __importDefault(require("http"));
// Create an HTTP server
const server = http_1.default.createServer((request, response) => {
    console.log(`${new Date()} Received request for ${request.url}`);
    response.writeHead(404);
    response.end();
});
server.listen(8080, () => {
    console.log(`${new Date()} Server is listening on port 8080`);
});
// Create WebSocket server
const wsServer = new websocket_1.server({
    httpServer: server,
    autoAcceptConnections: false,
});
// Function to check if the origin is allowed
function originIsAllowed(origin) {
    // Add logic to restrict allowed origins
    return true;
}
// WebSocket request handler
wsServer.on("request", (request) => {
    if (!originIsAllowed(request.origin)) {
        request.reject();
        console.log(`${new Date()} Connection from origin ${request.origin} rejected.`);
        return;
    }
    const connection = request.accept("echo-protocol", request.origin);
    console.log(`${new Date()} Connection accepted.`);
    // Message handler
    connection.on("message", (message) => {
        if (message.type === "utf8") {
            console.log(`Received Message: ${message.utf8Data}`);
            connection.sendUTF(message.utf8Data);
        }
        else if (message.type === "binary") {
            console.log(`Received Binary Message of ${message.binaryData.length} bytes`);
            connection.sendBytes(message.binaryData);
        }
    });
    // Close connection handler
    connection.on("close", (reasonCode, description) => {
        console.log(`${new Date()} Peer ${connection.remoteAddress} disconnected.`);
    });
});
