import React, { useState } from 'react';
import { Button } from './Button';
import { Heart, Coffee, ArrowRight, Sparkles } from 'lucide-react';

interface PaywallProps {
  onSubscribe: () => void;
}

export const Paywall: React.FC<PaywallProps> = ({ onSubscribe }) => {
  const [donationAmount, setDonationAmount] = useState('');

  const handleDonate = () => {
    if (!donationAmount) return;
    alert(`Thank you so much! Your support of $${donationAmount} means the world to us.`);
    setDonationAmount('');
  };

  return (
    <div className="min-h-screen bg-zim-black text-white flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-zim-green/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-zim-red/20 rounded-full blur-[100px]"></div>

      <div className="max-w-md w-full flex flex-col items-center z-10 animate-fade-in my-auto text-center">
        
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-zim-green to-green-800 rounded-3xl rotate-3 mx-auto flex items-center justify-center mb-6 shadow-2xl shadow-green-900/50">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Mauya! <br/><span className="text-zim-yellow text-3xl">(Welcome!)</span></h1>
          <p className="text-stone-300 text-lg leading-relaxed mb-2">
            You have full access to the ChiShona AI Beta.
          </p>
          <p className="text-stone-500 text-sm">
            We are constantly improving. Feel free to leave feedback inside the app.
          </p>
        </div>

        <Button fullWidth size="lg" variant="primary" onClick={onSubscribe} className="mb-12 shadow-zim-green/20 py-5 text-lg">
            Start Learning
            <ArrowRight className="w-6 h-6 ml-2" />
        </Button>
        
        {/* Friendly Donation Section */}
        <div className="w-full border-t border-stone-800 pt-8 mt-4">
            <div className="flex flex-col items-center text-center">
                <div className="flex items-center gap-2 text-zim-yellow mb-3">
                    <Coffee className="w-5 h-5" />
                    <h3 className="font-bold">Fuel the Project</h3>
                </div>
                <p className="text-sm text-stone-400 mb-6 max-w-xs leading-relaxed">
                    ChiShona AI is a labor of love. If you find it useful, your support helps us keep Mufaro online and learning. <span className="text-white font-semibold">Maita basa!</span>
                </p>
                
                <div className="flex gap-2 w-full max-w-xs">
                    <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 font-bold">$</span>
                        <input 
                            type="number"
                            min="1"
                            value={donationAmount}
                            onChange={(e) => setDonationAmount(e.target.value)}
                            placeholder="Amount"
                            className="w-full bg-stone-900 border border-stone-700 rounded-xl py-3 pl-8 pr-4 text-white placeholder-stone-600 focus:border-zim-yellow focus:outline-none transition-colors font-medium text-center"
                        />
                    </div>
                    <Button 
                        variant="outline" 
                        onClick={handleDonate} 
                        disabled={!donationAmount}
                        className="!border-zim-yellow !text-zim-yellow hover:!bg-zim-yellow hover:!text-zim-black whitespace-nowrap px-6"
                    >
                        Support <Heart className="w-4 h-4 ml-2 fill-current" />
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};