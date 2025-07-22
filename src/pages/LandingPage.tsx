import React from 'react';
import { 
  Shield, 
  Lock, 
  Zap, 
  Eye, 
  Code, 
  Mic, 
  Download, 
  Star,
  ArrowRight,
  CheckCircle,
  Users,
  Globe,
  Smartphone
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <Lock className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CipherWrite</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#security" className="text-gray-600 hover:text-gray-900 transition-colors">Security</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
            </div>
            
            <button
              onClick={onGetStarted}
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Secure • Private • Encrypted</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight animate-fade-in delay-200">
            Your thoughts,
            <br />
            <span className="text-gray-600">completely secure</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in delay-300">
            CipherWrite is the most secure note-taking app ever built. With military-grade encryption 
            and zero-knowledge architecture, your ideas stay private—even from us.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in delay-400">
            <button
              onClick={onGetStarted}
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2"
            >
              <span>Start Writing Securely</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Free forever • No credit card required</span>
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
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  Military-Grade Encryption
                </h3>
                <p className="text-gray-600 mb-6 text-lg">
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
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Lightning Fast
                </h3>
                <p className="text-gray-600">
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
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Focus Mode
                </h3>
                <p className="text-gray-600">
                  Distraction-free writing environment that helps you concentrate on what matters.
                </p>
              </div>
              
              {/* Large Feature Card */}
              <div className="md:col-span-2 bg-white rounded-3xl p-10 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-2 animate-slide-in-right delay-200">
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-8">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                </h3>
                <p className="text-gray-600 mb-6 text-lg">
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
                <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center mb-4">
                  <Mic className="w-5 h-5 text-white" />
                <h4 className="text-lg font-bold text-gray-900 mb-3">
                  Voice Notes
                </h4>
                <p className="text-sm text-gray-600">
                  Convert speech to text with AI-powered transcription.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-500 hover:-translate-y-1 animate-fade-in delay-400">
                <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center mb-4">
                  <Download className="w-5 h-5 text-white" />
                <h4 className="text-lg font-bold text-gray-900 mb-3">
                  Export Anywhere
                </h4>
                <p className="text-sm text-gray-600">
                  Export to PDF, Markdown, or plain text formats.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-500 hover:-translate-y-1 animate-fade-in delay-500">
                <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5 text-white" />
                <h4 className="text-lg font-bold text-gray-900 mb-3">
                  Offline First
                </h4>
                <p className="text-sm text-gray-600">
                  Work anywhere, anytime. Sync when you're back online.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-500 hover:-translate-y-1 animate-fade-in delay-600">
                <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center mb-4">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">
                </h4>
                <p className="text-sm text-gray-600">
                  Quick access to your most important notes and ideas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-red-50 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              <span>Security First</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Bank-level security for your thoughts
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We use the same encryption standards as major banks and government agencies 
              to protect your most sensitive information.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">End-to-End Encryption</h3>
              <p className="text-gray-600">
                Your notes are encrypted on your device before they ever leave. 
                Not even we can read them.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Zero-Knowledge</h3>
              <p className="text-gray-600">
                We have zero knowledge of your data. Your encryption keys 
                never leave your devices.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Open Source</h3>
              <p className="text-gray-600">
                Our security is transparent and auditable. 
                Trust through verification, not promises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Ready to secure your thoughts?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Join thousands of writers, developers, and professionals who trust 
            CipherWrite with their most important ideas.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={onGetStarted}
              className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2"
            >
              <span>Start Writing Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-2 text-gray-300">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Free forever • No setup required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <Lock className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CipherWrite</span>
            </div>
            
            <div className="flex items-center space-x-8 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Support</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            © 2024 CipherWrite. All rights reserved. Your data stays yours, always.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
  )
}