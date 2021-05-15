import express from 'express';
const usersRouter = express.Router();

// @route   GET api/users
// @desc    Test route
// @access  Public
usersRouter.get('/', (req, res) => res.send('User route'));

export default usersRouter;
