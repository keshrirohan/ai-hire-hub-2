const Project = require('../models/Project');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');
const aiService = require('../services/aiService');
const { uploadToCloudinary } = require('../config/cloudinary');

// @desc    Submit milestone
// @route   POST /api/milestones/submit
exports.submitMilestone = async (req, res, next) => {
  try {
    const { projectId, milestoneId, submissionNote } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.freelancerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const milestone = project.milestones.id(milestoneId);
    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }

    if (!['active', 'rejected'].includes(milestone.status)) {
      return res.status(400).json({ success: false, message: 'Milestone cannot be submitted' });
    }

    // Handle file uploads — multer uses memoryStorage so we upload buffers to Cloudinary
    const submissionFiles = [];
    if (req.files && req.files.length > 0) {
      for (const f of req.files) {
        try {
          const result = await uploadToCloudinary(f.buffer, 'ai-hire-hub/submissions');
          submissionFiles.push({
            url: result.secure_url,
            publicId: result.public_id,
            name: f.originalname,
            type: f.mimetype,
          });
        } catch (uploadErr) {
          console.error('File upload to Cloudinary failed:', uploadErr.message);
        }
      }
    }

    milestone.submissionFiles = submissionFiles;
    milestone.submissionNote = submissionNote || '';
    milestone.status = 'submitted';

    // AI Review
    try {
      const aiReview = await aiService.reviewMilestone({
        milestoneTitle: milestone.title,
        milestoneDescription: milestone.description,
        submissionNote,
        projectTitle: project.title,
      });
      milestone.aiReview = aiReview;
    } catch (aiError) {
      console.error('AI Review failed:', aiError.message);
    }

    await project.save();

    // Notify client
    await Notification.create({
      userId: project.clientId,
      type: 'milestone_submitted',
      title: 'Milestone Submitted',
      message: `Freelancer submitted "${milestone.title}" for review`,
      data: { projectId: project._id, milestoneId },
    });

    res.status(200).json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

// @desc    Review milestone (client)
// @route   POST /api/milestones/review
exports.reviewMilestone = async (req, res, next) => {
  try {
    const { projectId, milestoneId, approved, comment } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.clientId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const milestone = project.milestones.id(milestoneId);
    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }

    if (milestone.status !== 'submitted') {
      return res.status(400).json({ success: false, message: 'Milestone not submitted yet' });
    }

    milestone.clientReview = {
      comment: comment || '',
      approved,
      reviewedAt: new Date(),
    };

    const client = await User.findById(req.user.id);
    const freelancer = await User.findById(project.freelancerId);

    if (approved) {
      milestone.status = 'approved';
      milestone.approved = true;

      // Release payment from escrow
      if (project.escrowAmount >= milestone.amount && freelancer) {
        project.escrowAmount -= milestone.amount;
        project.totalPaid += milestone.amount;
        freelancer.walletBalance += milestone.amount;
        await freelancer.save();

        milestone.status = 'paid';
        milestone.paidAt = new Date();

        await Transaction.create({
          userId: project.freelancerId,
          projectId: project._id,
          milestoneId: milestoneId,
          amount: milestone.amount,
          type: 'release',
          status: 'completed',
          paymentMethod: 'wallet',
          description: `Payment for milestone: ${milestone.title}`,
        });

        await Notification.create({
          userId: project.freelancerId,
          type: 'payment_received',
          title: 'Payment Received!',
          message: `₹${milestone.amount} released for "${milestone.title}"`,
          data: { projectId: project._id, milestoneId },
        });
      }
    } else {
      milestone.status = 'rejected';
      await Notification.create({
        userId: project.freelancerId,
        type: 'milestone_rejected',
        title: 'Milestone Rejected',
        message: `"${milestone.title}" was rejected. Please revise and resubmit.`,
        data: { projectId: project._id, milestoneId },
      });
    }

    // Check if all milestones are paid
    const allPaid = project.milestones.every((m) => m.status === 'paid');
    if (allPaid) {
      project.status = 'completed';
      project.completedAt = new Date();
      client.completedProjects = (client.completedProjects || 0) + 1;
      await client.save();
      if (freelancer) {
        freelancer.completedProjects = (freelancer.completedProjects || 0) + 1;
        await freelancer.save();
      }
    }

    await project.save();
    res.status(200).json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

// @desc    Activate milestone
// @route   PUT /api/milestones/:projectId/:milestoneId/activate
exports.activateMilestone = async (req, res, next) => {
  try {
    const { projectId, milestoneId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.clientId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const milestone = project.milestones.id(milestoneId);
    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }

    milestone.status = 'active';
    await project.save();

    await Notification.create({
      userId: project.freelancerId,
      type: 'milestone_activated',
      title: 'New Milestone Activated',
      message: `"${milestone.title}" is now active. Start working!`,
      data: { projectId, milestoneId },
    });

    res.status(200).json({ success: true, project });
  } catch (error) {
    next(error);
  }
};
