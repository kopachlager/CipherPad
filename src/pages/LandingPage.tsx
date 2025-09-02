import React, { useEffect } from 'react';
import { ArrowRight, Lock, Shield, Zap, Code, Mic, Download, Star } from 'lucide-react';

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
              <a href="#faq" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">FAQ</a>
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
      <section className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            <span>Secure Note-Taking</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight max-w-5xl mx-auto">
            Organize your thoughts,
            <span className="text-gray-600"> secure your ideas.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Write, organize, and protect your notes with client‑side encryption. Beautiful, fast, and private.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <button
              onClick={onGetStarted}
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-full font-semibold text-lg transition-all hover:scale-105 flex items-center space-x-2"
            >
              <span>Start Writing</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <a href="#features" className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-full font-semibold text-lg transition-colors">
              Learn More
            </a>
          </div>

          {/* App Preview */}
          <div className="relative max-w-5xl mx-auto" id="hero-graphic">
            <div className="rounded-3xl shadow-2xl bg-white border border-gray-200 overflow-hidden">
              <div className="h-12 bg-gray-50 border-b border-gray-200 flex items-center px-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                  <div className="w-3 h-3 bg-green-400 rounded-full" />
                </div>
                <div className="flex-1 text-center">
                  <div className="text-sm text-gray-500 font-medium">CipherWrite</div>
                </div>
              </div>
              <div className="p-6 text-left">
                <div className="flex gap-6">
                  <div className="w-56 hidden sm:block">
                    <div className="h-8 bg-gray-100 rounded-md mb-3" />
                    <div className="space-y-2">
                      <div className="h-6 bg-gray-100 rounded" />
                      <div className="h-6 bg-gray-100 rounded" />
                      <div className="h-6 bg-gray-100 rounded" />
                      <div className="h-6 bg-gray-100 rounded" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="h-8 w-40 bg-gray-100 rounded-md mb-4" />
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-100 rounded" />
                      <div className="h-4 bg-gray-100 rounded w-11/12" />
                      <div className="h-4 bg-gray-100 rounded w-10/12" />
                      <div className="h-4 bg-gray-100 rounded w-9/12" />
                      <div className="h-4 bg-gray-100 rounded w-8/12" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Everything you need to capture ideas</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-6 rounded-xl border border-gray-200 bg-white">
              <div className="w-10 h-10 rounded-lg bg-gray-900 text-white flex items-center justify-center mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">End‑to‑end privacy</h3>
              <p className="text-gray-600">Encrypt notes locally with your password using modern web crypto (AES‑GCM).</p>
            </div>
            <div className="p-6 rounded-xl border border-gray-200 bg-white">
              <div className="w-10 h-10 rounded-lg bg-gray-900 text-white flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Blazing fast</h3>
              <p className="text-gray-600">Vite + React, instant search and autosave so you never lose your flow.</p>
            </div>
            <div className="p-6 rounded-xl border border-gray-200 bg-white">
              <div className="w-10 h-10 rounded-lg bg-gray-900 text-white flex items-center justify-center mb-4">
                <Code className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Dev‑friendly</h3>
              <p className="text-gray-600">Code mode with Monaco Editor, language detection, and clean typography.</p>
            </div>
            <div className="p-6 rounded-xl border border-gray-200 bg-white">
              <div className="w-10 h-10 rounded-lg bg-gray-900 text-white flex items-center justify-center mb-4">
                <Mic className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Voice capture</h3>
              <p className="text-gray-600">Record ideas quickly and transcribe them directly into your notes.</p>
            </div>
            <div className="p-6 rounded-xl border border-gray-200 bg-white">
              <div className="w-10 h-10 rounded-lg bg-gray-900 text-white flex items-center justify-center mb-4">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Easy export</h3>
              <p className="text-gray-600">Export notes as TXT, Markdown, or JSON with a single click.</p>
            </div>
            <div className="p-6 rounded-xl border border-gray-200 bg-white">
              <div className="w-10 h-10 rounded-lg bg-gray-900 text-white flex items-center justify-center mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure sync</h3>
              <p className="text-gray-600">Sync across devices with Supabase. Your password never leaves your device.</p>
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
