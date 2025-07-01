import { auth } from '@/app/(auth)/auth';
import { redirect } from 'next/navigation';
import { Store, Search, Star, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function MarketplacePage() {
  const session = await auth();

  if (!session) {
    redirect('/api/auth/guest');
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
          <p className="text-gray-400">Discover and share AI agents</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
          <Store className="mr-2" size={16} />
          Publish Agent
        </Button>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="text-gray-400" size={32} />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            Marketplace Coming Soon
          </h2>
          <p className="text-gray-400 mb-6">
            Discover, share, and monetize AI agents in the community marketplace
          </p>
          <Button className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
            <Search className="mr-2" size={16} />
            Browse Agents
          </Button>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
            <Search className="text-purple-400" size={20} />
          </div>
          <h3 className="font-semibold mb-2">Discover Agents</h3>
          <p className="text-gray-400 text-sm">
            Browse thousands of pre-built agents for every use case
          </p>
        </div>

        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
            <Star className="text-blue-400" size={20} />
          </div>
          <h3 className="font-semibold mb-2">Rate & Review</h3>
          <p className="text-gray-400 text-sm">
            Community ratings help you find the best agents
          </p>
        </div>

        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
            <Download className="text-green-400" size={20} />
          </div>
          <h3 className="font-semibold mb-2">One-Click Deploy</h3>
          <p className="text-gray-400 text-sm">
            Install and customize agents with a single click
          </p>
        </div>
      </div>
    </div>
  );
}
