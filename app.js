const express = require('express');
const mysql = require('mysql2');
const app = express();

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'c237_musichub'
});
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Set up view engine
app.set('view engine', 'ejs');

// Enable static files
app.use(express.static('public'));

// Enable form processing
app.use(express.urlencoded({ extended: false }));

// Define routes
app.get('/', (req, res) => {
  const sql = 'SELECT * FROM songs';
  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Database query error:', error.message);
      return res.status(500).send('Error retrieving songs');
    }
    res.render('index', { songs: results });
  });
});

app.get('/song/:id', (req, res) => {
  const songId = req.params.id;
  const sql = 'SELECT * FROM songs WHERE songId = ?';
  connection.query(sql, [songId], (error, results) => {
    if (error) {
      console.error('Database query error:', error.message);
      return res.status(500).send('Error retrieving song by ID');
    }
    if (results.length > 0) {
      res.render('song', { song: results[0] });
    } else {
      res.status(404).send('Song not found');
    }
  });
});

app.get('/addSong', (req, res) => {
  res.render('addSong');
});

app.post('/addSong', (req, res) => {
  const { title, artist, album, genre, comment } = req.body;

  const sql = 'INSERT INTO songs (title, artist, album, genre, comment) VALUES (?, ?, ?, ?, ?)';
  connection.query(sql, [title, artist, album, genre, comment], (error, results) => {
    if (error) {
      console.error("Error adding song:", error);
      res.status(500).send('Error adding song');
    } else {
      res.redirect('/');
    }
  });
});

app.get('/editSong/:id', (req, res) => {
  const songId = req.params.id;
  const sql = 'SELECT * FROM songs WHERE songId = ?';
  connection.query(sql, [songId], (error, results) => {
    if (error) {
      console.error('Database query error:', error.message);
      return res.status(500).send('Error retrieving song by ID');
    }
    if (results.length > 0) {
      res.render('editSong', { song: results[0] });
    } else {
      res.status(404).send('Song not found');
    }
  });
});

app.post('/editSong/:id', (req, res) => {
  const songId = req.params.id;
  const { title, artist, album, genre, comment } = req.body;
  const sql = 'UPDATE songs SET title = ?, artist = ?, album = ?, genre = ?, comment = ? WHERE songId = ?';
  connection.query(sql, [title, artist, album, genre, comment, songId], (error, results) => {
    if (error) {
      console.error('Database query error:', error.message);
      return res.status(500).send('Error updating song');
    }
    res.redirect('/');
  });
});

app.get('/deleteSong/:id', (req, res) => {
  const songId = req.params.id;
  const sql = 'DELETE FROM songs WHERE songId = ?';
  connection.query(sql, [songId], (error, results) => {
    if (error) {
      console.error('Database query error:', error.message);
      return res.status(500).send('Error deleting song');
    }
    res.redirect('/');
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
