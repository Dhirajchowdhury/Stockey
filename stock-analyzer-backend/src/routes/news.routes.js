import express from 'express';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Placeholder - implement controllers in src/controllers/news.controller.js
// GET /api/v1/news
router.get('/', (req, res) => {
  res.json({ success: true, data: [], message: 'News endpoint - implement controller' });
});

// GET /api/v1/news/:id
router.get('/:id', (req, res) => {
  res.json({ success: true, data: {}, message: 'Single news endpoint - implement controller' });
});

// GET /api/v1/news/stock/:symbol
router.get('/stock/:symbol', (req, res) => {
  res.json({ success: true, data: [], message: 'Stock news endpoint - implement controller' });
});

export default router;
