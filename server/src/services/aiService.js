const Groq = require('groq-sdk');

let groq;
const getGroqClient = () => {
  if (!groq) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groq;
};

exports.reviewMilestone = async ({ milestoneTitle, milestoneDescription, submissionNote, projectTitle }) => {
  try {
    const client = getGroqClient();
    const completion = await client.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a quality reviewer. Respond ONLY with valid JSON.',
        },
        {
          role: 'user',
          content: `Review this freelance work submission:
Project: ${projectTitle}
Milestone: ${milestoneTitle}
Requirements: ${milestoneDescription}
Submission: ${submissionNote || 'Work submitted without notes'}

Respond with JSON only: {"score": 0-100, "feedback": "string", "status": "approved" or "needs_revision"}`,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 256,
    });

    const content = completion.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const review = JSON.parse(jsonMatch[0]);
      review.reviewedAt = new Date();
      return review;
    }

    return {
      score: 75,
      feedback: 'Work submitted and automatically reviewed.',
      status: 'approved',
      reviewedAt: new Date(),
    };
  } catch (error) {
    console.error('AI service error:', error.message);
    return {
      score: 70,
      feedback: 'AI review temporarily unavailable.',
      status: 'approved',
      reviewedAt: new Date(),
    };
  }
};

exports.generateProjectPlan = async (description) => {
  const client = getGroqClient();
  const completion = await client.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `You are a project manager. Generate project plans as JSON wrapped in <PROJECT_DATA> tags.`,
      },
      {
        role: 'user',
        content: `Create a complete project plan for: "${description}". Include title, description, budget (INR), timeline, skillsRequired array, aiSummary, and milestones array with title, description, amount, deadline (days), and order.`,
      },
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    max_tokens: 2048,
  });

  const response = completion.choices[0].message.content;
  const match = response.match(/<PROJECT_DATA>([\s\S]*?)<\/PROJECT_DATA>/);
  if (match) {
    return JSON.parse(match[1].trim());
  }
  throw new Error('Failed to generate project plan');
};
