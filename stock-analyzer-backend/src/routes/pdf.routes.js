import express from 'express';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Placeholder - implement controllers in src/controllers/pdf.controller.js
router.get('/', (req, res) => {
  res.json({ success: true, data: [], message: 'PDFs endpoint - implement controller' });
});

router.get('/:id', (req, res) => {
  res.json({ success: true, data: {}, message: 'PDF details endpoint - implement controller' });
});

router.get('/:id/download', protect, (req, res) => {
  res.json({ success: true, message: 'PDF download endpoint - implement controller' });
});

router.post('/', protect, authorize('admin'), (req, res) => {
  res.json({ success: true, message: 'Upload PDF endpoint - implement controller' });
});

export default router;
