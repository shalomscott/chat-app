const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const uuid = require("uuid").v4;

io.on("connection", (socket) => {
  socket.on("outgoingMessage", (message) => {
    message.id = uuid();
    message.timestamp = new Date().getTime();
    io.emit("incomingMessage", message);
  });

  socket.on("ack", (messageId) => io.emit("ack", messageId));

  socket.on("start_typing", (username) => {
    console.log("got started typing from " + username);
    io.emit("start_typing", username);
  });
  socket.on("stop_typing", (username) => {
    console.log("got stopped typing from " + username);
    io.emit("stop_typing", username);
  });
});

http.listen(3000, () => {
  console.log("listening on port 3000");
});
