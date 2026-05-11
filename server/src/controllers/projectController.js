const Project = require('../models/Project');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Create project
// @route   POST /api/projects
exports.createProject = async (req, res, next) => {
  try {
    const {
      title,
      description,
      budget,
      timeline,
      skillsRequired,
      milestones,
      aiSummary,
      category,
    } = req.body;

    const project = await Project.create({
      clientId: req.user.id,
      title,
      description,
      budget,
      timeline,
      skillsRequired: skillsRequired || [],
      milestones: milestones || [],
      aiSummary: aiSummary || '',
      category: category || '',
      status: 'open',
    });

    res.status(201).json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects
// @route   GET /api/projects
exports.getProjects = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10, search, skills } = req.query;

    const query = {};

    if (req.user.role === 'client') {
      query.clientId = req.user.id;
    } else {
      // Freelancer sees open projects or their own
      query.$or = [{ status: 'open' }, { freelancerId: req.user.id }];
    }

    if (status) query.status = status;
    if (skills) {
      const skillArray = skills.split(',').map((s) => s.trim());
      query.skillsRequired = { $in: skillArray };
    }

    if (search) {
      query.$text = { $search: search };
    }

    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .populate('clientId', 'name avatar rating')
      .populate('freelancerId', 'name avatar rating')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      pages: Math.ceil(total / limit),
      projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('clientId', 'name avatar rating email')
      .populate('freelancerId', 'name avatar rating skills')
      .populate('proposals.freelancerId', 'name avatar rating skills');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check access
    const isClient = project.clientId._id.toString() === req.user.id;
    const isFreelancer =
      project.freelancerId && project.freelancerId._id.toString() === req.user.id;
    const isOpen = project.status === 'open';

    if (!isClient && !isFreelancer && !isOpen) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.status(200).json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.clientId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit proposal
// @route   POST /api/projects/:id/proposals
exports.submitProposal = async (req, res, next) => {
  try {
    const { coverLetter, bidAmount, timeline } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.status !== 'open') {
      return res.status(400).json({ success: false, message: 'Project is not accepting proposals' });
    }

    // Check if already proposed
    const existingProposal = project.proposals.find(
      (p) => p.freelancerId.toString() === req.user.id
    );
    if (existingProposal) {
      return res.status(400).json({ success: false, message: 'You already submitted a proposal' });
    }

    project.proposals.push({
      freelancerId: req.user.id,
      coverLetter,
      bidAmount,
      timeline,
    });

    await project.save();

    // Notify client
    await Notification.create({
      userId: project.clientId,
      type: 'proposal_received',
      title: 'New Proposal Received',
      message: `A freelancer submitted a proposal for "${project.title}"`,
      data: { projectId: project._id },
    });

    res.status(201).json({ success: true, message: 'Proposal submitted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept/Reject proposal
// @route   PUT /api/projects/:id/proposals/:proposalId
exports.handleProposal = async (req, res, next) => {
  try {
    const { action } = req.body; // 'accept' or 'reject'

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.clientId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const proposal = project.proposals.id(req.params.proposalId);
    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }

    if (action === 'accept') {
      proposal.status = 'accepted';
      project.freelancerId = proposal.freelancerId;
      project.status = 'in_progress';

      // Reject all other proposals
      project.proposals.forEach((p) => {
        if (p._id.toString() !== req.params.proposalId) {
          p.status = 'rejected';
        }
      });

      await Notification.create({
        userId: proposal.freelancerId,
        type: 'proposal_accepted',
        title: 'Proposal Accepted!',
        message: `Your proposal for "${project.title}" was accepted`,
        data: { projectId: project._id },
      });
    } else {
      proposal.status = 'rejected';
      await Notification.create({
        userId: proposal.freelancerId,
        type: 'proposal_rejected',
        title: 'Proposal Update',
        message: `Your proposal for "${project.title}" was not selected`,
        data: { projectId: project._id },
      });
    }

    await project.save();
    res.status(200).json({ success: true, project });
  } catch (error) {
    next(error);
  }
};
