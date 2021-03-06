// Require the packages we will use:
let http = require("http"),
    socketio = require("socket.io"),
    fs = require("fs"),
    url = require('url'),
    path = require('path'),
    mime = require('mime');

// Listen for HTTP connections.  This is essentially a miniature static file server that only serves our one file, client.html:
let app = http.createServer(function(req, resp){

    var filename = path.join(__dirname, "ChatRoom", url.parse(req.url).pathname);
    (fs.exists || path.exists)(filename, function(exists){
        if (exists) {
            fs.readFile(filename, function(err, data){
                if (err) {
                    // File exists but is not readable (permissions issue?)
                    resp.writeHead(500, {
                        "Content-Type": "text/plain"
                    });
                    resp.write("Internal server error: could not read file");
                    resp.end();
                    return;
                }

                // File exists and is readable
                var mimetype = mime.getType(filename);
                resp.writeHead(200, {
                    "Content-Type": mimetype
                });
                resp.write(data);
                resp.end();
                return;
            });
        }else{
            // File does not exist
            resp.writeHead(404, {
                "Content-Type": "text/plain"
            });
            resp.write("Requested file not found: "+filename);
            resp.end();
            return;
        }
    });

    // This callback runs when a new connection is made to our HTTP server.

    fs.readFile("static/chat.html", function(err, data){
        // This callback runs when the client.html file has been read from the filesystem.

        if(err) return resp.writeHead(500);
        resp.writeHead(200);
        resp.end(data);
    });
});
app.listen(3456);

// Do the Socket.IO magic:
let io = socketio.listen(app);
io.sockets.on("connection", function(socket){
    // This callback runs when a new Socket.IO connection is established.

    socket.on('message_to_server', function(data) {
        // This callback runs when the server receives a new message from the client.

        console.log("message: "+data["message"]); // log it to the Node.JS output
        io.sockets.emit("message_to_client",{message:data["message"],room:data["room"] }) // broadcast the message to other users
    });
});