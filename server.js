const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Load JSON data
const getUsers = () => {
    try {
        return JSON.parse(fs.readFileSync('users.json', 'utf8'));
    } catch (err) {
        console.error("Error reading users.json:", err);
        return { employees: [] }; // Return an empty array if there's an error
    }
};

// Save JSON data
const saveUsers = (data) => {
    fs.writeFileSync('users.json', JSON.stringify(data, null, 2));
};

// Routes

// 1. Get list of users
app.get('/users', (req, res) => {
    const data = getUsers();
    console.log("Fetching users: ", data); // Debugging log
    res.json(data.employees);
});

// 2. Get a single user by ID
app.get('/users/:id', (req, res) => {
    const data = getUsers();
    const user = data.employees.find(emp => emp.id === parseInt(req.params.id));
    if (user) {
        res.json(user);
    } else {
        res.status(404).send({ error: 'User not found' });
    }
});

// 3. Insert a user
app.post('/users', (req, res) => {
    const data = getUsers();
    const newUser = req.body;
    newUser.id = data.employees.length + 1; // Assign new ID
    data.employees.push(newUser);
    saveUsers(data);
    res.status(201).json(newUser);
});

// 4. Delete a user by ID
app.delete('/users/:id', (req, res) => {
    const data = getUsers();
    const userIndex = data.employees.findIndex(emp => emp.id === parseInt(req.params.id));
    if (userIndex !== -1) {
        const deletedUser = data.employees.splice(userIndex, 1);
        saveUsers(data);
        res.json(deletedUser);
    } else {
        res.status(404).send({ error: 'User not found' });
    }
});

// 5. Get Company Name
app.get('/company', (req, res) => {
    const data = getUsers();
    res.json({ companyName: data.companyName });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
