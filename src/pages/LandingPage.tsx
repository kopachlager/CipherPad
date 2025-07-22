import React from 'react';
import { ArrowRight, Shield, Zap, Lock, Plus } from 'lucide-react';

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
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-20">
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

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-gray-50 rounded-3xl p-10 border border-gray-200">
              <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-8">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                End-to-End Encryption
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Navigate your digital privacy effortlessly with our meticulously designed 
                encryption, offering a clear and organized view of your personal notes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 rounded-3xl p-10 border border-gray-200">
              <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-8">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Streamlined Organization
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Navigate your workflow seamlessly with our meticulously designed 
                organization, offering a clear and organized view of your notes.
              </p>
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
                The pinnacle of secure note-taking
              </h2>
              <p className="text-lg text-gray-600 mb-12 leading-relaxed">
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
              Your ultimate CipherWrite secure note-taking experience
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              The world's most advanced secure note-taking app. Meticulously crafted with 
              end-to-end encryption, real-time sync, and distraction-free writing experience.
            </p>
          </div>

          {/* Testimonials Grid - 2 rows, 3 columns */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
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
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
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
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
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
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
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
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
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
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
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
                </div>
                <div>
                  <div className="font-medium text-gray-900">Alex Thompson</div>
                  <div className="text-gray-500 text-sm">Tech Entrepreneur</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-3xl p-10 border border-gray-200">
              <div className="flex text-yellow-400 mb-6 text-lg">
                {'★'.repeat(5)}
              </div>
              <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                "As a writer, I need my notes to be secure and accessible. CipherWrite 
                delivers on both fronts with excellent sync across all my devices."
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">MC</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900">Michael Chen</div>
                  <div className="text-gray-500">Freelance Writer</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-3xl p-10 border border-gray-200">
              <div className="flex text-yellow-400 mb-6 text-lg">
                {'★'.repeat(5)}
              </div>
              <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                "The code mode is perfect for my technical notes. Clean, fast, and 
                the encryption means I can store sensitive project details safely."
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">AR</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900">Alex Rodriguez</div>
                  <div className="text-gray-500">Software Engineer</div>
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
              Choose the plan that's right for you
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Compare our pricing plans to find the one that best suits your needs and budget.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
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

            {/* Pro Plan */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm relative">
              {/* Popular Badge */}
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                <div className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Pro plan</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Unlock advanced features for a more enhanced experience.
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
                    Full access to secure note-taking with advanced features
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm leading-relaxed">
                    Be the first to receive AI-powered writing assistance
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm leading-relaxed">
                    Unlock additional templates available only to Pro members
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm leading-relaxed">
                    Join exclusive Q&A sessions and engage with our community at a deeper level
                  </span>
                </li>
              </ul>
            </div>

            {/* Business Plan */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Business plan</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Tailored for serious creators and businesses seeking a premium experience.
                </p>
              </div>
              
              <div className="mb-8">
                <div className="text-5xl font-bold text-gray-900 mb-2">$49.99</div>
                <div className="text-gray-500">One-time payment</div>
              </div>
              
              <button
                onClick={onGetStarted}
                className="w-full py-3 px-6 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors mb-8"
              >
                Contact Us
              </button>
              
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm leading-relaxed">
                    Full access to our library of templates for business products
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm leading-relaxed">
                    Be the first to receive new features and enhancements
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm leading-relaxed">
                    Unlock additional templates available only to Business members
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm leading-relaxed">
                    Enjoy priority support for any inquiries or assistance
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm leading-relaxed">
                    Get personalized help with template customization to suit your unique needs
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

      {/* About Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left - Illustration */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-12 border border-gray-200">
                {/* Simple illustration placeholder */}
                <div className="text-center">
                  <div className="w-40 h-40 bg-gray-100 rounded-full mx-auto mb-8 flex items-center justify-center">
                    <Shield className="w-20 h-20 text-gray-400" />
                  </div>
                  <div className="text-8xl mb-6">🛡️</div>
                  <div className="text-gray-600 text-lg">Your data is protected</div>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div>
              <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span>About us</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Hey there! We're the creative minds behind CipherWrite.
              </h2>
              <p className="text-lg text-gray-600 mb-12 leading-relaxed">
                Guided by a relentless commitment to simplifying your writing 
                journey through intuitive and secure note-taking tools.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-12">
                <div>
                  <div className="text-5xl font-bold text-orange-500 mb-3">5K+</div>
                  <div className="text-gray-700 font-bold text-lg">Notes Created Daily</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-orange-500 mb-3">100+</div>
                  <div className="text-gray-700 font-bold text-lg">Countries Served</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-orange-500 mb-3">256</div>
                  <div className="text-gray-700 font-bold text-lg">Bit Encryption</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-orange-500 mb-3">24/7</div>
                  <div className="text-gray-700 font-bold text-lg">Support Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                <Lock className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-bold text-gray-900 text-lg">CipherWrite</div>
                <div className="text-sm text-gray-500">Secure Notes</div>
              </div>
            </div>
            <p className="text-gray-600 mb-12 text-lg">
              Helping individuals and teams organize their thoughts securely.
            </p>
            
            {/* Simple company logos */}
            <div className="flex items-center justify-center space-x-12 opacity-60">
              <div className="text-gray-400 font-medium text-lg">Trusted by teams at</div>
              <div className="flex items-center space-x-8">
                <div className="w-8 h-8 bg-blue-500 rounded"></div>
                <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                <div className="w-8 h-8 bg-purple-500 rounded"></div>
                <div className="w-8 h-8 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;