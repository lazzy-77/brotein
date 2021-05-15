import express from 'express';
const usersRouter = express.Router();
import pkg from 'express-validator/check/index.js';
const { check, validationResult } = pkg;

// @route   GET api/users
// @desc    Test route
// @access  Public
usersRouter.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // returns error messages
    }
    res.send('User route');
  }
);

export default usersRouter;
