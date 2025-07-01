import { auth } from '@/app/(auth)/auth';
import { redirect } from 'next/navigation';
import { Users, Plus, Target, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function TeamsPage() {
  const session = await auth();

  if (!session) {
    redirect('/api/auth/guest');
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Teams</h1>
          <p className="text-gray-400">
            Organize agents into collaborative teams
          </p>
        </div>
        <Button className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
          <Plus className="mr-2" size={16} />
          Create Team
        </Button>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="text-gray-400" size={32} />
          </div>
          <h2 className="text-xl font-semibold mb-2">No teams yet</h2>
          <p className="text-gray-400 mb-6">
            Create agent teams to tackle complex projects together
          </p>
          <Button className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
            <Plus className="mr-2" size={16} />
            Create Your First Team
          </Button>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
            <Users className="text-purple-400" size={20} />
          </div>
          <h3 className="font-semibold mb-2">Team Collaboration</h3>
          <p className="text-gray-400 text-sm">
            Agents work together on complex tasks with shared context
          </p>
        </div>

        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
            <Target className="text-blue-400" size={20} />
          </div>
          <h3 className="font-semibold mb-2">Shared Goals</h3>
          <p className="text-gray-400 text-sm">
            Set team objectives and track progress across all agents
          </p>
        </div>

        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
            <MessageSquare className="text-green-400" size={20} />
          </div>
          <h3 className="font-semibold mb-2">Team Communication</h3>
          <p className="text-gray-400 text-sm">
            Agents communicate and coordinate through shared channels
          </p>
        </div>
      </div>
    </div>
  );
}
