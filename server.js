const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');


const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname));


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Test123!', // use your MySQL password if needed
  database: 'userDB'
});


app.get('/hello-user', (req, res) => {
  const sql = 'SELECT * FROM users LIMIT 1';


  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }

    if (results.length === 0) {
      return res.send('No users found');
    }


    const user = results[0];
    res.send(`Hello, ${user.first_name}!`);
  });
});


const crypto = require('crypto');
app.post('/login', (req, res) => {
const username = req.body.username;
console.log(username);
console.log(req.body.password);
const hashedPassword = crypto
.createHash('sha256')
.update(req.body.password)
.digest('hex');
const sql = `
SELECT * FROM users
WHERE username = ? AND password = ?
`;
db.query(sql, [username, req.body.password], (err, results) => {
if (err) {
console.error(err);
return res.status(500).send('Server error');
}
if (results.length > 0) {
res.send(`Welcome back, ${results[0].first_name}!`);
} else {
res.send('Invalid username or password.');
}
});
});


//create-user 
app.post('/create-user', (req, res) => {
  const { username, password, first_name, last_name, birthday } = req.body;

  if (!username || !password || !first_name || !last_name || !birthday) {
    return res.status(400).send('All fields are required.');
  }

  const hashedPassword = crypto
    .createHash('sha256')
    .update(password)
    .digest('hex');

  const sql = `
    INSERT INTO users (username, password, first_name, last_name, birthday)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [username, hashedPassword, first_name, last_name, birthday],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error creating user.');
      }

      res.send('User created successfully!');
    }
  );
});


app.use((req, res) => {
  res.status(404).send('Not Found');
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

