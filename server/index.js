const express = require("express");
const mysql = require('mysql2');
const app = express();
const PORT = 4000;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'auth_db2'
});

const generateID = () => Math.random().toString(36).substring(2, 10);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/register', (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    // checks if user does not exist
    connection.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, result) => {
            if (err) {
                return res.json({ message: "An error ocurred" });
            }
            // creates the user
            if (result.length === 0) {
                const id = generateID();
                connection.query(
                    "INSERT INTO users (id, firstName, lastName, email, password) VALUES (?, ?, ?, ?, ?)",
                    [id, firstName, lastName, email, password],
                    (err, result) => {
                        if (err) {
                            return res.json({ message: "An error has ocurred" });
                        }
                        return res.json({ message: "Account created succesfully" });
                    } 
                )
            } else {
                // returns an error
                res.json({ message: "User already exists!" });
            }
        }
    );
});

app.post('/login', (req, res) => {
    
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});