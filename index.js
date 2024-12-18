const express = require("express");
const mongoose = require("mongoose");
const app = express();


// Middleware for parsing JSON
app.use(express.json());

// Connect to MongoDB using Mongoose
mongoose.connect("mongodb://localhost:27017/usersDB");

// Define a Mongoose schema and model for User
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  hobby: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// GET / - Fetch all users
app.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// GET /users - Fetch all users

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// GET /users/:id - Fetch a user by ID
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// POST /user - Add a new user
app.post("/user", async (req, res) => {
  const { id, firstName, lastName, hobby } = req.body;

  // Validation
  if (!id || !firstName || !lastName || !hobby) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newUser = new User({ id, firstName, lastName, hobby });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: "User with this ID already exists" });
    } else {
      res.status(500).json({ error: "Failed to create user" });
    }
  }
});

// PUT /user/:id - Update a user
app.put("/user/:id", async (req, res) => {
  const { firstName, lastName, hobby } = req.body;

  // Validation
  if (!firstName || !lastName || !hobby) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const user = await User.findOneAndUpdate(
      { id: req.params.id },
      { firstName, lastName, hobby },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

// DELETE /user/:id - Delete a user
app.delete("/user/:id", async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Start server
app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});
