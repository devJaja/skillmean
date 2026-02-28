import { useAuth } from '../hooks/useAuth';

export default function Header() {
  const { isSignedIn, userData, connectWallet, disconnectWallet } = useAuth();

  return (
    <header className="bg-purple-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Skills-Bridge</h1>
        <div>
          {isSignedIn ? (
            <div className="flex items-center gap-4">
              <span className="text-sm">
                {userData?.profile?.stxAddress?.mainnet?.slice(0, 8)}...
              </span>
              <button
                onClick={disconnectWallet}
                className="bg-white text-purple-600 px-4 py-2 rounded hover:bg-gray-100"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-white text-purple-600 px-4 py-2 rounded hover:bg-gray-100"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
