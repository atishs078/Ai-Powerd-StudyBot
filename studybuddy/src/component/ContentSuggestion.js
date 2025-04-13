import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const ContentSuggestion = () => {
  const [form, setForm] = useState({
    subject: '',
    topic: '',
    difficulty: 'intermediate',
    learningStyle: 'visual',
    currentKnowledge: 'basic',
  });

  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/chat/recommend', form);
      setRecommendation(res.data.data);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h4>🎓 AI-Powered Study Recommendation</h4>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Subject</label>
              <input type="text" className="form-control" name="subject" value={form.subject} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Topic</label>
              <input type="text" className="form-control" name="topic" value={form.topic} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Difficulty</label>
              <select className="form-select" name="difficulty" value={form.difficulty} onChange={handleChange}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Learning Style</label>
              <select className="form-select" name="learningStyle" value={form.learningStyle} onChange={handleChange}>
                <option value="visual">Visual</option>
                <option value="auditory">Auditory</option>
                <option value="kinesthetic">Kinesthetic</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Current Knowledge</label>
              <input type="text" className="form-control" name="currentKnowledge" value={form.currentKnowledge} onChange={handleChange} />
            </div>
          </div>

          <button className="btn btn-dark mt-4" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Recommendation'}
          </button>
        </div>
      </div>

      {recommendation && (
        <div className="mt-5">
          {recommendation.topicOverview ? (
            <div className="card shadow-sm p-4">
              <h4 className="mb-3">🧠 Topic Overview</h4>
              <p>{recommendation.topicOverview}</p>

              <h5>🔑 Key Concepts</h5>
              <ul>
                {recommendation.keyConcepts.map((key, i) => (
                  <li key={i}>{key}</li>
                ))}
              </ul>

              <h5 className="mt-4">📚 Learning Resources</h5>
              {recommendation.learningResources.map((res, i) => (
                <div key={i} className="border rounded p-2 mb-2">
                  <strong>{res.title}</strong> <span className="badge bg-secondary ms-2">{res.type}</span>
                  <p className="mb-1">{res.description}</p>
                  <small><strong>Estimated Time:</strong> {res.estimatedTime}</small><br />
                  <small><strong>Priority:</strong> {res.priority}</small>
                </div>
              ))}

              <h5 className="mt-4">🗓️ Study Plan</h5>
              <p><strong>Total Weeks:</strong> {recommendation.studyPlan.totalWeeks}</p>
              {recommendation.studyPlan.weeklySchedule.map((week, i) => (
                <div key={i} className="mb-2">
                  <strong>Week {week.week}</strong>
                  <ul>
                    <li><strong>Goals:</strong> {week.goals.join(', ')}</li>
                    <li><strong>Activities:</strong> {week.activities.join(', ')}</li>
                  </ul>
                </div>
              ))}

              <h5 className="mt-4">📝 Practice Suggestions</h5>
              <ul>
                {recommendation.practiceSuggestions.exercises.map((ex, i) => (
                  <li key={i}>{ex}</li>
                ))}
              </ul>
              <p><strong>Self-Assessment:</strong> {recommendation.practiceSuggestions.selfAssessment}</p>
            </div>
          ) : (
            <pre className="mt-4 bg-dark text-light p-3 rounded">
              {recommendation.rawRecommendation}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentSuggestion;
