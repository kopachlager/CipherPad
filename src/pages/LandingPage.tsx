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
        const maxTilt = 8;
        const tiltAmount = Math.min(scrollY / 100, maxTilt);
        heroGraphic.style.transform = `perspective(1000px) rotateX(${tiltAmount}deg)`;
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
          <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            <span>Secure Note-Taking</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight max-w-5xl mx-auto">
            Organize your thoughts,<br />
            <span className="text-gray-600">secure your ideas.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Write, organize, and protect your notes with military-grade encryption. 
            Focus on what matters while we keep your thoughts safe.
          </p>
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
          <div className="relative max-w-6xl mx-auto">
            <div className="bg-gray-900 rounded-3xl p-6 shadow-2xl transform transition-transform duration-1000 ease-out" id="hero-graphic">
              <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
                {/* Mock App Interface */}
                <div className="h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center px-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">CipherWrite</div>
                  </div>
                </div>
                
                <div className="flex h-[500px]">
                  {/* Sidebar */}
                  <div className="w-80 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Meeting Notes</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</div>
                        </div>
                        <Lock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Project Ideas</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">1 day ago</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Personal Journal</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">3 days ago</div>
                        </div>
                        <Lock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Editor */}
                  <div className="flex-1 p-8">
                    <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-lg mb-6 w-64"></div>
                    <div className="space-y-4">
                      <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded-lg w-full"></div>
                      <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded-lg w-5/6"></div>
                      <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded-lg w-4/6"></div>
                      <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded-lg w-full"></div>
                      <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded-lg w-3/4"></div>
                      <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded-lg w-5/6"></div>
                    </div>
                  </div>
                </div>
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

      {/* Testimonials */}
      <section id="testimonials" className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Loved by writers and developers</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { name: 'Ava, Product Designer', text: 'CipherWrite is my daily writing space — simple, fast, and beautiful.' },
              { name: 'Liam, Software Engineer', text: 'I use code mode all the time. Autosave and sync just work.' },
              { name: 'Mia, Researcher', text: 'Encryption gives me peace of mind for sensitive notes.' },
            ].map((t, i) => (
              <div key={i} className="p-6 rounded-xl border border-gray-200 bg-white">
                <div className="flex items-center gap-1 text-yellow-500 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-3">{t.text}</p>
                <div className="text-sm text-gray-500">{t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Simple, transparent pricing</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { title: 'Starter', price: 'Free', features: ['Unlimited notes', 'Local encryption', 'Basic export'] },
              { title: 'Pro', price: '$29 one-time', features: ['Sync across devices', 'Code mode & themes', 'Priority support'] },
              { title: 'Team', price: 'Contact', features: ['Shared folders', 'Role-based access', 'SLA & support'] },
            ].map((plan, i) => (
              <div key={i} className="p-6 rounded-xl border border-gray-200 bg-white flex flex-col">
                <h3 className="font-semibold text-gray-900 mb-2">{plan.title}</h3>
                <div className="text-2xl font-bold text-gray-900 mb-4">{plan.price}</div>
                <ul className="space-y-2 text-gray-700 flex-1">
                  {plan.features.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button className="mt-6 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md">Choose {plan.title}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Frequently asked questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Do you store my password?</h3>
              <p className="text-gray-600">No. Your password never leaves your device. Notes are encrypted locally with a key derived from your password.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Can I use it offline?</h3>
              <p className="text-gray-600">Yes. The app is a PWA and works offline. Sync resumes when you’re online.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Can I export my notes?</h3>
              <p className="text-gray-600">Export as TXT, Markdown, or JSON at any time from the editor.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                  <Lock className="w-5 h-5 text-gray-900" />
                </div>
                <div className="font-bold text-white text-2xl">CipherWrite</div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-8 max-w-md">
                Secure, elegant note‑taking for writers, developers, and teams.
              </p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">All systems operational</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-6">Product</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Updates</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-6">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Reference</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-6">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

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
