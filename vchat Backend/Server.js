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


const port = process.env.PORT || 8080

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
