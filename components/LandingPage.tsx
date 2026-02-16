
import { Button } from './Button';
import { ChevronRight, MessageCircle, BookOpen, Star, Smartphone, Globe, Beaker } from 'lucide-react';
import React from 'react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-white text-stone-900 flex flex-col font-sans">
      {/* Top Flag Strip */}
      <div className="zim-strip"></div>

      {/* Navbar */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-zim-green rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">S</div>
          <span className="text-xl font-bold tracking-tighter text-zim-black">ShonaAI</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-semibold text-stone-600">
          <a href="#features" className="hover:text-zim-green transition-colors">Features</a>
          <a href="#slang" className="hover:text-zim-green transition-colors">Dictionary</a>
          <a href="#mobile" className="hover:text-zim-green transition-colors text-zim-red">App Coming Soon</a>
        </div>
        <Button variant="outline" size="sm" onClick={onStart} className="!border-stone-200 !text-stone-900 hover:!border-zim-green hover:!text-zim-green">
          Join Beta
        </Button>
      </nav>

      {/* Hero */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6 py-16 lg:py-20 relative overflow-hidden">
        
        {/* Decorative Blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-zim-green/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-zim-yellow/10 rounded-full blur-3xl -z-10"></div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-800 text-xs font-bold tracking-wide mb-8 uppercase animate-fade-in">
          <Beaker className="w-3 h-3" />
          Production Beta 1.0
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zim-black mb-8 leading-tight">
          Master the Language of <br/>
          <span className="relative inline-block">
            <span className="relative z-10 text-zim-green">Zimbabwe</span>
            <span className="absolute bottom-2 left-0 w-full h-3 bg-zim-yellow/30 -z-0 skew-x-12"></span>
          </span>
        </h1>
        
        <p className="text-xl text-stone-500 mb-10 max-w-2xl leading-relaxed mx-auto">
          The ultimate AI tutor for Shona. Built with real-world slang data and advanced RAG integration.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
          <Button onClick={onStart} size="lg" className="group shadow-xl shadow-zim-green/20">
            Start Learning Now
            <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button onClick={onStart} variant="secondary" size="lg" className="bg-zim-black text-white">
            Explore Slang Library
          </Button>
        </div>

        {/* Feature Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full max-w-6xl mx-auto">
          <FeatureCard 
            icon={<MessageCircle className="w-6 h-6 text-zim-green" />}
            title="Real Conversations"
            description="Talk to Mufaro like a local. Our AI understands deep context and everyday flow."
            color="border-zim-green"
          />
          <FeatureCard 
            icon={<Star className="w-6 h-6 text-zim-yellow" />}
            title="RAG-Powered Slang"
            description="Our custom knowledge base keeps you updated with the latest Harare street talk."
            color="border-zim-yellow"
          />
          <FeatureCard 
            icon={<BookOpen className="w-6 h-6 text-zim-red" />}
            title="Culture First"
            description="It's more than words. Learn the respect and traditions that define Zimbabwe."
            color="border-zim-red"
          />
        </div>

        {/* Mobile App Teaser Section */}
        <div id="mobile" className="mt-24 w-full max-w-4xl bg-stone-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-zim-green/20 rounded-full blur-3xl"></div>
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div className="text-left flex-1">
                    <div className="inline-block px-3 py-1 bg-zim-yellow text-zim-black text-xs font-bold rounded-full mb-4">IN DEVELOPMENT</div>
                    <h2 className="text-3xl font-bold mb-4">ShonaAI on your phone.</h2>
                    <p className="text-stone-400 mb-6">
                        We are porting the ShonaAI experience to iOS and Android. Join the waitlist for the native mobile app launch.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 bg-stone-800 px-4 py-2 rounded-lg border border-stone-700 opacity-70 cursor-not-allowed">
                            <Smartphone className="w-6 h-6 text-stone-400" />
                            <div className="text-left">
                                <div className="text-[10px] uppercase text-stone-500 leading-none">Download on the</div>
                                <div className="text-sm font-bold text-stone-300">App Store</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-stone-800 px-4 py-2 rounded-lg border border-stone-700 opacity-70 cursor-not-allowed">
                            <div className="w-6 h-6 bg-stone-600 rounded-sm flex items-center justify-center text-[10px]">▶</div>
                            <div className="text-left">
                                <div className="text-[10px] uppercase text-stone-500 leading-none">Get it on</div>
                                <div className="text-sm font-bold text-stone-300">Google Play</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 flex justify-center">
                    <div className="w-40 h-80 bg-stone-800 rounded-[2.5rem] border-4 border-stone-700 p-2 shadow-2xl relative">
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-4 bg-stone-900 rounded-full"></div>
                        <div className="w-full h-full bg-stone-900 rounded-[2rem] overflow-hidden relative">
                             <div className="p-3 space-y-3 pt-8">
                                <div className="flex gap-2">
                                    <div className="w-8 h-8 rounded-full bg-zim-green"></div>
                                    <div className="bg-stone-800 h-8 w-24 rounded-lg"></div>
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <div className="bg-zim-yellow/20 h-12 w-32 rounded-lg"></div>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-zim-black text-stone-400 text-sm mt-auto border-t border-stone-900">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-stone-800 rounded flex items-center justify-center text-white text-xs font-bold">S</div>
                <span className="font-semibold text-stone-200">ShonaAI</span>
            </div>
            <div className="flex gap-6">
                <a href="#" className="hover:text-white">Research</a>
                <a href="#" className="hover:text-white">API</a>
                <a href="#" className="hover:text-white">Privacy</a>
            </div>
            <div className="text-stone-600">
                &copy; {new Date().getFullYear()} ShonaAI. Made with <span className="text-zim-red">♥</span> for Zimbabwe
            </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string, color: string }> = ({ icon, title, description, color }) => (
  <div className={`p-8 bg-white rounded-3xl shadow-sm border-2 ${color} hover:shadow-xl transition-shadow text-left group`}>
    <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 text-zim-black">{title}</h3>
    <p className="text-stone-500 leading-relaxed">{description}</p>
  </div>
);
