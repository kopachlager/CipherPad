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

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <span>Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Your ultimate secure notepad
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover how our note-taking app can revolutionize the way you work and 
              organize. Explore features designed to enhance your productivity.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-6">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                End-to-End Encryption
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Navigate your digital privacy effortlessly with our meticulously designed 
                encryption, offering a clear and secure view of your personal notes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Lightning Fast Sync
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Navigate your workflow seamlessly with our real-time synchronization, 
                offering instant access to your notes across all devices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span>The numbers</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                The pinnacle of secure note-taking
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                The world's most trusted note-taking app. Meticulously crafted with 
                end-to-end encryption, real-time sync, and distraction-free writing.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-4xl font-bold text-orange-500 mb-2">1000+</div>
                  <div className="text-gray-900 font-semibold mb-1">Active users</div>
                  <div className="text-sm text-gray-600">
                    Growing community of writers and professionals
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-orange-500 mb-2">99.9%</div>
                  <div className="text-gray-900 font-semibold mb-1">Uptime</div>
                  <div className="text-sm text-gray-600">
                    Reliable service you can count on
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-orange-500 mb-2">#1</div>
                  <div className="text-gray-900 font-semibold mb-1">Security focused</div>
                  <div className="text-sm text-gray-600">
                    Leading encryption standards
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-orange-500 mb-2">24/7</div>
                  <div className="text-gray-900 font-semibold mb-1">Sync availability</div>
                  <div className="text-sm text-gray-600">
                    Your notes, everywhere, anytime
                  </div>
                </div>
              </div>
            </div>

            {/* Right - App Preview */}
            <div className="relative">
              <div className="bg-gray-900 rounded-2xl p-6 shadow-2xl">
                <div className="bg-white rounded-xl overflow-hidden">
                  {/* Mock App Header */}
                  <div className="h-12 bg-gray-50 border-b border-gray-200 flex items-center px-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="text-sm text-gray-600 font-medium">2024 Note Planner</div>
                    </div>
                  </div>
                  
                  {/* Mock App Content */}
                  <div className="p-6 h-80">
                    <div className="mb-4">
                      <div className="text-lg font-semibold text-gray-900 mb-2">How to use:</div>
                      <div className="text-sm text-gray-600 mb-4">
                        For each day, choose what to write from your thoughts, where you keep ideas and notes.
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">📝 Daily Notes</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">🛒 Ideas List</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">📅 Weekly Plan</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <span>Testimonials</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What our users say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of writers, professionals, and teams who trust CipherWrite 
              to keep their thoughts secure and organized.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="flex text-yellow-400 mb-4">
                {'★'.repeat(5)}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "CipherWrite has completely transformed how I organize my thoughts. 
                The encryption gives me peace of mind, and the interface is so clean."
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">SJ</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Sarah Johnson</div>
                  <div className="text-sm text-gray-500">Product Manager</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="flex text-yellow-400 mb-4">
                {'★'.repeat(5)}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "As a writer, I need my notes to be secure and accessible. CipherWrite 
                delivers on both fronts with excellent sync across all my devices."
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">MC</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Michael Chen</div>
                  <div className="text-sm text-gray-500">Freelance Writer</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="flex text-yellow-400 mb-4">
                {'★'.repeat(5)}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "The code mode is perfect for my technical notes. Clean, fast, and 
                the encryption means I can store sensitive project details safely."
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">AR</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Alex Rodriguez</div>
                  <div className="text-sm text-gray-500">Software Engineer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <span>Pricing</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start free with all essential features. Upgrade to unlock AI-powered 
              writing assistance and advanced capabilities.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="text-5xl font-bold text-gray-900 mb-2">$0</div>
                <div className="text-gray-500">Forever free</div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Unlimited notes</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">End-to-end encryption</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Real-time sync</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Code mode</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Folder organization</span>
                </li>
              </ul>
              
              <button
                onClick={onGetStarted}
                className="w-full py-3 px-6 border border-gray-300 hover:border-gray-400 text-gray-700 rounded-lg font-semibold transition-colors"
              >
                Get Started Free
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-800 relative">
              {/* Popular Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                <div className="text-5xl font-bold text-white mb-2">$9</div>
                <div className="text-gray-400">per month</div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-300">Everything in Free</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  </div>
                  <span className="text-white font-medium">AI writing assistant</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  </div>
                  <span className="text-white font-medium">Smart suggestions</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  </div>
                  <span className="text-white font-medium">Voice-to-text</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  </div>
                  <span className="text-white font-medium">Advanced search</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  </div>
                  <span className="text-white font-medium">Priority support</span>
                </li>
              </ul>
              
              <button
                onClick={onGetStarted}
                className="w-full py-3 px-6 bg-white hover:bg-gray-100 text-gray-900 rounded-lg font-semibold transition-colors"
              >
                Start Pro Trial
              </button>
            </div>
          </div>

          {/* FAQ or Additional Info */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              All plans include 30-day money-back guarantee
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <span>✓ No setup fees</span>
              <span>✓ Cancel anytime</span>
              <span>✓ Secure payments</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left - Illustration */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                {/* Simple illustration placeholder */}
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Shield className="w-16 h-16 text-gray-400" />
                  </div>
                  <div className="text-6xl mb-4">🛡️</div>
                  <div className="text-sm text-gray-600">Your data is protected</div>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div>
              <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span>About us</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Hey there! We're the creative minds behind CipherWrite.
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Guided by a relentless commitment to simplifying your writing 
                journey through intuitive and secure note-taking tools.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-4xl font-bold text-orange-500 mb-2">5K+</div>
                  <div className="text-gray-700 font-medium">Notes Created Daily</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-orange-500 mb-2">100+</div>
                  <div className="text-gray-700 font-medium">Countries Served</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-orange-500 mb-2">256</div>
                  <div className="text-gray-700 font-medium">Bit Encryption</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-orange-500 mb-2">24/7</div>
                  <div className="text-gray-700 font-medium">Support Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <Lock className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">CipherWrite</div>
                <div className="text-xs text-gray-500">Secure Notes</div>
              </div>
            </div>
            <p className="text-gray-600 mb-8">
              Helping individuals and teams organize their thoughts securely.
            </p>
            
            {/* Simple company logos */}
            <div className="flex items-center justify-center space-x-8 opacity-60">
              <div className="text-gray-400 font-medium">Trusted by teams at</div>
              <div className="flex items-center space-x-6">
                <div className="w-6 h-6 bg-blue-500 rounded"></div>
                <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                <div className="w-6 h-6 bg-purple-500 rounded"></div>
                <div className="w-6 h-6 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;