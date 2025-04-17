
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import { User } from '@/types/supabase';
import { getCurrentUser, loginWithGoogle, logout, setUseDemoAccount } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Database } from '@/icons/Database';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error checking user:", error);
        if (error instanceof Error) {
          setAuthError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  const handleLogin = async () => {
    try {
      const user = await loginWithGoogle();
      setUser(user);
      setAuthError(null);
    } catch (error) {
      console.error("Error logging in:", error);
      if (error instanceof Error) {
        setAuthError(error.message);
        toast.error(`Login error: ${error.message}`);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleUseDemoAccount = () => {
    setUseDemoAccount(true);
    handleLogin();
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Create right content for navbar - a demo login button if we hit auth errors
  const rightContent = authError ? (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleUseDemoAccount}
      className="text-xs"
    >
      Use Demo Account
    </Button>
  ) : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        isLoggedIn={!!user} 
        onLogin={handleLogin} 
        onLogout={handleLogout}
        rightContent={rightContent}
      />
      
      <main className="flex-grow">
        <Hero isLoggedIn={!!user} onLogin={handleLogin} />
        
        {authError && (
          <div className="container max-w-2xl mx-auto px-4 py-8">
            <div className="bg-destructive/10 text-destructive rounded-lg p-4 mb-8">
              <h3 className="font-semibold mb-2">Authentication Error</h3>
              <p className="text-sm mb-4">{authError}</p>
              <p className="text-sm mb-4">
                This app uses Supabase authentication with Google provider, which requires configuration.
              </p>
              <Button 
                variant="outline" 
                onClick={handleUseDemoAccount}
                className="bg-background hover:bg-background/90"
              >
                Use Demo Account Instead
              </Button>
            </div>
          </div>
        )}
        
        <div className="container max-w-2xl mx-auto px-4 py-2 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center">
            <Database className="h-4 w-4 mr-1 text-emerald-500" />
            Connected to Supabase
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
