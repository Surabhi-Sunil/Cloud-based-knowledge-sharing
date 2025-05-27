import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    sender: "",
    lessonType: ""
  });

  const [message, setMessage] = useState("");

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://3.129.89.134:5001/submit-event", {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim())
      });
      setMessage("✅ Learning submitted!");
    } catch (error) {
      console.error(error);
      setMessage("❌ Submission failed.");
    }
  };

  return (
    <div className="container">
      <h2>📚 LearnBoard</h2>
      <p className="subtitle">Share key learnings to help your team avoid repeated mistakes and spread internal wins.</p>
      <form onSubmit={submitForm}>
        <label>Title</label>
        <input
          placeholder="e.g. Postmortem – Staging DB Outage"
          required
          onChange={e => setFormData({ ...formData, title: e.target.value })}
        />

        <label>Description</label>
        <textarea
          placeholder="Describe the learning, what went wrong/right, and key takeaways"
          required
          onChange={e => setFormData({ ...formData, description: e.target.value })}
        ></textarea>

        <label>Tags (comma separated)</label>
        <input
          placeholder="e.g. infra, performance, deployment"
          required
          onChange={e => setFormData({ ...formData, tags: e.target.value })}
        />

        <label>Lesson Type</label>
        <select
          required
          onChange={e => setFormData({ ...formData, lessonType: e.target.value })}
        >
          <option value="">Select</option>
          <option value="Launch">Launch</option>
          <option value="Debug">Debug</option>
          <option value="Failure">Failure</option>
          <option value="Win">Win</option>
          <option value="Process">Process</option>
        </select>

        <label>Contributor</label>
        <input
          placeholder="e.g. Surabhi or Anonymous"
          onChange={e => setFormData({ ...formData, sender: e.target.value })}
        />

        <button type="submit">✍️ Submit Learning</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default App;
