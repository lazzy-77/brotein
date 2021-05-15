import express from 'express';
const usersRouter = express.Router();
import { check, validationResult } from 'express-validator/check';

// @route   GET api/users
// @desc    Test route
// @access  Public
usersRouter.post('/', (req, res) => {
  console.log(req.body);
  res.send('User route');
});

export default usersRouter;
