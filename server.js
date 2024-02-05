const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const controller = require("./Controller/Task");
const path = require('path');
const app = express();
const port = 4000

app.use(express.json());
app.use(cors());


app.use(express.static(path.join(__dirname + '/public')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '.build', 'index.html'));
// });


const connection = mysql.createPool({
    user: "sql6681691",
    host: "sql6.freesqldatabase.com",
    password: "ySvXL1MT1k",
    database: "sql6681691",
    port: "3306"
})


const dbConnectionMiddleware = (req, res, next) => {
    connection.getConnection((err, connection) => {
        if (err) {
            console.error('Error acquiring connection from pool:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        req.dbConnection = connection;

        next();
    });
};

connection.getConnection((err, connection) => {
    if (err) {
        console.error('Error establishing connection to the database:', err.message);
    } else {
        console.log('Connected to the database');
        connection.release();
    }
});

app.post("/ticket/register", dbConnectionMiddleware, (req, res) => {
    controller.register(req, res);
})

app.post("/ticket/login", dbConnectionMiddleware, (req, res) => {
    controller.login(req, res)
})

app.get("/ticket/getTask", dbConnectionMiddleware, (req, res) => {
    controller.getTask(req, res)
})

app.get("/ticket/getUsers", dbConnectionMiddleware, (req, res) => {
    controller.getUsers(req, res)
})

app.post("/ticket/addTask", dbConnectionMiddleware, (req, res) => {
    controller.addTask(req, res);
})

app.post("/ticket/deleteTask", dbConnectionMiddleware, (req, res) => {
    controller.deleteTask(req, res);
})

app.post("/ticket/archiveTask", dbConnectionMiddleware, (req, res) => {
    const {flag } = req.body;

    if (!flag) {
        controller.archiveTask(req, res);
    }
    else {
        controller.unarchiveTask(req, res);
    }
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})