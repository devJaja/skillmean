import { useState, useEffect } from 'react';
import { getJob } from '../utils/queries';
import { acceptJob, submitWork, approveWork } from '../utils/escrow';

export default function JobDetails({ jobId }: { jobId: number }) {
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadJob();
  }, [jobId]);

  const loadJob = async () => {
    const data = await getJob(jobId);
    setJob(data.value);
  };

  const handleAccept = async () => {
    setLoading(true);
    try {
      await acceptJob(jobId);
      alert('Job accepted!');
      loadJob();
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await submitWork(jobId);
      alert('Work submitted!');
      loadJob();
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      await approveWork(jobId);
      alert('Work approved and payment released!');
      loadJob();
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!job) return <div>Loading...</div>;

  const statusMap = { 1: 'Open', 2: 'Accepted', 3: 'Submitted', 4: 'Completed' };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Job #{jobId}</h2>
      <div className="space-y-2">
        <p><strong>Title:</strong> {job.title}</p>
        <p><strong>Amount:</strong> {job.amount / 1000000} STX</p>
        <p><strong>Status:</strong> {statusMap[job.status]}</p>
        <p><strong>Client:</strong> {job.client}</p>
        {job.professional && <p><strong>Professional:</strong> {job.professional}</p>}
      </div>
      <div className="mt-4 space-x-2">
        {job.status === 1 && (
          <button onClick={handleAccept} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">
            Accept Job
          </button>
        )}
        {job.status === 2 && (
          <button onClick={handleSubmit} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
            Submit Work
          </button>
        )}
        {job.status === 3 && (
          <button onClick={handleApprove} disabled={loading} className="bg-purple-600 text-white px-4 py-2 rounded">
            Approve & Pay
          </button>
        )}
      </div>
    </div>
  );
}
