import express from 'express';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Placeholder - implement controllers in src/controllers/blog.controller.js
router.get('/', (req, res) => {
  res.json({ success: true, data: [], message: 'Blogs endpoint - implement controller' });
});

router.get('/:slug', (req, res) => {
  res.json({ success: true, data: {}, message: 'Single blog endpoint - implement controller' });
});

router.post('/', protect, authorize('admin'), (req, res) => {
  res.json({ success: true, message: 'Create blog endpoint - implement controller' });
});

export default router;
