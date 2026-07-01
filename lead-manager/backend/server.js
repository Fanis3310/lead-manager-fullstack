require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Lead = require('./models/Lead');

const app = express();
const PORT = process.env.PORT || 8080;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const VALID_STATUSES = ['New', 'Engaged', 'Proposal Sent', 'Closed-Won', 'Closed-Lost'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Middleware (allows the frontend and backend to communicate)
app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json({ limit: '10kb' }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

function validateLeadInput({ name, email, status }) {
  if (!name || typeof name !== 'string' || !name.trim()) {
    return 'Name is required.';
  }
  if (name.trim().length > 200) {
    return 'Name must be 200 characters or fewer.';
  }
  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return 'A valid email is required.';
  }
  if (status !== undefined && status !== null && status !== '' && !VALID_STATUSES.includes(status)) {
    return 'Invalid status value.';
  }
  return null;
}

// ENDPOINT 1: Create a new lead (POST /leads)
app.post('/leads', async (req, res) => {
  try {
    const { name, email, status } = req.body;
    const validationError = validateLeadInput({ name, email, status });
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const newLead = new Lead({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      ...(status ? { status } : {}),
    });
    const savedLead = await newLead.save();
    res.status(201).json(savedLead);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'This email is already registered.' });
    }
    console.error('POST /leads error:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
});

// ENDPOINT 2: Fetch all leads (GET /leads)
app.get('/leads', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 }); // Newest first
    res.status(200).json(leads);
  } catch (error) {
    console.error('GET /leads error:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
});

// ENDPOINT 3: Update a lead (PUT /leads/:id)
app.put('/leads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid lead ID.' });
    }

    const { name, email, status } = req.body;
    const validationError = validateLeadInput({ name, email, status });
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const updateData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      ...(status ? { status } : {}),
    };

    const updated = await Lead.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ error: 'Lead not found.' });
    }
    res.status(200).json(updated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'This email is already registered.' });
    }
    console.error('PUT /leads/:id error:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
});

// ENDPOINT 4: Delete a lead (DELETE /leads/:id)
app.delete('/leads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid lead ID.' });
    }
    const deleted = await Lead.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Lead not found.' });
    }
    res.status(200).json({ message: 'Lead deleted.' });
  } catch (error) {
    console.error('DELETE /leads/:id error:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
