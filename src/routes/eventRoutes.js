const router = require('express').Router();
const Event = require('../models/Event');
const { protect, allowRoles } = require('../middleware/auth');

router.get('/', async (req, res, next) => {
  try {
    const filter = req.query.upcoming === 'true' ? { startsAt: { $gte: new Date() } } : {};
    res.json(await Event.find(filter).populate('createdBy', 'name').sort({ startsAt: 1 }).limit(100));
  } catch (error) { next(error); }
});
router.post('/', protect, allowRoles('admin', 'teacher'), async (req, res, next) => { try { res.status(201).json(await Event.create({ ...req.body, createdBy: req.user.id })); } catch (error) { next(error); } });
router.put('/:id', protect, allowRoles('admin', 'teacher'), async (req, res, next) => {
  try {
    const item = await Event.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Event not found.' });
    if (req.user.role !== 'admin' && String(item.createdBy) !== req.user.id) return res.status(403).json({ message: 'You can edit only your own events.' });
    Object.assign(item, req.body); res.json(await item.save());
  } catch (error) { next(error); }
});
router.delete('/:id', protect, allowRoles('admin', 'teacher'), async (req, res, next) => {
  try { const item = await Event.findById(req.params.id); if (!item) return res.status(404).json({ message: 'Event not found.' }); if (req.user.role !== 'admin' && String(item.createdBy) !== req.user.id) return res.status(403).json({ message: 'You can delete only your own events.' }); await item.deleteOne(); res.status(204).end(); } catch (error) { next(error); }
});
module.exports = router;
