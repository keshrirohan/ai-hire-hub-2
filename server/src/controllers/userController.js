const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, user });
};

// @desc    Update user profile
// @route   PUT /api/users/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      bio: req.body.bio,
      skills: req.body.skills,
      hourlyRate: req.body.hourlyRate,
      location: req.body.location,
      website: req.body.website,
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(
      (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    if (req.file) {
      fieldsToUpdate.avatar = req.file.path;
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all freelancers with filtering
// @route   GET /api/users/freelancers
exports.getFreelancers = async (req, res, next) => {
  try {
    const { skills, minRating, page = 1, limit = 10, search } = req.query;

    const query = { role: 'freelancer', isActive: true };

    if (skills) {
      const skillArray = skills.split(',').map((s) => s.trim());
      query.skills = { $in: skillArray };
    }

    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const total = await User.countDocuments(query);
    const freelancers = await User.find(query)
      .select('-password')
      .sort({ rating: -1, completedProjects: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: freelancers.length,
      total,
      pages: Math.ceil(total / limit),
      freelancers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get freelancer by ID
// @route   GET /api/users/freelancers/:id
exports.getFreelancerById = async (req, res, next) => {
  try {
    const freelancer = await User.findOne({
      _id: req.params.id,
      role: 'freelancer',
    }).select('-password');

    if (!freelancer) {
      return res.status(404).json({ success: false, message: 'Freelancer not found' });
    }

    res.status(200).json({ success: true, freelancer });
  } catch (error) {
    next(error);
  }
};

// @desc    Add portfolio item
// @route   POST /api/users/portfolio
exports.addPortfolio = async (req, res, next) => {
  try {
    const { title, description, url } = req.body;
    const portfolioItem = { title, description, url };

    if (req.file) {
      portfolioItem.fileUrl = req.file.path;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { portfolio: portfolioItem } },
      { new: true }
    );

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recommended freelancers for a project
// @route   GET /api/users/recommend/:projectId
exports.getRecommendedFreelancers = async (req, res, next) => {
  try {
    const Project = require('../models/Project');
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Recommendation algorithm
    const freelancers = await User.find({ role: 'freelancer', isActive: true })
      .select('-password');

    const scored = freelancers.map((f) => {
      let score = 0;

      // Skill match score (0-50 points)
      const matchingSkills = f.skills.filter((skill) =>
        project.skillsRequired.some(
          (req) => req.toLowerCase() === skill.toLowerCase()
        )
      );
      score += (matchingSkills.length / Math.max(project.skillsRequired.length, 1)) * 50;

      // Rating score (0-25 points)
      score += (f.rating / 5) * 25;

      // Completed projects (0-25 points)
      score += Math.min(f.completedProjects / 10, 1) * 25;

      return { ...f.toObject(), matchScore: Math.round(score), matchingSkills };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      success: true,
      freelancers: scored.slice(0, 10),
    });
  } catch (error) {
    next(error);
  }
};
