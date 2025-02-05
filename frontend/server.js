const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/ecomplatform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Registration route
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  console.log('Registration attempt for email:', email);

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      email,
      password: hashedPassword
    });

    await user.save();
    console.log('User registered successfully');
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt for email:', email);

  try {
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    console.log('Stored password (hashed):', user.password);

    if (!user.password) {
      return res.status(400).json({ message: 'User password not set' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch ? 'Yes' : 'No');

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', userId: user._id });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});