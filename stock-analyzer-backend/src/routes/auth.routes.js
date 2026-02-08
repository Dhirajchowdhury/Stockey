import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  googleAuth,
  googleAuthCallback,
  refreshToken,
  logout,
  getMe,
  updateProfile,
  changePassword
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and number'),
  validate
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

// @route   POST /api/v1/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', authLimiter, registerValidation, register);

// @route   POST /api/v1/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authLimiter, loginValidation, login);

// @route   GET /api/v1/auth/google
// @desc    Google OAuth
// @access  Public
router.get('/google', googleAuth);

// @route   GET /api/v1/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback', googleAuthCallback);

// @route   POST /api/v1/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', refreshToken);

// @route   POST /api/v1/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', protect, logout);

// @route   GET /api/v1/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, getMe);

// @route   PUT /api/v1/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, updateProfile);

// @route   PUT /api/v1/auth/password
// @desc    Change password
// @access  Private
router.put('/password', protect, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and number'),
  validate
], changePassword);

export default router;
