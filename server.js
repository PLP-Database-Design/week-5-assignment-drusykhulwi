// Declare dependencies / Variables

const express = require('express'); //declaring express
const app = express(); //calling it
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

app.use(express.json());
app.use(cors());
dotenv.config();

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Connect to the database ***

const db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
    
//Check if db connection works
db.connect((err) => {
    // Not connected
    if(err) return console.log("Error connecting to the mysql database");

    //Connected
    console.log("Connected to mysql db successfully as id: ", db.threadId);

    // Question 1: Retrieve all patients
    app.get('/patients', (req, res) => {
        const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
        db.query(query, (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error retrieving patients');
            } else {
                res.render('patients', { patients: results });
            }
        });
    });

    // Question 2: Retrieve all providers
    app.get('/providers', (req, res) => {
        const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
        db.query(query, (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error retrieving providers');
            } else {
                res.render('providers', { providers: results });
            }
        });
    });

    // Question 3: Filter patients by First Name
    app.get('/filteredPatients', (req, res) => {
        const firstName = req.query.firstName;
        if (!firstName) {
            return res.status(400).send('First name is required');
        }
        const query = 'SELECT * FROM patients WHERE first_name = ?';
        db.query(query, [firstName], (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error filtering patients');
            } else {
                res.render('filteredPatients', { patients: results, firstName: firstName });
            }
        });
    });

    // Question 4: Retrieve all providers by their specialty
    app.get('/specialtyProviders', (req, res) => {
        const specialty = req.query.specialty;
        if (!specialty) {
            return res.status(400).send('Specialty is required');
        }
        const query = 'SELECT * FROM providers WHERE provider_specialty = ?';
        db.query(query, [specialty], (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error retrieving providers by specialty');
            } else {
                res.render('specialtyProviders', { providers: results, specialty: specialty });
            }
        });
    });

    app.listen(process.env.PORT, () => {
        console.log(`Server listening on port ${process.env.PORT}`);

        //Send a message to the browser
        console.log('Sending message to browser...');
        app.get('/', (req,res) => {
            res.send('Server started successfully! Wedding can go on!')
        })
    });
});