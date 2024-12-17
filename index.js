const express = require("express");
const app = express();
const port = 3000;

// Middleware for parsing JSON
app.use(express.json());

// Sample in-memory user data
let users = [
  { id: "1", firstName: "Anshika", lastName: "Agarwal", hobby: "Teaching" },
];

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});


// GET /users - Fetch all users
app.get("/users", (req, res) => {
  res.status(200).json(users);
});

// GET /users/:id - Fetch a user by ID
app.get("/users/:id", (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.status(200).json(user);
});

// POST /user - Add a new user
app.post("/user", (req, res) => {
  const { id, firstName, lastName, hobby } = req.body;

  // Validation
  if (!id || !firstName || !lastName || !hobby) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const newUser = { id, firstName, lastName, hobby };
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT /user/:id - Update a user
app.put("/user/:id", (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, hobby } = req.body;

  const user = users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Validation
  if (!firstName || !lastName || !hobby) {
    return res.status(400).json({ error: "All fields are required" });
  }

  user.firstName = firstName;
  user.lastName = lastName;
  user.hobby = hobby;

  res.status(200).json(user);
});

// DELETE /user/:id - Delete a user
app.delete("/user/:id", (req, res) => {
  const { id } = req.params;
  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  users.splice(userIndex, 1);
  res.status(200).json({ message: "User deleted successfully" });
});

// Start server
app.listen(3000, () => {
  console.log("Server running on 3000");
});
