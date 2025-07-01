import { auth } from '@/app/(auth)/auth';
import { redirect } from 'next/navigation';
import { BookOpen, Search, FileText, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function KnowledgePage() {
  const session = await auth();

  if (!session) {
    redirect('/api/auth/guest');
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Knowledge</h1>
          <p className="text-gray-400">Documentation and learning resources</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
          <Search className="mr-2" size={16} />
          Search Docs
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="text-gray-400" size={32} />
          </div>
          <h2 className="text-xl font-semibold mb-2">Knowledge Base</h2>
          <p className="text-gray-400 mb-6">
            Comprehensive documentation and tutorials for Jaguar SDK
          </p>
          <Button className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
            <BookOpen className="mr-2" size={16} />
            Browse Documentation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
            <FileText className="text-purple-400" size={20} />
          </div>
          <h3 className="font-semibold mb-2">API Documentation</h3>
          <p className="text-gray-400 text-sm">
            Complete reference for all Jaguar SDK APIs and endpoints
          </p>
        </div>

        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
            <Lightbulb className="text-blue-400" size={20} />
          </div>
          <h3 className="font-semibold mb-2">Tutorials</h3>
          <p className="text-gray-400 text-sm">
            Step-by-step guides to build your first AI agents
          </p>
        </div>

        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
            <Search className="text-green-400" size={20} />
          </div>
          <h3 className="font-semibold mb-2">AI-Powered Search</h3>
          <p className="text-gray-400 text-sm">
            Find answers instantly with Jaguar-powered documentation search
          </p>
        </div>
      </div>
    </div>
  );
}
