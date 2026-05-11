const express = require('express');
const router = express.Router();
const { submitMilestone, reviewMilestone, activateMilestone } = require('../controllers/milestoneController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.post('/submit', protect, authorize('freelancer'), upload.array('files', 10), submitMilestone);
router.post('/review', protect, authorize('client'), reviewMilestone);
router.put('/:projectId/:milestoneId/activate', protect, authorize('client'), activateMilestone);

module.exports = router;
