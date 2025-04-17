import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, User as UserIcon, Moon, Eye, EyeOff, LogOut, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { User } from '@/types/supabase';
import { toggleIncognitoMode, deleteAccount } from '@/services/auth';

interface UserSettingsProps {
  user: User;
  onLogout: () => Promise<void>;
  onUpdate: () => void;
}

const UserSettings: React.FC<UserSettingsProps> = ({ user, onLogout, onUpdate }) => {
  const [isIncognitoMode, setIsIncognitoMode] = useState(user.isIncognito);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleIncognito = async () => {
    try {
      setIsLoading(true);
      const updatedUser = await toggleIncognitoMode();
      setIsIncognitoMode(updatedUser.isIncognito);
      toast.success(updatedUser.isIncognito ? 
        "Incognito mode activated! Your posts will be hidden from you." : 
        "Incognito mode deactivated. You can now see your posts.");
      onUpdate();
    } catch (error) {
      console.error("Error toggling incognito mode:", error);
      toast.error("Could not toggle incognito mode");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      await deleteAccount();
      await onLogout();
      toast.success("Your account has been deleted");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Could not delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage src={user.avatar} alt="User avatar" />
            <AvatarFallback className="bg-gradient-to-br from-pookie-purple to-pookie-blue text-white">
              {user.emoji || <UserIcon className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Account Settings</DialogTitle>
          <DialogDescription>
            Manage your profile and privacy settings
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-6 py-4">
          {/* Profile Section */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-2 border-pookie-pink/30">
              <AvatarImage src={user.avatar} alt="User avatar" />
              <AvatarFallback className="bg-gradient-to-br from-pookie-purple to-pookie-blue text-white text-xl">
                {user.emoji}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">Anonymous Pookie</h3>
              <p className="text-sm text-muted-foreground">{user.emoji} Your cute anonymous identity</p>
            </div>
          </div>

          {/* Incognito Mode Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium flex items-center">
                {isIncognitoMode ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                Incognito Mode
              </h3>
              <p className="text-sm text-muted-foreground">Hide your own posts in the feed</p>
            </div>
            <Switch 
              checked={isIncognitoMode} 
              disabled={isLoading}
              onCheckedChange={handleToggleIncognito}
            />
          </div>

          {/* Logout Button */}
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </Button>

          {/* Delete Account Button */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove all your data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-destructive hover:bg-destructive/90"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>Delete Account</>
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserSettings;
