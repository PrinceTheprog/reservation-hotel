// server.js
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;



app.use(cors());
app.use(bodyParser.json());

// Configurer la connexion MySQL
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',       // Utilisateur par défaut de MySQL
  password: '',       // Mot de passe de l'utilisateur MySQL
  database: 'mydatabase' // Nom de la base de données
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to database');
});



// Créer un nouvel utilisateur
app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  db.query(sql, [username, email, password], (err, result) => {
    if (err) throw err;
    res.send('User registered');
  });
});

// Connexion utilisateur
app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.send(''+email);
      res.send(''+email);
    } else {
      res.send('Invalid credentials');
    }
  });
});

// Route pour récupérer les données de l'hôtel
app.get('/hotels', (req, res) => {
    const sql = 'SELECT * FROM hotel'; // Remplacer par votre requête SQL
  
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération des données:', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des données' });
        return;
      }
  
      res.json(results);
    });
  });


  app.post('/reservations', (req, res) => {
    const { user_email, hotel_id, start_date, end_date } = req.body;
  
    const query = 'INSERT INTO reservations (user_email, hotel_id, start_date, end_date) VALUES (?, ?, ?, ?)';
  
    db.query(query, [user_email, hotel_id, start_date, end_date], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error saving reservation');
      }
  
      const reservationId = result.insertId;
  
      // You can now fetch the reservation if needed
      const selectQuery = 'SELECT * FROM reservations WHERE id = ?';
      db.query(selectQuery, [reservationId], (err, rows) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error fetching reservation');
        }
  
        res.status(201).json(rows[0]);
      });
    });
  });


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
