
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Menu, X, LogOut, User, Home, PenLine } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { NavbarProps } from './NavbarTypes';

const Navbar = ({ isLoggedIn, onLogout, onLogin, rightContent }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    onLogout();
    toast({
      description: "You've been logged out successfully!",
    });
    navigate('/');
    setIsMenuOpen(false);
  };

  const navLinks = [
    { title: "Home", path: "/", icon: <Home className="w-4 h-4 mr-2" /> },
    { title: "Feed", path: "/feed", icon: <PenLine className="w-4 h-4 mr-2" /> },
    { title: "Profile", path: "/profile", icon: <User className="w-4 h-4 mr-2" /> },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full px-4 py-3">
      <div className="container max-w-6xl mx-auto pookie-card px-4 py-2.5">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              WhispHaven
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className="px-3 py-2 rounded-full text-sm font-medium hover:bg-secondary/50 flex items-center"
              >
                {link.icon}
                {link.title}
              </Link>
            ))}
            
            {isLoggedIn ? (
              <Button 
                variant="ghost"
                className="ml-2 px-3 py-2 rounded-full text-sm font-medium hover:bg-destructive/10 hover:text-destructive flex items-center"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            ) : (
              <Button 
                className="pookie-button ml-2"
                onClick={onLogin}
              >
                Login
              </Button>
            )}
            
            {rightContent && (
              <div className="ml-2">
                {rightContent}
              </div>
            )}
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden">
            <button
              className="p-2 rounded-full hover:bg-secondary/50 text-foreground"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 py-2 rounded-lg animate-accordion-down">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="px-4 py-2.5 rounded-lg hover:bg-secondary/50 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.icon}
                  {link.title}
                </Link>
              ))}
              
              {isLoggedIn ? (
                <button
                  className="px-4 py-2.5 rounded-lg text-left hover:bg-destructive/10 hover:text-destructive flex items-center"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              ) : (
                <button
                  className="px-4 py-2.5 rounded-lg text-left bg-primary/10 text-primary hover:bg-primary/20 flex items-center"
                  onClick={() => {
                    onLogin();
                    setIsMenuOpen(false);
                  }}
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </button>
              )}
              
              {rightContent && (
                <div className="px-4 py-2.5">
                  {rightContent}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
