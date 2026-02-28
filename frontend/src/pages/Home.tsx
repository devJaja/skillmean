import { useState } from 'react';
import Header from '../components/Header';
import PostJob from '../components/PostJob';
import JobDetails from '../components/JobDetails';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  const { isSignedIn } = useAuth();
  const [jobId, setJobId] = useState('');

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Skills-Bridge</h1>
          <p className="text-gray-600">Decentralized skills marketplace on Bitcoin Layer 2</p>
        </div>

        {!isSignedIn ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-600">Connect your Stacks wallet to get started</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <PostJob />
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">View Job</h2>
              <div className="space-y-4">
                <input
                  type="number"
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                  placeholder="Enter Job ID"
                  className="w-full border rounded px-3 py-2"
                />
                {jobId && <JobDetails jobId={Number(jobId)} />}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
