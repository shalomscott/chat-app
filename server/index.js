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
    io.emit("start_typing", username);
  });

  socket.on("stop_typing", (username) => {
    io.emit("stop_typing", username);
  });
});

http.listen(3000, () => {
  console.log("listening on port 3000");
});
