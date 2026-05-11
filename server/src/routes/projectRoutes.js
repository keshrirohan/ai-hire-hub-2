const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  submitProposal,
  handleProposal,
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('client'), createProject);
router.get('/', protect, getProjects);
router.get('/:id', protect, getProjectById);
router.put('/:id', protect, authorize('client'), updateProject);
router.post('/:id/proposals', protect, authorize('freelancer'), submitProposal);
router.put('/:id/proposals/:proposalId', protect, authorize('client'), handleProposal);

module.exports = router;
