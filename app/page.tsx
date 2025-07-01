'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const [dreamAgent, setDreamAgent] = useState('');
  const router = useRouter();

  const handleSubmit = () => {
    if (!dreamAgent.trim()) return;

    // Encode the dream agent description as a URL parameter
    const encodedQuery = encodeURIComponent(dreamAgent);
    // Redirect to dashboard chat with query parameter
    router.push(`/dashboard/chat?query=${encodedQuery}&from=landing`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[rgb(217,181,113)] to-yellow-600 rounded-xl flex items-center justify-center">
            <span className="text-black font-bold">J</span>
          </div>
          <div>
            <h1 className="jaguar-h3">jaguar</h1>
            <p className="jaguar-helper uppercase tracking-wide">
              Open Source AGI
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <a
            href="#features"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Agents
          </a>
          <a
            href="#features"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Teams
          </a>
          <a
            href="#features"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Marketplace
          </a>
          <a
            href="#features"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Nature
          </a>
          <a
            href="#features"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Learn
          </a>
        </div>

        <div className="flex items-center space-x-4">
          <a
            href="/login"
            className="jaguar-body-secondary hover:text-white transition-colors"
          >
            Sign In
          </a>
          <button
            type="button"
            onClick={() => router.push('/dashboard/chat')}
            className="jaguar-button-primary"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="jaguar-pill">world&apos;s first open source agi</div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="jaguar-h1">manifest your dreams</h1>
            <h1 className="jaguar-h1">
              with{' '}
              <span className="bg-gradient-to-r from-[rgb(217,181,113)] to-yellow-400 bg-clip-text text-transparent">
                ai agents
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="jaguar-body-secondary text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
            Turn your wildest ideas into reality. Build, deploy, and monetize
            intelligent agents that work together to automate your world.
          </p>

          {/* Credibility Indicators */}
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <span>⚡</span>
              <span>Powered by n8n</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🌐</span>
              <span>OpenWebUI Backend</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🔗</span>
              <span>OpenRouter Models</span>
            </div>
          </div>
        </div>

        {/* Dream Input Section */}
        <div className="max-w-4xl mx-auto mt-16 space-y-8">
          <div className="relative">
            <textarea
              value={dreamAgent}
              onChange={(e) => setDreamAgent(e.target.value)}
              placeholder="Describe your dream... I'll help you build the agents to make it happen"
              className="w-full min-h-[120px] jaguar-card text-white placeholder:text-gray-400 text-lg p-6 resize-none focus:ring-2 focus:ring-[rgb(217,181,113)] focus:border-transparent outline-none jaguar-body"
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!dreamAgent.trim()}
              className="absolute bottom-4 right-4 bg-[rgb(217,181,113)] hover:shadow-[0_0_20px_rgba(217,181,113,0.3)] disabled:opacity-50 disabled:cursor-not-allowed p-3 rounded-xl transition-all text-black"
            >
              →
            </button>
          </div>

          {/* Dream Starters */}
          <div className="space-y-4">
            <p className="text-center jaguar-body-secondary">
              Or try one of these dream starters:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Create an agent that automates my morning routine with weather and calendar updates',
                'Build a content creation team that writes and publishes blog posts',
                'Design an agent that monitors my business metrics and sends alerts',
                'Create a research assistant that finds grants for regenerative agriculture',
                'Build an agent that manages my social media presence across platforms',
                'Design a customer support agent that handles common inquiries',
              ].map((starter) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => setDreamAgent(starter)}
                  className="text-left p-4 jaguar-card hover:border-[rgb(217,181,113)] transition-all duration-200 jaguar-helper hover:text-white"
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="jaguar-h2">the complete ai agent platform</h2>
          <p className="jaguar-body-secondary text-xl max-w-3xl mx-auto">
            Build, deploy, and monetize intelligent agent teams that work
            together to automate your workflows and align profit with purpose.
          </p>
        </div>
        <div className="jaguar-divider mb-16" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: 'agent creation',
              description:
                'Build custom agents with specific capabilities and personalities',
              icon: '🤖',
            },
            {
              title: 'team collaboration',
              description:
                'Organize agents into teams that work together on complex tasks',
              icon: '👥',
            },
            {
              title: 'workflow automation',
              description:
                'Connect agents to n8n workflows for powerful automation',
              icon: '⚡',
            },
            {
              title: 'monetization',
              description:
                'Deploy and monetize your agents on the Spatial Network',
              icon: '💰',
            },
            {
              title: 'open source',
              description:
                'Fully open source platform that you can self-host or extend',
              icon: '🌐',
            },
            {
              title: 'api integrations',
              description:
                'Connect your agents to any API or service with our integration capabilities',
              icon: '🔗',
            },
          ].map((feature) => (
            <div key={feature.title} className="jaguar-card group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
                {feature.icon}
              </div>
              <h3 className="jaguar-h3 mb-2">{feature.title}</h3>
              <p className="jaguar-body-secondary">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="space-y-6">
          <h2 className="jaguar-h2">
            start building above to create your first ai agent
          </h2>
          <p className="jaguar-body-secondary text-xl">
            No signup required to try
          </p>
          <button
            type="button"
            onClick={() => router.push('/dashboard/chat')}
            className="jaguar-button-primary text-lg px-8 py-4"
          >
            Start Building Now
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="jaguar-divider py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[rgb(217,181,113)] to-yellow-600 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">J</span>
              </div>
              <div>
                <h3 className="jaguar-h3">jaguar sdk</h3>
                <p className="jaguar-helper">Open Source AGI</p>
              </div>
            </div>
            <p className="jaguar-helper">
              © 2025 Jaguar SDK. Open source and built for the future.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
