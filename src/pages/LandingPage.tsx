import React from 'react';
import { useEffect } from 'react';
import { ArrowRight, Shield, Zap, Lock, Plus, Eye, Code, Mic, Download, Star } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  useEffect(() => {
    const handleScroll = () => {
      const heroGraphic = document.getElementById('hero-graphic');
      if (heroGraphic) {
        const scrollY = window.scrollY;
        const maxTilt = -8; // Maximum tilt in degrees (negative for opposite direction)
        const tiltAmount = Math.min(scrollY / 100, maxTilt);
        heroGraphic.style.transform = `perspective(1000px) rotateX(${Math.abs(tiltAmount)}deg)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
              <div className="font-bold text-xl text-gray-900">CipherWrite</div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">Features</a>
              <a href="#testimonials" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">Reviews</a>
              <a href="#pricing" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">Pricing</a>
            </nav>

            {/* CTA Button */}
            <button
              onClick={onGetStarted}
              className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2 rounded-full font-medium transition-colors"
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
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight max-w-5xl mx-auto">
            Organize your thoughts,<br />
            <span className="text-gray-600">secure your ideas.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Write, organize, and protect your notes with military-grade encryption. 
            Focus on what matters while we keep your thoughts safe.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-20">
            <button
              onClick={onGetStarted}
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-full font-semibold text-lg transition-all hover:scale-105 flex items-center space-x-2"
            >
              <span>Start Writing</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-full font-semibold text-lg transition-colors">
              Learn More
            </button>
          </div>

          {/* App Preview Placeholder */}
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-gray-900 rounded-3xl p-5 shadow-2xl transform transition-transform duration-1000 ease-out" id="hero-graphic" style={{ transform: 'perspective(1000px) rotateX(-2deg)' }}>
              <div className="bg-white rounded-2xl overflow-hidden">
                {/* Mock App Interface */}
                <div className="h-12 bg-white border-b border-gray-200 flex items-center px-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="text-sm text-gray-600 font-medium">CipherWrite</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1.5 rounded-md hover:bg-gray-100 transition-colors">
                      <div className="w-4 h-4 bg-gray-400 rounded"></div>
                    </button>
                    <button className="p-1.5 rounded-md hover:bg-gray-100 transition-colors">
                      <div className="w-4 h-4 bg-gray-400 rounded"></div>
                    </button>
                    <button className="p-1.5 rounded-md hover:bg-gray-100 transition-colors">
                      <div className="w-4 h-4 bg-gray-400 rounded"></div>
                    </button>
                  </div>
                </div>
                
                <div className="flex h-[425px]">
                  {/* Sidebar */}
                  <div className="w-72 bg-gray-50 border-r border-gray-200 p-4">
                    {/* Search Bar */}
                    <div className="mb-4">
                      <div className="relative">
                        <div className="w-3 h-3 bg-gray-400 rounded absolute left-3 top-1/2 transform -translate-y-1/2"></div>
                        <div className="w-full pl-9 pr-3 py-2 bg-gray-100 border border-gray-200 rounded-md">
                          <div className="h-3 bg-gray-300 rounded w-20"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quick Access */}
                    <div className="mb-4">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quick Access</div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-md">
                          <div className="w-3 h-3 bg-gray-500 rounded"></div>
                          <span className="text-sm font-medium text-gray-900">All Notes</span>
                          <div className="ml-auto text-xs bg-gray-200 px-2 py-0.5 rounded-full">12</div>
                        </div>
                        <div className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded-md">
                          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                          <span className="text-sm text-gray-700">Favorites</span>
                          <div className="ml-auto text-xs bg-gray-200 px-2 py-0.5 rounded-full">3</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Notes List */}
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Recent Notes</div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 p-3 bg-white rounded-lg shadow-sm border border-gray-200">
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-gray-400 rounded"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">Meeting Notes</div>
                            <div className="text-xs text-gray-500">2 hours ago</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 p-3 hover:bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-700 truncate">Project Ideas</div>
                            <div className="text-xs text-gray-500">1 day ago</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 p-3 hover:bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-gray-400 rounded"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-700 truncate">Personal Journal</div>
                            <div className="text-xs text-gray-500">3 days ago</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Main Editor Area */}
                  <div className="flex-1 flex flex-col">
                    {/* Toolbar */}
                    <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1.5 rounded hover:bg-gray-100">
                          <div className="w-4 h-4 bg-gray-500 rounded"></div>
                        </button>
                        <div className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">Plain Text</div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button className="p-1.5 rounded hover:bg-gray-100">
                          <div className="w-4 h-4 bg-gray-400 rounded"></div>
                        </button>
                        <button className="p-1.5 rounded hover:bg-gray-100">
                          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                        </button>
                        <button className="p-1.5 rounded hover:bg-gray-100">
                          <div className="w-4 h-4 bg-gray-400 rounded"></div>
                        </button>
                      </div>
                    </div>
                    
                    {/* Editor Content */}
                    <div className="flex-1 p-6">
                      {/* Title */}
                      <div className="h-8 bg-gray-100 rounded-lg mb-6 w-64"></div>
                      
                      {/* Content Lines */}
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-100 rounded w-full"></div>
                        <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-100 rounded w-4/6"></div>
                        <div className="h-4 bg-gray-100 rounded w-full"></div>
                        <div className="h-4 bg-gray-100 rounded w-3/4"></div>

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
      <section id="features" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-20 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <span>Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 max-w-4xl mx-auto leading-tight">
              Your ultimate secure note-taking experience
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover how CipherWrite can revolutionize the way you work and 
              organize. Explore a myriad of features designed to enhance your productivity.
            </p>
          </div>

          {/* Feature Cards - Asymmetric Layout */}
          <div className="max-w-6xl mx-auto space-y-8">
            {/* First Row - Large + Small */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Large Feature Card */}
              <div className="md:col-span-2 bg-white rounded-3xl p-10 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-slide-in-left">
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-8">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  Military-Grade Encryption
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg mb-6">
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
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-slide-in-right">
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Lightning Fast
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Instant sync across all your devices with real-time collaboration features.
                </p>
              </div>
            </div>
            
            {/* Second Row - Small + Large */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Small Feature Card */}
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-slide-in-left delay-100">
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-6">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Focus Mode
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Distraction-free writing environment that helps you concentrate on what matters.
                </p>
              </div>
              
              {/* Large Feature Card */}
              <div className="md:col-span-2 bg-white rounded-3xl p-10 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-slide-in-right delay-100">
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-8">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  Smart Organization
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg mb-6">
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
              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-fade-in delay-150">
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-8">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">
                  Voice Notes
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Convert speech to text with AI-powered transcription.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-fade-in delay-200">
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-8">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">
                  Export Anywhere
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Export to PDF, Markdown, or plain text formats.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-fade-in delay-250">
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-8">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">
                  Offline First
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Work anywhere, anytime. Sync when you're back online.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-fade-in delay-300">
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-8">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">
                  Favorites
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
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
                Your guide to CipherWrite wisdom
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
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
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <span>The numbers</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight max-w-4xl mx-auto">
              The pinnacle of secure note-taking
            </h2>
            <p className="text-lg text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
              The world's most trusted note-taking app. Meticulously crafted with 
              end-to-end encryption, real-time sync, and distraction-free writing.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-3">1000+</div>
              <div className="text-gray-900 font-bold mb-2 text-lg">Active users</div>
              <div className="text-gray-600 text-sm">
                Growing community of writers and professionals
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-3">99.9%</div>
              <div className="text-gray-900 font-bold mb-2 text-lg">Uptime</div>
              <div className="text-gray-600 text-sm">
                Reliable service you can count on
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-3">#1</div>
              <div className="text-gray-900 font-bold mb-2 text-lg">Security focused</div>
              <div className="text-gray-600 text-sm">
                Leading encryption standards
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-3">24/7</div>
              <div className="text-gray-900 font-bold mb-2 text-lg">Sync availability</div>
              <div className="text-gray-600 text-sm">
                Your notes, everywhere, anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <span>Testimonials</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 max-w-5xl mx-auto leading-tight">
              Your ultimate CipherWrite secure note-taking experience
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              The world's most advanced secure note-taking app. Meticulously crafted with 
              end-to-end encryption, real-time sync, and distraction-free writing experience.
            </p>
          </div>

          {/* Testimonials Grid - 2 rows, 3 columns */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto animate-fade-in">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
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
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
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
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
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
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
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
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
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
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
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
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <span>Pricing</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 max-w-4xl mx-auto leading-tight">
              Choose the plan that's right for you
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Compare our pricing plans to find the one that best suits your needs and budget.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
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
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm relative hover:shadow-md transition-all duration-300 hover:-translate-y-1">
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
      <footer className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                  <Lock className="w-5 h-5 text-gray-900" />
                </div>
                <div className="font-bold text-white text-2xl">CipherWrite</div>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-md">
                The most secure and intuitive note-taking app for writers, developers, and creative professionals.
              </p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">All systems operational</span>
                </div>
              </div>
            </div>
            
            {/* Product */}
            <div>
              <h4 className="font-semibold text-white mb-6">Product</h4>
              <ul className="space-y-4">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Updates</a></li>
              </ul>
            </div>
            
            {/* Resources */}
            <div>
              <h4 className="font-semibold text-white mb-6">Resources</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Reference</a></li>
              </ul>
            </div>
            
            {/* Company */}
            <div>
              <h4 className="font-semibold text-white mb-6">Company</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom */}
          <div className="border-t border-gray-800 mt-16 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2024 CipherWrite. All rights reserved.
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
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