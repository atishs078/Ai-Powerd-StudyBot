import React, { useState } from 'react';
import axios from 'axios';

const StudyPlanner = () => {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/chat/planner', {
        subject,
        topic,
        targetDate,
        timeAvailable: "10 hours",
        studyPace: "moderate",
        preferredDays: ["Monday", "Wednesday", "Friday"],
        dailyStudyTime: "1-2 hours"
      });
      setPlan(response.data.plan || response.data.rawPlan);
    } catch (err) {
      console.error("Error generating plan:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h4>📘 Study Plan Generator</h4>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Subject</label>
            <input type="text" className="form-control" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Topic</label>
            <input type="text" className="form-control" value={topic} onChange={(e) => setTopic(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Target Date</label>
            <input type="date" className="form-control" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
          </div>
          <button className="btn btn-dark" onClick={handleGenerate} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Plan'}
          </button>
        </div>
      </div>

      {plan && (
        <div className="mt-5">
          <h4>{plan.planName}</h4>
          <p><strong>Total Hours:</strong> {plan.totalHours}</p>

          <div className="accordion" id="studyPlanAccordion">
            {plan.dailyBreakdown?.map((dayPlan, index) => (
              <div className="accordion-item" key={index}>
                <h2 className="accordion-header" id={`heading-${index}`}>
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse-${index}`}
                    aria-expanded="false"
                    aria-controls={`collapse-${index}`}
                  >
                    {dayPlan.day} - {dayPlan.date}
                  </button>
                </h2>
                <div
                  id={`collapse-${index}`}
                  className="accordion-collapse collapse"
                  aria-labelledby={`heading-${index}`}
                  data-bs-parent="#studyPlanAccordion"
                >
                  <div className="accordion-body">
                    <p><strong>Topics:</strong> {dayPlan.topics.join(', ')}</p>
                    <p><strong>Activities:</strong> {dayPlan.activities.join(', ')}</p>
                    <p><strong>Resources:</strong> {dayPlan.resources.join(', ')}</p>
                    <p><strong>Time Required:</strong> {dayPlan.timeRequired}</p>
                    <p><strong>Goals:</strong> {dayPlan.goals.join(', ')}</p>
                    {dayPlan.successCriteria && (
                      <p><strong>Success Criteria:</strong> {dayPlan.successCriteria.join(', ')}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <h5>📌 Weekly Milestones</h5>
            {plan.weeklyMilestones.map((milestone, idx) => (
              <div key={idx} className="border p-3 mb-2 rounded">
                <p><strong>Week {milestone.week}:</strong> {milestone.target}</p>
                <p><strong>Success Criteria:</strong> {milestone.successCriteria.join(', ')}</p>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <h5>✅ Completion Tips</h5>
            <ul className="list-group">
              {plan.completionTips.map((tip, i) => (
                <li key={i} className="list-group-item">{tip}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <h5>📝 Assessment Plan</h5>
            <p><strong>Self Checks:</strong> {plan.assessmentPlan.selfChecks.join(', ')}</p>
            <p><strong>Final Assessment:</strong> {plan.assessmentPlan.finalAssessment}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPlanner;
