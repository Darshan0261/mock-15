const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const { PORT } = require('./configs/config');
const { connection } = require('./configs/db');
const userRouter = require('./routes/users.route');
const contactRouter = require('./routes/contact.route');
const messagesRouter = require('./routes/messages.router');
const cookieParser = require('cookie-parser');
const { MessageModel } = require('./models/Message.model');

const app = express();

app.use(express.json());
app.use(cors({
    origin: '*'
}));
app.use(cookieParser())

app.use('/users', userRouter);
app.use('/contacts', contactRouter);
app.use('/messages', messagesRouter)

app.get('/', (req, res) => {
    res.send('Base API Endpoint')
})

const httpServer = http.createServer(app);

httpServer.listen(PORT, async () => {
    try {
        await connection;
        console.log('Connected to DB');
    } catch (error) {
        console.log(error);
        console.log('Cannot connect to DB');
    }
    console.log(`Server running on port ${PORT}`)
});

const io = new Server(httpServer);

io.on('connection', (socket) => {
    socket.on('join', (email) =>  {
        socket.join(email)
    })

    socket.on('send_message', async (data) => {
        const message = new MessageModel({
            message: data.message,
            sender_email: data.sender_email, 
            recipent_email: data.recipent_email,
            time: new Date()
        });
        socket.to(data.recipent_email).emit('get_message', message);
        await message.save()
    })
})