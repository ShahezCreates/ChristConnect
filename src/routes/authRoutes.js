const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const tokenFor = (user) => jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
const publicUser = (user) => ({ id: user.id, name: user.name, email: user.email, role: user.role, department: user.department, studentId: user.studentId });

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, department, studentId } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required.' });
    const user = await User.create({ name, email, password, department, studentId });
    return res.status(201).json({ token: tokenFor(user), user: publicUser(user) });
  } catch (error) { return next(error); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email || '').toLowerCase() }).select('+password');
    if (!user || !(await user.matchesPassword(password || ''))) return res.status(401).json({ message: 'Invalid email or password.' });
    return res.json({ token: tokenFor(user), user: publicUser(user) });
  } catch (error) { return next(error); }
});

router.get('/me', protect, (req, res) => res.json({ user: publicUser(req.user) }));
module.exports = router;
