import React from 'react';
import { Bookmark, ViewStyle, GridItemSize } from '../types';
import { ExternalLink } from 'lucide-react';

interface LinkItemProps {
  bookmark: Bookmark;
  viewStyle: ViewStyle;
  gridItemSize?: GridItemSize;
}

export const LinkItem: React.FC<LinkItemProps> = ({ bookmark, viewStyle, gridItemSize = 'large' }) => {
  const getFavicon = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch (e) {
      return 'https://via.placeholder.com/64?text=?';
    }
  };

  const iconSrc = bookmark.iconUrl || getFavicon(bookmark.url);

  // Common container classes
  const containerBase = "group relative flex items-center transition-all duration-200 hover:bg-white/10 rounded-lg border border-transparent hover:border-white/5";
  
  if (viewStyle === 'grid') {
    // Icons and links should take up roughly 75% of grid item size visually.
    // Text size scales slightly with grid item size setting for readability.
    
    const textClass = {
      small: 'text-[9px]',
      medium: 'text-[10px]',
      large: 'text-xs'
    };

    return (
      <a 
        href={bookmark.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className={`flex items-center justify-center aspect-square w-full rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all duration-300 group relative text-center overflow-hidden`}
      >
        <div className="w-[75%] h-[75%] flex flex-col items-center justify-center">
            <img 
              src={iconSrc} 
              alt={bookmark.title} 
              className="h-[60%] w-auto mb-1.5 rounded-md shadow-sm object-contain drop-shadow-md transition-transform duration-200 group-hover:scale-110" 
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48?text=LINK'; }}
            />
            <span className={`font-medium text-slate-200 group-hover:text-white line-clamp-2 leading-tight w-full px-1 ${textClass[gridItemSize]}`}>
              {bookmark.title}
            </span>
        </div>
      </a>
    );
  }

  if (viewStyle === 'detailed') {
    return (
      <a 
        href={bookmark.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className={`${containerBase} p-3 gap-3`}
      >
        <img src={iconSrc} alt="" className="w-10 h-10 rounded-md bg-white/10 p-1 object-contain shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
             <h4 className="text-sm font-medium text-slate-200 group-hover:text-white truncate pr-2">{bookmark.title}</h4>
             <ExternalLink size={14} className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          {bookmark.description && (
            <p className="text-xs text-slate-400 truncate mt-0.5">{bookmark.description}</p>
          )}
        </div>
      </a>
    );
  }

  // Default List View
  return (
    <a 
      href={bookmark.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`${containerBase} px-3 py-2 gap-3`}
    >
      <img src={iconSrc} alt="" className="w-5 h-5 rounded bg-white/10 p-0.5 object-contain shrink-0" />
      <span className="flex-1 text-sm text-slate-300 group-hover:text-white truncate">{bookmark.title}</span>
      <ExternalLink size={12} className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  );
};