const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getFreelancers,
  getFreelancerById,
  addPortfolio,
  getRecommendedFreelancers,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.get('/freelancers', protect, getFreelancers);
router.get('/freelancers/:id', protect, getFreelancerById);
router.post('/portfolio', protect, authorize('freelancer'), upload.single('file'), addPortfolio);
router.get('/recommend/:projectId', protect, getRecommendedFreelancers);

module.exports = router;
