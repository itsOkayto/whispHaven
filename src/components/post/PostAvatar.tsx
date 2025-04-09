
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface PostAvatarProps {
  avatar?: string;
  emoji?: string;
  isPookieOfDay?: boolean;
}

const PostAvatar = ({ avatar, emoji, isPookieOfDay }: PostAvatarProps) => {
  return (
    <div className="relative">
      <Avatar className="h-10 w-10 border-2 border-pookie-pink/30 bg-gradient-to-br from-pookie-purple/10 to-pookie-blue/10">
        {avatar ? (
          <AvatarImage src={avatar} alt="User avatar" />
        ) : null}
        <AvatarFallback className="bg-gradient-to-br from-pookie-purple to-pookie-blue text-white">
          {emoji || 'A'}
        </AvatarFallback>
      </Avatar>
      
      {isPookieOfDay && (
        <Badge 
          className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-yellow-300 border-none"
          variant="default"
        >
          🧃
        </Badge>
      )}
    </div>
  );
};

export default PostAvatar;
