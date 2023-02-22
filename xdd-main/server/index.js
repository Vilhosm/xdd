const express = require("express");
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
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

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'POST, PUT, PATCH, GET, DELETE, OPTIONS');
    next();
})

app.get('/signup', async (_req, res) => {
    const url = 'https://localhost/users/';

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }

        const result = await response.json();
        return res.json(result);
    } catch (error) {
        return res.status(500).json({error: 'An error ocurred'});
    }
});


app.post('/signup', (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // checks if user does not exist
    connection.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, result) => {
            if (err) {
                return res.json({ message: "An error ocurred" });
            }

            const nameRegex = /^[a-zA-Z\s]*$/;
            if (!firstName.match(nameRegex) || !lastName.match(nameRegex)) {
                return res.json({ message: "Invalid name format. Only letters and spaces allowed." });
            }

            const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            if (!validEmail) {
                return res.json({ message: "Email has an invalid format" });
            }

            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,20}$/;
            if (!passwordRegex.test(password)) {
                return res.json({ message: "Password must be 4-20 characters and contain at least one lowercase letter, one uppercase letter, and one special character!" });
            }

            if (password !== confirmPassword) {
                return res.json({ message: "Passwords do not match" });
            }
            // creates the user
            if (result.length === 0) {

                bcrypt.hash(password, 10, function(err, hashedPassword) {
                    if (err) {
                        return res.json({ message: "An error ocurred" });
                    }
                    const id = generateID();
                    connection.query(
                        "INSERT INTO users (id, firstName, lastName, email, password) VALUES (?, ?, ?, ?, ?)",
                        [id, firstName, lastName, email, hashedPassword],
                        (err, result) => {
                            if (err) {
                                return res.json({ message: "An error has ocurred" });
                            }
                            return res.json({ message: "Account created succesfully" });
                        } 
                    )
                });               
            } else {
                // returns an error
                res.json({ message: "User already exists!" });
            }
        }
    );
});

app.post('/signin', (req, res) => {
    
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});