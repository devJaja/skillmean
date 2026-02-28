import { useState } from 'react';
import { postJob } from '../utils/escrow';

export default function PostJob() {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await postJob(title, Number(amount), Number(deadline));
      alert('Job posted successfully!');
      setTitle('');
      setAmount('');
      setDeadline('');
    } catch (error) {
      alert('Error posting job: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Post a Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Job Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
            maxLength={100}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Amount (microSTX)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
          <p className="text-xs text-gray-500 mt-1">1 STX = 1,000,000 microSTX</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Deadline (blocks)</label>
          <input
            type="number"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </div>
  );
}
