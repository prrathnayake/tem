const path = require('path');
require("dotenv").config();
const express = require('express');
const http = require("http");
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser'); 
const app = express();
const mongoose = require('mongoose');
const payrollRoute = require('./routes/payrollRoute.js');
const { setupSocketIoServer } = require('./middleware/websocket-server/socketServer.js');
const { connectToRabbitMQ } = require('./middleware/websocket-server/rabbitmqProducer.js');
require("./middleware/websocket-server/rabbitmqConsumer.js");
const { connection, client } = require('./database/db.js')
//const { connection } = require('./database/dbConnection.js');
const empTaskRoute = require('./routes/empTaskRoute.js');
const userRoute = require('./routes/userRoute.js');
const server = http.createServer(app);

// Setup Socket.IO server
setupSocketIoServer(server);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/payroll', payrollRoute);

app.use('/tasks', empTaskRoute);

app.use('/auth', userRoute);

//testDatabaseConnection();
connection();

//app.use(express.static(path.join(__dirname, 'public/views')));

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/views', express.static(path.join(__dirname, 'views')))

// app.get('/addpayroll', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public/views', 'addpayroll.html'));
// });
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'homeEmployee.html'));
});

app.get('/addpayroll', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'addpayroll.html'));
});

app.get('/viewPayroll', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'viewPayroll.html'));
});

app.get('/updatePayroll', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'updatePayroll.html'));
});

app.get('/viewEmpTask', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'viewEmpTask.html'));
});

app.get('/addEmpTask', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'addTask.html'));
});

app.get('/updateEmpTask', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'updateEmpTask.html'));
});

// app.get('/viewTaskEmployee', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'taskEmployee.html'));
// });

app.get('/viewTaskEmployee', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'viewTaskEmployee.html'));
});


app.get('/viewPayrollEmployee', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'viewPayrollEmployee.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/api/employees', async (req, res) => {
    try {
        await connection();
        const collection = mongoose.connection.collection('employee');
        const queryResult = await collection.find().toArray();
        res.json(queryResult);
        
    } catch (err) {
        console.error('Error: ', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




// app.get('/api/employees', async (req, res) => {
//     let result = await getAllEmployees();
//     console.log(result);
//     res.json(result);
// });

// async function getAllEmployees() {
//     await client.connect();
//     let collection = await client.db('ems').collection('employee');
//     return collection.find({}).toArray();
// }

const PORT = process.env.PORT || 3000;




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});