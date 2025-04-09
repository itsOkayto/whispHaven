
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Eye, Ghost } from 'lucide-react';

interface HeroProps {
  onLogin: () => void;
  isLoggedIn: boolean;
}

const Hero = ({ onLogin, isLoggedIn }: HeroProps) => {
  return (
    <div className="container max-w-6xl mx-auto px-4 py-16 md:py-24">
      <div className="flex flex-col items-center text-center">
        <div className="inline-block px-3 py-1 rounded-full bg-secondary text-primary-foreground mb-6 animate-pulse-soft">
          ✨ Share your weirdest moments anonymously ✨
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Express your true self,
          </span>
          <br />
          <span>without revealing who you are</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
          A safe space to share your most authentic thoughts, strangest experiences, 
          and unfiltered moments—completely anonymous.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          {isLoggedIn ? (
            <Button asChild className="pookie-button text-base px-8 py-6">
              <Link to="/feed">
                Browse Feed <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          ) : (
            <Button onClick={onLogin} className="pookie-button text-base px-8 py-6">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
          
          <Button asChild className="pookie-button-secondary text-base px-8 py-6">
            <Link to="/about">
              Learn More
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <div className="pookie-card p-6 flex flex-col items-center text-center hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-pookie-pink/50 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">100% Anonymous</h3>
            <p className="text-muted-foreground">Your identity stays hidden. Express freely without fear of judgment.</p>
          </div>
          
          <div className="pookie-card p-6 flex flex-col items-center text-center hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-pookie-purple/50 rounded-full flex items-center justify-center mb-4">
              <Eye className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Zero Tracking</h3>
            <p className="text-muted-foreground">We don't track which posts are yours. Your content exists in complete privacy.</p>
          </div>
          
          <div className="pookie-card p-6 flex flex-col items-center text-center hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-pookie-blue/50 rounded-full flex items-center justify-center mb-4">
              <Ghost className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Share Anything</h3>
            <p className="text-muted-foreground">Text, images, videos—share your moments in any format you prefer.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
