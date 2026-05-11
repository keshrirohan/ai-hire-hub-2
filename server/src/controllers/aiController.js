const Groq = require('groq-sdk');

let groq;
const getGroqClient = () => {
  if (!groq) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groq;
};

const SYSTEM_PROMPT = `You are an expert AI Project Manager for AI Hire Hub, a professional freelancing platform. 
Your role is to help clients plan their projects efficiently.

When a client describes a project, you should:
1. Ask 2-3 clarifying questions if needed
2. Generate a comprehensive project plan including:
   - Project title
   - Detailed description
   - Budget estimation (in INR)
   - Timeline estimation
   - Required skills (as array)
   - Project milestones (each with title, description, estimated amount, and deadline in days)

When you have enough information to create a complete project plan, respond with a JSON object wrapped in <PROJECT_DATA> tags like this:

<PROJECT_DATA>
{
  "title": "Project Title",
  "description": "Detailed project description",
  "budget": 50000,
  "timeline": "3 months",
  "skillsRequired": ["React", "Node.js", "MongoDB"],
  "aiSummary": "Brief AI summary of the project",
  "milestones": [
    {
      "title": "Milestone 1",
      "description": "What needs to be done",
      "amount": 15000,
      "deadline": 14,
      "order": 1
    }
  ]
}
</PROJECT_DATA>

Always be professional, helpful, and concise. Focus on practical project planning.`;

// @desc    AI chat
// @route   POST /api/ai/chat
exports.chat = async (req, res, next) => {
  try {
    const { messages, projectId } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, message: 'Messages array required' });
    }

    const client = getGroqClient();
    const completion = await client.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2048,
    });

    const response = completion.choices[0].message.content;

    // Check if project data is embedded
    const projectDataMatch = response.match(/<PROJECT_DATA>([\s\S]*?)<\/PROJECT_DATA>/);
    let projectData = null;

    if (projectDataMatch) {
      try {
        projectData = JSON.parse(projectDataMatch[1].trim());
        // Add deadline as Date
        if (projectData.milestones) {
          projectData.milestones = projectData.milestones.map((m) => ({
            ...m,
            deadline: new Date(Date.now() + m.deadline * 24 * 60 * 60 * 1000),
          }));
        }
      } catch (e) {
        console.error('Failed to parse project data:', e);
      }
    }

    // Clean response for display (remove PROJECT_DATA tags)
    const cleanResponse = response
      .replace(/<PROJECT_DATA>[\s\S]*?<\/PROJECT_DATA>/g, '')
      .trim();

    res.status(200).json({
      success: true,
      message: cleanResponse || "I've generated your project plan! Review and save it.",
      projectData,
    });
  } catch (error) {
    if (error.status === 401) {
      return res.status(500).json({
        success: false,
        message: 'AI service configuration error. Please check API key.',
      });
    }
    next(error);
  }
};

// @desc    Generate project from description
// @route   POST /api/ai/generate-project
exports.generateProject = async (req, res, next) => {
  try {
    const { description } = req.body;

    const client = getGroqClient();
    const completion = await client.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Generate a complete project plan for: ${description}. Provide the PROJECT_DATA JSON immediately.`,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2048,
    });

    const response = completion.choices[0].message.content;
    const projectDataMatch = response.match(/<PROJECT_DATA>([\s\S]*?)<\/PROJECT_DATA>/);

    if (!projectDataMatch) {
      return res.status(400).json({
        success: false,
        message: 'Could not generate project data. Please provide more details.',
      });
    }

    const projectData = JSON.parse(projectDataMatch[1].trim());
    if (projectData.milestones) {
      projectData.milestones = projectData.milestones.map((m) => ({
        ...m,
        deadline: new Date(Date.now() + (m.deadline || 14) * 24 * 60 * 60 * 1000),
      }));
    }

    res.status(200).json({ success: true, projectData });
  } catch (error) {
    next(error);
  }
};

// @desc    AI review of milestone work
// @route   POST /api/ai/review-work
exports.reviewWork = async (req, res, next) => {
  try {
    const { milestoneTitle, milestoneDescription, submissionNote, projectTitle } = req.body;

    const client = getGroqClient();
    const completion = await client.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an AI quality reviewer for freelance work. Evaluate submitted work and provide a JSON response with: score (0-100), feedback (string), status ("approved" or "needs_revision"). Be fair and constructive.`,
        },
        {
          role: 'user',
          content: `Review this milestone submission:
Project: ${projectTitle}
Milestone: ${milestoneTitle}
Requirements: ${milestoneDescription}
Submission Note: ${submissionNote || 'No note provided'}

Provide JSON: {"score": number, "feedback": "string", "status": "approved|needs_revision"}`,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 512,
    });

    const response = completion.choices[0].message.content;
    const jsonMatch = response.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const review = JSON.parse(jsonMatch[0]);
      review.reviewedAt = new Date();
      res.status(200).json({ success: true, review });
    } else {
      res.status(200).json({
        success: true,
        review: {
          score: 70,
          feedback: 'Work reviewed. Please have client verify.',
          status: 'approved',
          reviewedAt: new Date(),
        },
      });
    }
  } catch (error) {
    next(error);
  }
};
