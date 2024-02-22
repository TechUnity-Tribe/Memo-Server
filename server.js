const express = require("express");
require("dotenv").config();
const cors = require("cors");
const logger = require("morgan");
const session = require("express-session");
const http = require("http");
const socketIo = require('socket.io');
const dbConnect = require("./src/config/database");
const authRoute = require("./src/routes/auth.route");
const messageRoute = require("./src/routes/message.route");


dbConnect();
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3500;

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use('/api/auth', authRoute);
app.use('/api', messageRoute);


io.on('connection', (socket) => {
    console.log('User connected: ' + socket.id);

    socket.on('login', (email) => {
        console.log('User logged in: ' + email);

        socket.emit('loginNotification', {
            message: `User ${email} has logged in.`
        });
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('typing', () => {
        socket.broadcast.emit('user typing', socket.id);
    });

    socket.on('stop typing', () => {
        socket.broadcast.emit('user stop typing', socket.id);
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('user disconnected', socket.id);
        console.log('User disconnected');
    });
});

app.get('/', (req, res) => {
    res.send("Server is running Successfully...")
})


app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})