const express = require('express');
const dotenv = require('dotenv');
const connectToMongo = require('./db');
const cors = require('cors');


dotenv.config();
const app = express();
connectToMongo();
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use("/api/auth", require("./Routes/auth"));
app.use("/api/chats", require("./Routes/Chats"));
app.use("/api/message", require("./Routes/Message"));


const port = process.env.PORT || 8080

const server=app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

const io = require("socket.io")(server, {
    PingTimeout: 60000,
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log("Connected with socket.io");
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        console.log("Joined " + userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room)
        console.log("User Joined " + room);
    });

    socket.on("new message", (newMessage) => {
        var chat = newMessage.chat;
        if (!chat.users) return console.log("Chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessage.sender._id) return;
            console.log(user._id, newMessage);
            socket.in(user._id).emit("message received", newMessage);
        });
    }
    );
});
