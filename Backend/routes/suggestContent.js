const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const STUDY_CONFIG = {
  model: "gemini-1.5-pro-latest",
  generationConfig: {
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 2048,
  },
  safetySettings: [
    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" }
  ]
};

router.post('/recommend', async (req, res) => {
  try {
    const { subject, topic, difficulty = 'intermediate', learningStyle = 'visual', currentKnowledge = 'basic' } = req.body;

    if (!subject || !topic) {
      return res.status(400).json({ 
        success: false,
        error: 'Subject and topic are required fields'
      });
    }

    const model = genAI.getGenerativeModel(STUDY_CONFIG);

    const prompt = `
      You are an expert ${subject} tutor. Create a detailed study guide for:
      - Topic: ${topic}
      - Difficulty: ${difficulty}
      - Learning Style: ${learningStyle}
      - Current Knowledge Level: ${currentKnowledge}

      Provide recommendations in this exact JSON format:
      {
        "topicOverview": "Brief explanation of the topic",
        "keyConcepts": ["list", "of", "core", "ideas"],
        "learningResources": [
          {
            "type": "video|article|book|interactive",
            "title": "Resource title",
            "description": "Why this resource is valuable",
            "estimatedTime": "X hours/minutes",
            "priority": "high|medium|low"
          }
        ],
        "studyPlan": {
          "totalWeeks": 2,
          "weeklySchedule": [
            {
              "week": 1,
              "goals": ["goal1", "goal2"],
              "activities": ["activity1", "activity2"]
            }
          ]
        },
        "practiceSuggestions": {
          "exercises": ["exercise1", "exercise2"],
          "selfAssessment": "How to test understanding"
        }
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 🔧 Fix: Clean markdown-style block if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.replace(/^```json/, '').replace(/```$/, '').trim();
    }

    try {
      const recommendations = JSON.parse(cleanedText);
      return res.json({
        success: true,
        data: recommendations
      });
    } catch (parseError) {
      console.warn('⚠️ Failed to parse JSON response, returning raw text');
      return res.json({
        success: true,
        data: { rawRecommendation: cleanedText }
      });
    }

  } catch (error) {
    console.error('[Study Recommendation Error]', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate study recommendations',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
