const router = require('express').Router();
const Course = require('../models/Course');
const { protect, allowRoles } = require('../middleware/auth');

router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.department) filter.department = req.query.department;
    if (req.query.semester) filter.semester = Number(req.query.semester);
    res.json(await Course.find(filter).populate('faculty', 'name department').sort({ department: 1, code: 1 }));
  } catch (error) { next(error); }
});
router.get('/:id', async (req, res, next) => { try { const item = await Course.findById(req.params.id).populate('faculty', 'name department'); return item ? res.json(item) : res.status(404).json({ message: 'Course not found.' }); } catch (error) { return next(error); } });
router.post('/', protect, allowRoles('admin', 'teacher'), async (req, res, next) => { try { res.status(201).json(await Course.create({ ...req.body, faculty: req.body.faculty || req.user.id })); } catch (error) { next(error); } });
router.put('/:id', protect, allowRoles('admin', 'teacher'), async (req, res, next) => { try { const item = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); return item ? res.json(item) : res.status(404).json({ message: 'Course not found.' }); } catch (error) { return next(error); } });
router.delete('/:id', protect, allowRoles('admin'), async (req, res, next) => { try { const item = await Course.findByIdAndDelete(req.params.id); return item ? res.status(204).end() : res.status(404).json({ message: 'Course not found.' }); } catch (error) { return next(error); } });
module.exports = router;
