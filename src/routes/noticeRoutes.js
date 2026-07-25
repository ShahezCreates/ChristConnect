const router = require('express').Router();
const Notice = require('../models/Notice');
const { protect, allowRoles } = require('../middleware/auth');

router.get('/', async (req, res, next) => {
  try {
    const filter = { $or: [{ expiresAt: { $exists: false } }, { expiresAt: null }, { expiresAt: { $gte: new Date() } }] };
    if (req.query.category) filter.category = req.query.category;
    res.json(await Notice.find(filter).populate('author', 'name role').sort({ pinned: -1, createdAt: -1 }).limit(100));
  } catch (error) { next(error); }
});
router.post('/', protect, allowRoles('admin', 'teacher'), async (req, res, next) => {
  try { res.status(201).json(await Notice.create({ ...req.body, author: req.user.id })); } catch (error) { next(error); }
});
router.put('/:id', protect, allowRoles('admin', 'teacher'), async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found.' });
    if (req.user.role !== 'admin' && String(notice.author) !== req.user.id) return res.status(403).json({ message: 'You can edit only your own notices.' });
    Object.assign(notice, req.body); res.json(await notice.save());
  } catch (error) { next(error); }
});
router.delete('/:id', protect, allowRoles('admin', 'teacher'), async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found.' });
    if (req.user.role !== 'admin' && String(notice.author) !== req.user.id) return res.status(403).json({ message: 'You can delete only your own notices.' });
    await notice.deleteOne(); res.status(204).end();
  } catch (error) { next(error); }
});
module.exports = router;
