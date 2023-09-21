const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

// Configure the database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',     // Change this to your MySQL user
  password: '',      // Change this to your MySQL password
  database: 'voting', // Change this to your database name
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:3000' }));

const users = [
    {
      id: 1,
      email: 'user@example.com',
      password: 'password123',
      name: 'John Doe',
    },
    {
        id: 2,
        email: 'user1@example.com',
        password: 'password123',
        name: 'teja',
      },
      {
        id: 3,
        email: 'user2@example.com',
        password: 'password123',
        name: 'teja',
      },
      {
        id: 4,
        email: 'user3@example.com',
        password: 'password123',
        name: 'teja',
      },
      {
        id: 5,
        email: 'user4@example.com',
        password: 'password123',
        name: 'teja',
      },
    // Add more users as needed
  ];


  app.post('/signin', (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if the user exists in the dummy database
      const user = users.find((u) => u.email === email && u.password === password);
  
      if (!user) {
        // User not found or password is incorrect
        res.status(404).json({ message: 'Invalid Username or Password' });
      } else {
        // Login successful, return user data (you may want to exclude the password)
        res.status(201).json(user);
      }
    } catch (error) {
      console.error('Error handling sign-in request:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  


// Route to create a new poll
app.post('/polls', (req, res) => {
  try {
    const { question, options } = req.body;

    // Insert the poll data into the database
    db.query(
      'INSERT INTO polls (question, options) VALUES (?, ?)',
      [question, JSON.stringify(options)],
      (err, result) => {
        if (err) {
          console.error('Error creating poll:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }

        res.status(201).json({ message: 'Poll created successfully', pollId: result.insertId });
      }
    );
  } catch (error) {
    console.error('Error creating poll:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to fetch all polls
app.get('/polls', (req, res) => {
  try {
    // Retrieve all polls from the database
    db.query('SELECT * FROM polls', (err, rows) => {
      if (err) {
        console.error('Error fetching polls:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      res.status(200).json(rows);
    });
  } catch (error) {
    console.error('Error fetching polls:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/polls/:pollId', (req, res) => {
  try {
    const pollId = req.params.pollId;
    console.log("pollid",pollId)
    // Query the database to retrieve a specific poll by pollId
    db.query(
      'SELECT * FROM polls WHERE poll_id = ?',
      [pollId],
      (err, rows) => {
        if (err) {
          console.error('Error fetching poll details:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }

        if (rows.length === 0) {
          res.status(404).json({ error: 'Poll not found' });
        } else {
          const pollData = rows[0];
          console.log("pollData",pollData);
          // Parse the options field as JSON
          pollData.options = JSON.parse(pollData.options);
          res.status(200).json(pollData);
        }
      }
    );
  } catch (error) {
    console.error('Error fetching poll details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/submitPolls', (req, res) => {
  const submittedPoll = req.body;
  console.log(submittedPoll);

  // Ensure submittedPoll is an object
  if (typeof submittedPoll !== 'object') {
    return res.status(400).json({ error: 'Invalid data format' });
  }

  // Insert submitted poll data into the database
  const values = [[submittedPoll.userId, submittedPoll.pollId, submittedPoll.selectedOptionIndex]];
  console.log("values",values)
  db.query(
    'INSERT INTO submitted_polls (user_id, poll_id, selected_option_index) VALUES ?',
    [values],
    (insertErr) => {
      if (insertErr) {
        console.error('Error inserting submitted poll data:', insertErr);
        return res.status(500).json({ error: 'Internal server error' });
      } else {
        console.log("Success");
        res.status(201).json({ message: 'Poll submitted successfully' });
      }
    }
  );
});


app.get('/pollResults/:pollId', (req, res) => {
  const pollId = req.params.pollId;
  // Query the database to get poll results
  db.query(
    'SELECT selected_option_index, COUNT(*) as voteCount FROM submitted_polls WHERE poll_id = ? GROUP BY selected_option_index',
    [pollId],
    (err, results) => {
      if (err) {
        console.error('Error fetching poll results:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.status(200).json(results);
    }
  );
});

// Route to fetch submitted polls for a user
app.get('/user/:userId/submittedPolls', (req, res) => {
  try {
    const userId = req.params.userId;

    // Query the database to retrieve submitted polls for the specified user
    db.query(
      'SELECT poll_id, selected_option_index FROM submitted_polls WHERE user_id = ?',
      [userId],
      (err, rows) => {
        if (err) {
          console.error('Error fetching submitted polls:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }

        res.status(200).json(rows);
      }
    );
  } catch (error) {
    console.error('Error fetching submitted polls:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
