
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ReactionType, PostType } from '@/services/posts';
import { Image, VideoIcon, FileText, FilterIcon, X, Smile, Frown, Angry, Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface PostFiltersProps {
  onFilterChange: (type: PostType | undefined, reaction: ReactionType | undefined) => void;
}

const PostFilters: React.FC<PostFiltersProps> = ({ onFilterChange }) => {
  const [activeTypeFilter, setActiveTypeFilter] = useState<PostType | undefined>(undefined);
  const [activeReactionFilter, setActiveReactionFilter] = useState<ReactionType | undefined>(undefined);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const handleTypeFilter = (type: PostType) => {
    const newType = activeTypeFilter === type ? undefined : type;
    setActiveTypeFilter(newType);
    onFilterChange(newType, activeReactionFilter);
  };

  const handleReactionFilter = (reaction: ReactionType) => {
    const newReaction = activeReactionFilter === reaction ? undefined : reaction;
    setActiveReactionFilter(newReaction);
    onFilterChange(activeTypeFilter, newReaction);
  };

  const clearFilters = () => {
    setActiveTypeFilter(undefined);
    setActiveReactionFilter(undefined);
    onFilterChange(undefined, undefined);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (activeTypeFilter) count++;
    if (activeReactionFilter) count++;
    return count;
  };

  return (
    <TooltipProvider>
      <div className="relative mb-4">
        <div className="flex justify-between items-center mb-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => setIsFiltersVisible(!isFiltersVisible)}
          >
            <FilterIcon className="h-4 w-4" />
            <span>Filters</span>
            {getActiveFiltersCount() > 0 && (
              <Badge className="bg-pookie-purple text-white ml-1">{getActiveFiltersCount()}</Badge>
            )}
          </Button>
          
          {getActiveFiltersCount() > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-muted-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
        
        {isFiltersVisible && (
          <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-3 mb-4 space-y-3 shadow-md">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Post Type</h3>
              <div className="flex flex-wrap gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={activeTypeFilter === 'image' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => handleTypeFilter('image')}
                      className={activeTypeFilter === 'image' ? 'bg-pookie-blue text-white' : ''}
                    >
                      <Image className="h-4 w-4 mr-1" />
                      Image
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Filter image posts</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={activeTypeFilter === 'video' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => handleTypeFilter('video')}
                      className={activeTypeFilter === 'video' ? 'bg-pookie-purple text-white' : ''}
                    >
                      <VideoIcon className="h-4 w-4 mr-1" />
                      Video
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Filter video posts</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={activeTypeFilter === 'text' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => handleTypeFilter('text')}
                      className={activeTypeFilter === 'text' ? 'bg-pookie-green text-white' : ''}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Text
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Filter text-only posts</TooltipContent>
                </Tooltip>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Mood</h3>
              <div className="flex flex-wrap gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={activeReactionFilter === 'happy' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => handleReactionFilter('happy')}
                      className={activeReactionFilter === 'happy' ? 'bg-amber-400 text-white' : ''}
                    >
                      <Smile className="h-4 w-4 mr-1" />
                      Happy
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Filter happy reactions</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={activeReactionFilter === 'sad' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => handleReactionFilter('sad')}
                      className={activeReactionFilter === 'sad' ? 'bg-blue-400 text-white' : ''}
                    >
                      <Frown className="h-4 w-4 mr-1" />
                      Sad
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Filter sad reactions</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={activeReactionFilter === 'angry' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => handleReactionFilter('angry')}
                      className={activeReactionFilter === 'angry' ? 'bg-red-400 text-white' : ''}
                    >
                      <Angry className="h-4 w-4 mr-1" />
                      Angry
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Filter angry reactions</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={activeReactionFilter === 'surprised' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => handleReactionFilter('surprised')}
                      className={activeReactionFilter === 'surprised' ? 'bg-purple-400 text-white' : ''}
                    >
                      <Sparkles className="h-4 w-4 mr-1" />
                      Surprised
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Filter surprised reactions</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default PostFilters;
