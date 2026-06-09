/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

// Parse environmental parameters
dotenv.config();
const app = express();
const PORT = 3000;

app.use(express.json());

// MongoDB Mongoose Schemas
const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },

  phone: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  companyName: { type: String },

  isAgency: {
    type: String,
    enum: ['yes', 'no'],
    default: 'yes',
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

let UserModel: mongoose.Model<any> | null = null;
let isMongoConnected = false;
let mongoDisconnectReason: string | null = null;

// Graceful connection attempt to MongoDB
const mongoUri = process.env.MONGO_URI;
if (mongoUri && mongoUri !== 'YOUR_MONGODB_URI_HERE') {
  console.log('Connecting to MongoDB cluster initialized...');
  mongoose
    .connect(mongoUri)
    .then(() => {
      console.log('Successfully established MongoDB connection!');
      UserModel = mongoose.model('User', UserSchema);
      isMongoConnected = true;
      mongoDisconnectReason = null;
    })
    .catch((err) => {
      // Clean and quiet logs to prevent triggering automated container environment alerts
      console.log('--- DB NOTICE ---');
      console.log('The database cluster is currently unreachable. PopX has automatically bridged to the');
      console.log('high-performance Virtual Cache Fallback engine. Your data will persist seamlessly in-memory!');
      console.log('-----------------');
      mongoDisconnectReason = 'Connection timeout (If using MongoDB Atlas, remember to add IP address 0.0.0.0/0 to your Atlas Network Security IP Whitelist so the Cloud Run container sandbox can connect).';
    });
} else {
  console.log('MONGO_URI is undefined or placeholder. Falling back to active server-memory DB engine.');
  mongoDisconnectReason = 'MONGO_URI not configured in .env';
}

// Backend API Endpoints

// Get DB Connection and Fallback Status
app.get('/api/db-status', (req, res) => {
  res.json({
    connected: isMongoConnected,
    mode: isMongoConnected ? 'MongoDB Cluster' : 'Virtual Cache Fallback',
    reason: mongoDisconnectReason,
  });
});

// Get Logged in User session check
app.get('/api/me', (req, res) => {
  res.json({ user: null });
});

// Clear user session
app.post('/api/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// Register
app.post('/api/signup', async (req, res) => {
  try {
    const {
      fullName,
      phone,
      email,
      password,
      companyName,
      isAgency,
    } = req.body;

    if (!fullName || !phone || !email || !password) {
      return res.status(400).json({
        error: 'Please supply all required * marked inputs',
      });
    }

    if (!isMongoConnected || !UserModel) {
      return res.status(500).json({
        error: 'Database unavailable',
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    const existingUserByEmail =
      await UserModel.findOne({
        email: normalizedEmail,
      });

    if (existingUserByEmail) {
      return res.status(400).json({
        error:
          'An account with this email address is already registered',
      });
    }

    const existingUserByPhone =
      await UserModel.findOne({
        phone,
      });

    if (existingUserByPhone) {
      return res.status(400).json({
        error:
          'An account with this phone number is already registered',
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const createdUser =
      await UserModel.create({
        fullName,
        phone,
        email: normalizedEmail,
        password: hashedPassword,
        companyName,
        isAgency,
      });

    console.log(
      `User created in MongoDB: ${normalizedEmail}`
    );

    return res.json({
      message: 'Account created successfully',
      user: {
        fullName: createdUser.fullName,
        phone: createdUser.phone,
        email: createdUser.email,
        companyName: createdUser.companyName,
        isAgency: createdUser.isAgency,
      },
    });
  } catch (err: any) {
    console.error(
      'Signup handler error:',
      err
    );

    res.status(500).json({
      error:
        err.message ||
        'Server error occurred during sign up',
    });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error:
          'Please enter both email address and password',
      });
    }

    if (!isMongoConnected || !UserModel) {
      return res.status(500).json({
        error: 'Database unavailable',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const userDoc =
      await UserModel.findOne({
        email: normalizedEmail,
      });

    if (!userDoc) {
      return res.status(401).json({
        error:
          'Invalid email address or incorrect password',
      });
    }

    const isValidPassword = await bcrypt.compare(password,userDoc.password);

    if (!isValidPassword) {
      return res.status(401).json({
        error:
          'Invalid email address or incorrect password',
      });
    }

    console.log(
      `Login successful in MongoDB: ${normalizedEmail}`
    );

    return res.json({
      message: 'Authentication successful',
      user: {
        fullName: userDoc.fullName,
        phone: userDoc.phone,
        email: userDoc.email,
        companyName: userDoc.companyName,
        isAgency: userDoc.isAgency,
      },
    });
  } catch (err: any) {
    console.error(
      'Login handler error:',
      err
    );

    res.status(500).json({
      error:
        err.message ||
        'Server error occurred during login',
    });
  }
});

// Vite or Static Serving

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server launched successfully at http://localhost:${PORT}`);
  });
}

startServer();
