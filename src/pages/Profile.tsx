
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User } from '@/types/supabase';
import { getCurrentUser, loginWithGoogle, logout } from '@/services/auth';
import { toast } from 'sonner';
import { LogOut, Shield, User as UserIcon } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        
        if (!currentUser) {
          navigate('/');
          toast.error("Please log in to view your profile");
        }
      } catch (error) {
        console.error("Error checking user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const user = await loginWithGoogle();
      setUser(user);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate('/');
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        isLoggedIn={!!user} 
        onLogin={handleLogin} 
        onLogout={handleLogout}
      />
      
      <main className="flex-grow container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="pookie-card md:col-span-1">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-4 overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="h-12 w-12 text-primary" />
                  )}
                </div>
                
                <h2 className="text-xl font-semibold mb-1">{user.name}</h2>
                <p className="text-sm text-muted-foreground mb-4">{user.email}</p>
                
                <Button 
                  variant="destructive" 
                  className="w-full flex items-center justify-center"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="pookie-card md:col-span-2">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Privacy Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Your Posts Are Anonymous</h4>
                    <p className="text-sm text-muted-foreground">
                      All content you share is completely anonymous. We don't track which posts belong to which user.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Secure Authentication</h4>
                    <p className="text-sm text-muted-foreground">
                      We use Google authentication to secure your account, but we don't link your identity to your posts.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Data Deletion</h4>
                    <p className="text-sm text-muted-foreground">
                      If you delete your account, all associated data will be permanently removed from our systems.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
