
import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full py-6 px-4 mt-16">
      <div className="container max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              WhispHaven
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Share your weird moments anonymously
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex items-center text-sm text-muted-foreground">
              Made with <Heart className="h-3 w-3 mx-1 text-destructive" /> for the pookies
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              © {new Date().getFullYear()} WhispHaven
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
