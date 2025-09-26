import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs, { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import simpleGit from 'simple-git';
import Stripe from 'stripe';

// --- ES Module setup ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECTS_PATH = path.join(__dirname, 'projects.json');
const TEMP_REPO_DIR = path.join(__dirname, 'temp_repos');

// Ensure temp folder exists
if (!existsSync(TEMP_REPO_DIR)) fs.mkdirSync(TEMP_REPO_DIR, { recursive: true });

// Load .env located in the same directory as this script (server/.env)
dotenv.config({ path: path.join(__dirname, '.env') });
const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(cors());
app.use(express.json());

// ========================
// Stripe Setup
// ========================
// If STRIPE_SECRET_KEY in .env was saved with surrounding quotes, remove them.
const rawKey = process.env.STRIPE_SECRET_KEY || '';
const stripeKey = rawKey.replace(/^"|"$/g, '');
const stripe = new Stripe(stripeKey, { apiVersion: '2022-11-15' });

app.post('/create-checkout-session', async (req, res) => {
  // Accept either projectId (used by frontend now) or weddingId for backwards compat
  const { projectId, weddingId, userId, projectTitle, ticketPrice } = req.body;
  const pid = projectId || weddingId;

  // Validate required fields
  if (!pid || !userId || !projectTitle || !ticketPrice) {
    console.error('Missing fields in create-checkout-session request:', req.body);
    return res.status(400).json({ error: 'Missing required payment fields (projectId, userId, projectTitle, ticketPrice)' });
  }

  // Ensure ticketPrice is a number and positive
  const priceNum = Number(ticketPrice);
  if (Number.isNaN(priceNum) || priceNum <= 0) {
    return res.status(400).json({ error: 'Invalid ticketPrice; must be a positive number' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `${projectTitle} Funding`,
              description: `Funding for ${projectTitle}`,
            },
            unit_amount: Math.round(priceNum * 100), // paise
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:3000/payment-success?projectId=${encodeURIComponent(pid)}&userId=${encodeURIComponent(userId)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: 'http://localhost:3000/cancel',
    });
    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    // If Stripe returns a user-friendly message, forward it
    const message = error && error.message ? error.message : 'Failed to create checkout session';
    res.status(500).json({ error: message });
  }
});

// ...existing code for your other routes (projects, analyze, etc.)

app.listen(5000, () => console.log('Server started on port 5000'));
