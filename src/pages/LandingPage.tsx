import React from 'react';
import { ArrowRight, Shield, Zap, Lock, Plus, Eye, Code, Mic, Download, Star } from 'lucide-react';

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
      <section className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            <span>Secure Note-Taking</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 max-w-5xl mx-auto" style={{ fontSize: '56px', lineHeight: '64px', fontWeight: 700, color: 'rgb(28, 28, 28)' }}>
            Organize your thoughts,<br />
            <span className="text-gray-600">secure your ideas.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base mb-12 max-w-3xl mx-auto" style={{ fontSize: '16px', lineHeight: '26px', fontWeight: 400, color: 'rgb(83, 83, 92)' }}>
            Write, organize, and protect your notes with military-grade encryption. 
            Focus on what matters while we keep your thoughts safe.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-20">
            <button
              onClick={onGetStarted}
              className="bg-gray-900 hover:bg-gray-800 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 flex items-center space-x-2"
            >
              <span>Start Writing</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-10 py-4 rounded-xl font-semibold text-lg transition-colors">
              Learn More
            </button>
          </div>

          {/* App Preview Placeholder */}
          <div className="relative max-w-6xl mx-auto">
            <div className="bg-gray-900 rounded-3xl p-6 shadow-2xl">
              <div className="bg-white rounded-2xl overflow-hidden">
                {/* Mock App Interface */}
                <div className="h-14 bg-gray-50 border-b border-gray-200 flex items-center px-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="text-sm text-gray-600 font-medium">CipherWrite</div>
                  </div>
                </div>
                
                <div className="flex h-[500px]">
                  {/* Sidebar */}
                  <div className="w-80 bg-gray-50 border-r border-gray-200 p-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">Meeting Notes</div>
                          <div className="text-xs text-gray-500">2 hours ago</div>
                        </div>
                        <Lock className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-gray-100 rounded-xl">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-700">Project Ideas</div>
                          <div className="text-xs text-gray-500">1 day ago</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-gray-100 rounded-xl">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-700">Personal Journal</div>
                          <div className="text-xs text-gray-500">3 days ago</div>
                        </div>
                        <Lock className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Editor */}
                  <div className="flex-1 p-8">
                    <div className="h-10 bg-gray-100 rounded-lg mb-6 w-64"></div>
                    <div className="space-y-4">
                      <div className="h-5 bg-gray-100 rounded-lg w-full"></div>
                      <div className="h-5 bg-gray-100 rounded-lg w-5/6"></div>
                      <div className="h-5 bg-gray-100 rounded-lg w-4/6"></div>
                      <div className="h-5 bg-gray-100 rounded-lg w-full"></div>
                      <div className="h-5 bg-gray-100 rounded-lg w-3/4"></div>
                      <div className="h-5 bg-gray-100 rounded-lg w-5/6"></div>
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
      <section id="features" className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-20 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <span>Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 max-w-4xl mx-auto leading-tight">
            <h2 className="text-3xl font-medium mb-6 max-w-4xl mx-auto" style={{ fontSize: '32px', lineHeight: '40px', fontWeight: 500, color: 'rgb(28, 28, 28)' }}>
              Your ultimate secure note-taking experience
            </h2>
            </h2>
            <p className="text-base max-w-3xl mx-auto" style={{ fontSize: '16px', lineHeight: '26px', fontWeight: 400, color: 'rgb(83, 83, 92)' }}>
              Discover how CipherWrite can revolutionize the way you work and 
              organize. Explore a myriad of features designed to enhance your productivity.
            </p>
          </div>

          {/* Feature Cards - Asymmetric Layout */}
          <div className="max-w-6xl mx-auto space-y-8">
            {/* First Row - Large + Small */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Large Feature Card */}
              <div className="md:col-span-2 bg-white rounded-3xl p-10 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-2 animate-slide-in-left">
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-8">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-medium mb-6" style={{ fontSize: '32px', lineHeight: '40px', fontWeight: 500, color: 'rgb(28, 28, 28)' }}>
                  Military-Grade Encryption
                </h3>
                <p className="mb-6" style={{ fontSize: '16px', lineHeight: '26px', fontWeight: 400, color: 'rgb(83, 83, 92)' }}>
                  Your thoughts deserve the highest level of protection. Our end-to-end encryption 
                  ensures that only you can access your notes, using the same security standards 
                  trusted by governments and financial institutions worldwide.
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>AES-256 Encryption</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Zero-Knowledge Architecture</span>
                  </span>
                </div>
              </div>
              
              {/* Small Feature Card */}
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-500 hover:-translate-y-2 animate-slide-in-right">
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-medium mb-4" style={{ fontSize: '20px', lineHeight: '28px', fontWeight: 500, color: 'rgb(28, 28, 28)' }}>
                  Lightning Fast
                </h3>
                <p style={{ fontSize: '16px', lineHeight: '26px', fontWeight: 400, color: 'rgb(83, 83, 92)' }}>
                  Instant sync across all your devices with real-time collaboration features.
                </p>
              </div>
            </div>
            
            {/* Second Row - Small + Large */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Small Feature Card */}
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-500 hover:-translate-y-2 animate-slide-in-left delay-200">
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-6">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-medium mb-4" style={{ fontSize: '20px', lineHeight: '28px', fontWeight: 500, color: 'rgb(28, 28, 28)' }}>
                  Focus Mode
                </h3>
                <p style={{ fontSize: '16px', lineHeight: '26px', fontWeight: 400, color: 'rgb(83, 83, 92)' }}>
                  Distraction-free writing environment that helps you concentrate on what matters.
                </p>
              </div>
              
              {/* Large Feature Card */}
              <div className="md:col-span-2 bg-white rounded-3xl p-10 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-2 animate-slide-in-right delay-200">
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-8">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                <h3 className="text-2xl font-medium mb-6" style={{ fontSize: '32px', lineHeight: '40px', fontWeight: 500, color: 'rgb(28, 28, 28)' }}>
                  Smart Organization
                </h3>
                <p className="mb-6" style={{ fontSize: '16px', lineHeight: '26px', fontWeight: 400, color: 'rgb(83, 83, 92)' }}>
                  Organize your thoughts with intelligent folders, tags, and search. Our smart 
                  categorization helps you find exactly what you're looking for, when you need it. 
                  Perfect for writers, developers, and creative professionals.
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Smart Search</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Auto-tagging</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Nested Folders</span>
                  </span>
                </div>
              </div>
            </div>
            
            {/* Third Row - Additional Features */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-500 hover:-translate-y-1 animate-fade-in delay-300">
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-8">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">
                <h4 className="text-base font-medium mb-3" style={{ fontSize: '18px', lineHeight: '24px', fontWeight: 500, color: 'rgb(28, 28, 28)' }}>
                  Voice Notes
                </h4>
                <p className="text-sm" style={{ fontSize: '14px', lineHeight: '20px', fontWeight: 400, color: 'rgb(83, 83, 92)' }}>
                  Convert speech to text with AI-powered transcription.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-500 hover:-translate-y-1 animate-fade-in delay-400">
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-8">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">
                <h4 className="text-base font-medium mb-3" style={{ fontSize: '18px', lineHeight: '24px', fontWeight: 500, color: 'rgb(28, 28, 28)' }}>
                  Export Anywhere
                </h4>
                <p className="text-sm" style={{ fontSize: '14px', lineHeight: '20px', fontWeight: 400, color: 'rgb(83, 83, 92)' }}>
                  Export to PDF, Markdown, or plain text formats.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-500 hover:-translate-y-1 animate-fade-in delay-500">
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-8">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">
                <h4 className="text-base font-medium mb-3" style={{ fontSize: '18px', lineHeight: '24px', fontWeight: 500, color: 'rgb(28, 28, 28)' }}>
                  Offline First
                </h4>
                <p className="text-sm" style={{ fontSize: '14px', lineHeight: '20px', fontWeight: 400, color: 'rgb(83, 83, 92)' }}>
                  Work anywhere, anytime. Sync when you're back online.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-500 hover:-translate-y-1 animate-fade-in delay-600">
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-8">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">
                <h4 className="text-base font-medium mb-3" style={{ fontSize: '18px', lineHeight: '24px', fontWeight: 500, color: 'rgb(28, 28, 28)' }}>
                  Favorites
                </h4>
                <p className="text-sm" style={{ fontSize: '14px', lineHeight: '20px', fontWeight: 400, color: 'rgb(83, 83, 92)' }}>
                  Quick access to your most important notes and ideas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guide Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span>FAQ</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              <h2 className="text-3xl font-medium mb-6" style={{ fontSize: '32px', lineHeight: '40px', fontWeight: 500, color: 'rgb(28, 28, 28)' }}>
                Your guide to CipherWrite wisdom
              </h2>
              <p style={{ fontSize: '16px', lineHeight: '26px', fontWeight: 400, color: 'rgb(83, 83, 92)' }}>
                Explore the answers to common queries and make the 
                most of your CipherWrite experience.
              </p>
            </div>

            {/* Right - FAQ Items */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    How do I encrypt my notes?
                  </h3>
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <Plus className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Can I customize the editor to suit my needs?
                  </h3>
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <Plus className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Are my notes synced across all devices?
                  </h3>
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <Plus className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    What if I encounter issues with the app?
                  </h3>
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <Plus className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Can I share my notes with my team?
                  </h3>
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <Plus className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span>The numbers</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              <h2 className="text-3xl font-medium mb-6" style={{ fontSize: '32px', lineHeight: '40px', fontWeight: 500, color: 'rgb(28, 28, 28)' }}>
                The pinnacle of secure note-taking
              </h2>
              <p className="mb-12" style={{ fontSize: '16px', lineHeight: '26px', fontWeight: 400, color: 'rgb(83, 83, 92)' }}>
                The world's most trusted note-taking app. Meticulously crafted with 
                end-to-end encryption, real-time sync, and distraction-free writing.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-12">
                <div>
                  <div className="text-5xl font-bold text-orange-500 mb-3">1000+</div>
                  <div className="text-gray-900 font-bold mb-2 text-lg">Active users</div>
                  <div className="text-gray-600">
                    Growing community of writers and professionals
                  </div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-orange-500 mb-3">99.9%</div>
                  <div className="text-gray-900 font-bold mb-2 text-lg">Uptime</div>
                  <div className="text-gray-600">
                    Reliable service you can count on
                  </div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-orange-500 mb-3">#1</div>
                  <div className="text-gray-900 font-bold mb-2 text-lg">Security focused</div>
                  <div className="text-gray-600">
                    Leading encryption standards
                  </div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-orange-500 mb-3">24/7</div>
                  <div className="text-gray-900 font-bold mb-2 text-lg">Sync availability</div>
                  <div className="text-gray-600">
                    Your notes, everywhere, anytime
                  </div>
                </div>
              </div>
            </div>

            {/* Right - App Preview */}
            <div className="relative">
              <div className="bg-gray-900 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl overflow-hidden">
                  {/* Mock App Header */}
                  <div className="h-14 bg-gray-50 border-b border-gray-200 flex items-center px-6">
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
                  <div className="p-8 h-96">
                    <div className="mb-4">
                      <div className="text-xl font-bold text-gray-900 mb-4">How to use:</div>
                      <div className="text-gray-600 mb-6">
                        For each day, choose what to write from your thoughts, where you keep ideas and notes.
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="font-medium text-gray-700">📝 Daily Notes</span>
                      </div>
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-medium text-gray-700">🛒 Ideas List</span>
                      </div>
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="font-medium text-gray-700">📅 Weekly Plan</span>
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
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <span>Testimonials</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 max-w-5xl mx-auto leading-tight">
            <h2 className="text-3xl font-medium mb-6 max-w-5xl mx-auto" style={{ fontSize: '32px', lineHeight: '40px', fontWeight: 500, color: 'rgb(28, 28, 28)' }}>
              Your ultimate CipherWrite secure note-taking experience
            </h2>
            <p className="max-w-3xl mx-auto" style={{ fontSize: '16px', lineHeight: '26px', fontWeight: 400, color: 'rgb(83, 83, 92)' }}>
              The world's most advanced secure note-taking app. Meticulously crafted with 
              end-to-end encryption, real-time sync, and distraction-free writing experience.
            </p>
          </div>

          {/* Testimonials Grid - 2 rows, 3 columns */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto animate-fade-in">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex text-yellow-400 mb-6">
                {'★'.repeat(5)}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "🔒 CipherWrite is a security marvel! The end-to-end encryption keeps me confident, and 
                the collaborative workspace fosters teamwork effortlessly. A total game-changer for secure 
                note-taking workflows. 🛡️⚡ #SecurityBoost #CipherWrite"
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full"></div>
                <div>
                  <div className="font-medium text-gray-900">Sarah Mitchell</div>
                  <div className="text-gray-500 text-sm">Security Analyst</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex text-yellow-400 mb-6">
                {'★'.repeat(5)}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "🌐 Explored various tools for secure note-taking, and 
                nothing beats CipherWrite! Super impressed with the 
                detailed encryption and the ease of navigating 
                complex data. Highly recommended! 🚀📊 
                #SecureNotes #CipherWrite"
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium text-gray-900">David Chen</div>
                  <div className="text-gray-500 text-sm">Data Scientist</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex text-yellow-400 mb-6">
                {'★'.repeat(5)}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "📝 @CipherWrite's brainchild, Secure Notes, is a 
                testament to their commitment to simplifying 
                business processes. Kudos for creating an 
                invaluable toolkit for entrepreneurs like me! 🚀⚡"
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-purple-500 rounded-full"></div>
                <div>
                  <div className="font-medium text-gray-900">Emma Rodriguez</div>
                  <div className="text-gray-500 text-sm">Creative Director</div>
                </div>
              </div>
            </div>

            {/* Testimonial 4 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex text-yellow-400 mb-6">
                {'★'.repeat(5)}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "🔥 Major props to @CipherWrite for Secure Notes! 
                Your vision for streamlining secure writing has made a 
                significant impact on my business. Grateful for your 
                dedication to excellence. 🛡️📊"
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-orange-500 rounded-full"></div>
                <div>
                  <div className="font-medium text-gray-900">Marcus Johnson</div>
                  <div className="text-gray-500 text-sm">Business Owner</div>
                </div>
              </div>
            </div>

            {/* Testimonial 5 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex text-yellow-400 mb-6">
                {'★'.repeat(5)}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "🚀 Elevate your business with CipherWrite! The 
                encryption features are a perfect blend of security and 
                functionality. As an entrepreneur, it's become my 
                go-to toolkit for secure planning and organization."
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-red-500 rounded-full"></div>
                <div>
                  <div className="font-medium text-gray-900">Lisa Park</div>
                  <div className="text-gray-500 text-sm">Startup Founder</div>
                </div>
              </div>
            </div>

            {/* Testimonial 6 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex text-yellow-400 mb-6">
                {'★'.repeat(5)}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "👑 Hats off to @CipherWrite for Secure Notes! 
                Your templates have added immense value to my 
                business. It's not just a toolkit; it's a game-changer 
                for entrepreneurs. 🎯🔒 #BusinessGameChanger 
                #SecureNotes #CipherWrite"
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-teal-500 rounded-full"></div>
                <div>
                  <div className="font-medium text-gray-900">Alex Thompson</div>
                  <div className="text-gray-500 text-sm">Tech Entrepreneur</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <span>Pricing</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 max-w-4xl mx-auto leading-tight">
            <h2 className="text-3xl font-medium mb-6 max-w-4xl mx-auto" style={{ fontSize: '32px', lineHeight: '40px', fontWeight: 500, color: 'rgb(28, 28, 28)' }}>
              Choose the plan that's right for you
            </h2>
            <p className="max-w-3xl mx-auto" style={{ fontSize: '16px', lineHeight: '26px', fontWeight: 400, color: 'rgb(83, 83, 92)' }}>
              Compare our pricing plans to find the one that best suits your needs and budget.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Basic Plan<span className="text-sm font-normal">*</span>
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Start with essentials for personal note-taking
                </p>
              </div>
              
              <div className="mb-8">
                <div className="text-5xl font-bold text-gray-900 mb-2">Free</div>
                <div className="text-gray-500">Forever free</div>
              </div>
              
              <button
                onClick={onGetStarted}
                className="w-full py-3 px-6 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors mb-8"
              >
                Get Started
              </button>
              
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm leading-relaxed">
                    Full access to secure note-taking with end-to-end encryption
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm leading-relaxed">
                    Real-time sync across all your devices
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm leading-relaxed">
                    Code mode with syntax highlighting
                  </span>
                </li>
              </ul>
            </div>

            {/* Writer's Plan */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm relative hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              {/* Popular Badge */}
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                <div className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Writer's Plan</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Perfect for writers, creators, and professionals who need advanced features.
                </p>
              </div>
              
              <div className="mb-8">
                <div className="text-5xl font-bold text-gray-900 mb-2">$9.99</div>
                <div className="text-gray-500">One-time payment</div>
              </div>
              
              <button
                onClick={onGetStarted}
                className="w-full py-3 px-6 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors mb-8"
              >
                Get Started
              </button>
              
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm leading-relaxed">
                    Everything in Basic plus advanced writing tools and AI assistance
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm leading-relaxed">
                    AI-powered writing assistance and grammar checking
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm leading-relaxed">
                    Advanced export options (PDF, DOCX, LaTeX)
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm leading-relaxed">
                    Priority support and exclusive community access
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* FAQ or Additional Info */}
          <div className="text-center mt-16">
            <p className="text-gray-600 mb-6 text-lg">
              All plans include lifetime updates and premium support
            </p>
            <div className="flex items-center justify-center space-x-8 text-gray-500">
              <span>✓ No setup fees</span>
              <span>✓ One-time payment</span>
              <span>✓ Secure payments</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black py-24 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-16">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-100 rounded-2xl flex items-center justify-center shadow-lg">
                  <Lock className="w-5 h-5 text-gray-900" />
                </div>
                <div className="font-bold text-white text-3xl tracking-tight">CipherWrite</div>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-md">
                The world's most secure and intuitive note-taking platform. Trusted by writers, 
                developers, and creative professionals worldwide.
              </p>
              
              {/* Status & Stats */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                  <span className="text-gray-300 text-sm font-medium">All systems operational</span>
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-white">1000+</span>
                    <span>Active Users</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-white">99.9%</span>
                    <span>Uptime</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Product */}
            <div>
              <h4 className="font-semibold text-white mb-8 text-lg">Product</h4>
              <ul className="space-y-5">
                <li><a href="#features" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">Features</a></li>
                <li><a href="#pricing" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">Pricing</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">Security</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">Updates</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">API</a></li>
              </ul>
            </div>
            
            {/* Resources */}
            <div>
              <h4 className="font-semibold text-white mb-8 text-lg">Resources</h4>
              <ul className="space-y-5">
                <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">Documentation</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">Help Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">Community</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">Blog</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">Changelog</a></li>
              </ul>
            </div>
            
            {/* Company */}
            <div>
              <h4 className="font-semibold text-white mb-8 text-lg">Company</h4>
              <ul className="space-y-5">
                <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">About Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">Careers</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">Press Kit</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">Contact</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">Partners</a></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom */}
          <div className="border-t border-gray-700/50 mt-20 pt-10">
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
              <div className="text-gray-400 text-sm">
                © 2024 CipherWrite. All rights reserved.
              </div>
              
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-6 text-sm text-gray-400">
                  <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
                  <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
                  <a href="#" className="hover:text-white transition-colors duration-300">Cookie Policy</a>
                </div>
                
                {/* Social Links */}
                <div className="flex items-center space-x-4">
                  <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
  )
}
  )
}
  )
}