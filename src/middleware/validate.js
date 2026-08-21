import { validationResult, body } from 'express-validator';

export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation error', errors: errors.array() });
  }
  next();
}

export const authValidators = {
  register: [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  ],
  login: [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
};

export const orderValidators = {
  create: [
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('items.*.productId').isMongoId().withMessage('Invalid productId'),
    body('items.*.qty').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('delivery.method').isIn(['courier', 'pickup', 'post']).withMessage('Invalid delivery method'),
    body('paymentMethod').isIn(['card', 'cash']).withMessage('Invalid payment method'),
  ],
};
