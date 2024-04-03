const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});
const cors = require("cors");

app.use(cors()); // Allow CORS for all routes

app.get("/", (req, res) => {
  res.send("Hello World");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("mousePosition", (data) => {
    // console.log("mousePosition", data);
    socket.broadcast.emit("mousePositionUpdate", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3000, () => {
  console.log("server is running on port 3000");
});
