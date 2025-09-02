import React, { useEffect } from 'react';
import { ArrowRight, Lock } from 'lucide-react';

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
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            <span>Secure Note-Taking</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight max-w-5xl mx-auto">
            Organize your thoughts,<nobr />
            <span className="text-gray-600"> secure your ideas.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Write, organize, and protect your notes with strong, client‑side encryption.
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

          {/* Feature Bullets */}
          <div className="max-w-3xl mx-auto" id="features">
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <li className="flex items-center space-x-2 justify-center">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">No setup fees</span>
              </li>
              <li className="flex items-center space-x-2 justify-center">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">One-time payment</span>
              </li>
              <li className="flex items-center space-x-2 justify-center">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">Secure payments</span>
              </li>
            </ul>
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
