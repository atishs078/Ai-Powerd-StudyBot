const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const STUDY_CONFIG = {
  model: "gemini-1.5-pro-latest",
  generationConfig: {
    temperature: 0.6,
    maxOutputTokens: 4096,
  }
};

// Utility to generate valid study dates based on preferred days
const generateStudyDates = (start, end, preferredDays) => {
  const studyDates = [];
  const current = new Date(start);
  const endDate = new Date(end);
  const dayMap = {
    Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
    Thursday: 4, Friday: 5, Saturday: 6
  };

  const preferredIndexes = preferredDays.length
    ? preferredDays.map(day => dayMap[day])
    : [0, 1, 2, 3, 4, 5, 6]; // all days if not specified

  while (current <= endDate) {
    if (preferredIndexes.includes(current.getDay())) {
      studyDates.push(new Date(current).toISOString().split('T')[0]); // YYYY-MM-DD
    }
    current.setDate(current.getDate() + 1);
  }

  return studyDates;
};

router.post('/planner', async (req, res) => {
  try {
    const {
      subject,
      topic,
      timeAvailable = '10 hours',
      targetDate,
      studyPace = 'moderate',
      preferredDays = [],
      dailyStudyTime = '1-2 hours'
    } = req.body;

    if (!subject || !topic) {
      return res.status(400).json({ error: 'Subject and topic are required' });
    }

    const model = genAI.getGenerativeModel(STUDY_CONFIG);

    const timeFrame = targetDate
      ? `Target completion date: ${new Date(targetDate).toDateString()}`
      : `Total available time: ${timeAvailable}`;

    const today = new Date();
    const endDate = targetDate ? new Date(targetDate) : new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // default: 1 week
    const studyDates = generateStudyDates(today, endDate, preferredDays);

    const prompt = `
Create a detailed study plan with the following parameters:
- Subject: ${subject}
- Topic: ${topic}
- ${timeFrame}
- Study pace: ${studyPace}
- Preferred study days: ${preferredDays.join(', ') || 'Any day'}
- Daily study time: ${dailyStudyTime}
- Use these exact study dates: ${studyDates.join(', ')}

Respond ONLY in this exact JSON format (without markdown or code blocks):

{
  "planName": "Customized ${subject} Study Plan",
  "totalHours": 0,
  "dailyBreakdown": [
    {
      "day": "Day 1",
      "date": "YYYY-MM-DD",
      "topics": ["topic1", "topic2"],
      "activities": ["reading", "practice problems"],
      "resources": ["resource1", "resource2"],
      "timeRequired": "X hours",
      "goals": ["goal1", "goal2"]
    }
  ],
  "weeklyMilestones": [
    {
      "week": 1,
      "target": "Complete basic concepts",
      "successCriteria": ["criteria1", "criteria2"]
    }
  ],
  "completionTips": ["tip1", "tip2"],
  "assessmentPlan": {
    "selfChecks": ["check1", "check2"],
    "finalAssessment": "Description of final test"
  }
}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const cleanedText = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      const studyPlan = JSON.parse(cleanedText);

      res.json({
        success: true,
        plan: studyPlan,
        generatedAt: new Date().toISOString()
      });
    } catch (e) {
      res.json({
        success: true,
        rawPlan: text,
        note: "The response couldn't be parsed as JSON"
      });
    }

  } catch (error) {
    console.error('Study Planner Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate study plan',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
