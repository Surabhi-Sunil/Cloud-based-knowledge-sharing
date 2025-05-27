import { useEffect, useState } from 'react';
import axios from 'axios';

function LearnFeed() {
  const [learnings, setLearnings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLearnings();
  }, []);

  const fetchLearnings = async () => {
    try {
      const res = await axios.get("http://3.129.89.134:5001/learnings");
      setLearnings(res.data);
    } catch (err) {
      console.error(err);
      setError("⚠️ Failed to fetch learnings");
    }
  };

  const markHelpful = async (id) => {
    try {
      await axios.post(`http://3.129.89.134:5001/mark-helpful/${id}`);
      // Re-fetch the latest list to reflect updated count
      await fetchLearnings();
    } catch (err) {
      console.error(err);
      setError("❌ Failed to mark helpful");
    }
  };

  return (
    <div className="container">
      <h2>📚 LearnBoard</h2>
      {error && <p className="error">{error}</p>}
      {learnings.length === 0 && <p>No learnings submitted yet.</p>}
      {learnings.map(item => (
        <div key={item.event_id} className="card">
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <p><strong>Type:</strong> {item.lesson_type}</p>
          <p><strong>Tags:</strong> {item.tags.join(", ")}</p>
          <p><strong>By:</strong> {item.sender}</p>
          <button onClick={() => markHelpful(item.event_id)}>
            👏 Helpful ({item.helpful_count || 0})
          </button>
        </div>
      ))}
    </div>
  );
}

export default LearnFeed;
