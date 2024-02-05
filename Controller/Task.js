const register = (req, res) => {
    const connection = req.dbConnection;
    const { name, email, password, admin } = req.body;
    connection.query("INSERT INTO Users (Username, email, password , Admin) VALUES (?,?,?,?)", [name, email, password, admin],
        (err, result) => {
            if (result) {

                res.status(200).json({ message: 'User registered successfully' });
            } else {
                res.status(400).json({ message: 'Registration failed. Please check your data and try again.' });
            }
        });
}

const login = (req, res) => {
    const connection = req.dbConnection;
    const { email, password } = req.body;
    connection.query("SELECT Username ,Admin FROM Users WHERE email = ? AND password = ?", [email, password],
        (err, result) => {
            connection.release();
            if (err) {
                req.setEncoding({ err: err });
            } else {
                if (result.length > 0) {
                    res.send(result[0]);
                } else {
                    res.status(400).json({ message: "WRONG Email OR PASSWORD!" });
                }
            }
        }
    )
}

const getTask = async (req, res) => {
    const connection = req.dbConnection;
    connection.query('SELECT * FROM Tasks', (tasksError, tasksResult) => {
        if (tasksError) {
            console.error('Error retrieving Tasks:', tasksError.message);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query('SELECT * FROM Atasks', (atasksError, atasksResult) => {
            if (atasksError) {
                console.error('Error retrieving Atasks:', atasksError.message);
                res.status(500).send('Internal Server Error');
                return;
            }

            const combinedResults = {
                Tasks: tasksResult,
                Atasks: atasksResult
            };

            // Send the combined results as JSON
            res.json(combinedResults);
        });
        connection.release();
    });


}

const getUsers = (req, res) => {
    const connection = req.dbConnection;
    connection.query("SELECT Username FROM Users", [],
        (err, result) => {
            if (err) {
                req.setEncoding({ err: err });
            } else {
                connection.release();
                if (result.length > 0) {
                    const outputArray = result.map(item => item.Username);
                    res.send(outputArray);
                } else {
                    res.status(400).json({ message: "No Data!" });
                }
            }
        }
    )
}

const addTask = (req, res) => {
    const connection = req.dbConnection;
    const { name, desc, assigne } = req.body;
    connection.query("INSERT INTO Tasks(Taskname, Description, Assigne) VALUES (?,?,?)", [name, desc, assigne],
        (err, result) => {
            if (result) {
                connection.release();
                res.status(200).json({ message: 'Task added successfully' });
            } else {
                res.status(400).json({ message: 'Task addition failed. Please check your data and try again.' });
            }
        });
}

const deleteTask = (req, res) => {
    const connection = req.dbConnection;
    const { id } = req.body;
    connection.query("DELETE FROM Tasks WHERE TaskId = ?", [id],
        (err, result) => {
            if (result) {
                connection.release();
                res.status(200).json({ message: 'Task deleted successfully' });
            } else {
                res.status(400).json({ message: 'Task deletion failed. Please check your data and try again.' });
            }
        });
}

const archiveTask = (req, res) => {
    const connection = req.dbConnection;
    const {id} = req.body;
    connection.query('INSERT INTO Atasks SELECT * FROM Tasks WHERE TaskId = ?',
        [id],
        (err, result) => {
            if (result) {
                connection.query('DELETE FROM Tasks WHERE TaskId = ?', [id]);
                res.status(200).json({ message: 'Task Archived.' })
            } else {
                res.status(400).json({ message: 'Task Archive failed. Please check your data and try again.' });
            }
            connection.release();
        });

}

const unarchiveTask = (req, res) => {
    const connection = req.dbConnection;
    const {id} = req.body;
    connection.query('INSERT INTO Tasks SELECT * FROM Atasks WHERE TaskId = ?',
        [id],
        (err, result) => {
            if (result) {
                connection.query('DELETE FROM Atasks WHERE TaskId = ?', [id]);
                res.status(200).json({ message: 'Task Unarchived.' })
            } else {
                res.status(400).json({ message: 'Task Unarchive failed. Please check your data and try again.' });
            }
            connection.release();
        });

}





module.exports = {
    register,
    login,
    getTask,
    getUsers,
    addTask,
    deleteTask,
    archiveTask,
    unarchiveTask

}