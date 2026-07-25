const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');
const router = require('express').Router();
const { Assignment, Submission } = require('../models/Assignment');
const { protect, allowRoles } = require('../middleware/auth');

const uploadDir = path.join(__dirname, '../../uploads');
fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({
  storage: multer.diskStorage({ destination: uploadDir, filename: (_req, file, cb) => cb(null, `${Date.now()}-${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`) }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') return cb(null, true);
    const error = new Error('Only PDF submissions are accepted.');
    error.statusCode = 400;
    return cb(error);
  }
});

router.get('/', protect, async (req, res, next) => {
  try {
    const items = await Assignment.find().populate('course', 'code title').populate('createdBy', 'name').sort({ dueAt: 1 });
    res.json(items);
  } catch (error) { next(error); }
});
router.post('/', protect, allowRoles('admin', 'teacher'), async (req, res, next) => { try { res.status(201).json(await Assignment.create({ ...req.body, createdBy: req.user.id })); } catch (error) { next(error); } });
router.post('/:id/submissions', protect, allowRoles('student'), upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'A PDF file is required.' });
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found.' });
    const submission = await Submission.findOneAndUpdate(
      { assignment: assignment.id, student: req.user.id },
      { filePath: `/uploads/${req.file.filename}`, originalName: req.file.originalname, submittedAt: new Date() },
      { new: true, upsert: true, runValidators: true }
    );
    res.status(201).json(submission);
  } catch (error) { next(error); }
});
router.get('/:id/submissions', protect, allowRoles('admin', 'teacher'), async (req, res, next) => { try { res.json(await Submission.find({ assignment: req.params.id }).populate('student', 'name email studentId')); } catch (error) { next(error); } });
module.exports = router;
