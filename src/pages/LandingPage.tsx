import React from 'react';
import { ArrowRight, Shield, Zap, Lock } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <Lock className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">CipherWrite</div>
                <div className="text-xs text-gray-500">Secure Notes</div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#security" className="text-gray-600 hover:text-gray-900 transition-colors">Security</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
            </nav>

            {/* CTA Button */}
            <button
              onClick={onGetStarted}
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-red-50 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>Secure Note-Taking</span>
            <span className="text-gray-500">End-to-end encrypted</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Organize your thoughts,<br />
            <span className="text-gray-700">secure your ideas.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Write, organize, and protect your notes with military-grade encryption. 
            Focus on what matters while we keep your thoughts safe.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16">
            <button
              onClick={onGetStarted}
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 flex items-center space-x-2"
            >
              <span>Start Writing</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
              Learn More
            </button>
          </div>

          {/* App Preview Placeholder */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl">
              <div className="bg-white rounded-xl overflow-hidden">
                {/* Mock App Interface */}
                <div className="h-12 bg-gray-50 border-b border-gray-200 flex items-center px-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="text-sm text-gray-600">CipherWrite</div>
                  </div>
                </div>
                
                <div className="flex h-96">
                  {/* Sidebar */}
                  <div className="w-80 bg-gray-50 border-r border-gray-200 p-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">Meeting Notes</div>
                          <div className="text-xs text-gray-500">2 hours ago</div>
                        </div>
                        <Lock className="w-3 h-3 text-gray-400" />
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-700">Project Ideas</div>
                          <div className="text-xs text-gray-500">1 day ago</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-700">Personal Journal</div>
                          <div className="text-xs text-gray-500">3 days ago</div>
                        </div>
                        <Lock className="w-3 h-3 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Editor */}
                  <div className="flex-1 p-6">
                    <div className="h-8 bg-gray-100 rounded mb-4 w-48"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-100 rounded w-full"></div>
                      <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-100 rounded w-4/6"></div>
                      <div className="h-4 bg-gray-100 rounded w-full"></div>
                      <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-16 flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-orange-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="text-left">
                <div className="flex items-center space-x-1">
                  <div className="flex text-yellow-400">
                    {'★'.repeat(5)}
                  </div>
                  <span className="text-sm font-semibold text-gray-900">4.9</span>
                </div>
                <div className="text-xs text-gray-500">From 1,200+ users</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;