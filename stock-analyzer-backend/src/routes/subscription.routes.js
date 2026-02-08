import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Placeholder - implement controllers in src/controllers/subscription.controller.js
router.get('/plans', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'Basic', price: 9.99, features: ['AI Predictions', 'Real-time data'] },
      { id: 2, name: 'Pro', price: 29.99, features: ['Everything in Basic', 'Advanced AI', 'Priority support'] },
      { id: 3, name: 'Elite', price: 99.99, features: ['Everything in Pro', 'API access', 'Dedicated support'] }
    ]
  });
});

router.post('/subscribe', protect, (req, res) => {
  res.json({ success: true, message: 'Subscribe endpoint - implement controller' });
});

router.get('/my', protect, (req, res) => {
  res.json({ success: true, data: [], message: 'My subscriptions endpoint - implement controller' });
});

router.post('/cancel', protect, (req, res) => {
  res.json({ success: true, message: 'Cancel subscription endpoint - implement controller' });
});

export default router;
