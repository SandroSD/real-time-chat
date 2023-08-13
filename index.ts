import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const PORT = 3000;

const app = express();

app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173"]
  }
});

io.on("connection", (socket) => {
    console.log("USER CONNECTED", socket.id);
    socket.on("join_room", (data) => {
      socket.join(data);
      console.log("User Joined Room No: " + data);
    });
    socket.on("send_message", (data) => {
      console.log("User Send Message", data);
      socket.to(data.room).emit("receive_message", data.content);
    });
    socket.on("disconnect", () => {
      console.log("USER DISCONNECTED");
    });
  });

httpServer.listen(PORT, () => console.log(`App started on port ${PORT}`));