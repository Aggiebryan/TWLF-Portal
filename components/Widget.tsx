import React, { useState, useRef, useEffect } from 'react';
import { Widget as IWidget, Bookmark, ViewStyle, WidgetSize, GridItemSize } from '../types';
import { LinkItem } from './LinkItem';
import { Button } from './Button';
import { Settings, Plus, List, Grid, AlignLeft, Trash2, ArrowUp, ArrowDown, Upload, Edit2, X } from 'lucide-react';
import { Modal } from './Modal';

interface WidgetProps {
  widget: IWidget;
  customColor?: string;
  onUpdate: (updatedWidget: IWidget) => void;
  onDelete: (widgetId: string) => void;
}

export const Widget: React.FC<WidgetProps> = ({ widget, customColor, onUpdate, onDelete }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddingLink, setIsAddingLink] = useState(false);
  
  // New Link State
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkDesc, setNewLinkDesc] = useState('');
  
  // Masonry Layout State
  const [rowSpan, setRowSpan] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);

  // Helper for icon uploading
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Size Mapping for Widget Container
  const sizeClasses = {
    small: 'col-span-12 md:col-span-6 lg:col-span-3',
    medium: 'col-span-12 md:col-span-6',
    large: 'col-span-12 md:col-span-12 lg:col-span-9',
    full: 'col-span-12'
  };

  // Column mapping for List/Detailed views based on widget size
  const listGridCols = {
    small: 'grid-cols-1',
    medium: 'grid-cols-1 sm:grid-cols-2',
    large: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    full: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  };

  // Grid Item Size Mapping 
  const currentGridSize = widget.gridItemSize || 'large';

  // Responsive Grid Classes Map
  // Defines strict column counts for every Widget Size + Grid Item Size combination
  // to ensure "Carry these sizes across" logic holds true on all breakpoints.
  // Base density (LG screen): Small Widget fits 2 Large / 3 Med / 4 Small items.
  const gridClassesMap: Record<string, string> = {
    // Small Widget (LG: 1 unit wide)
    'small_large': 'grid-cols-4 md:grid-cols-4 lg:grid-cols-2',
    'small_medium': 'grid-cols-6 md:grid-cols-6 lg:grid-cols-3',
    'small_small': 'grid-cols-8 md:grid-cols-8 lg:grid-cols-4',
    
    // Medium Widget (LG: 2 units wide)
    'medium_large': 'grid-cols-4 md:grid-cols-4 lg:grid-cols-4',
    'medium_medium': 'grid-cols-6 md:grid-cols-6 lg:grid-cols-6',
    'medium_small': 'grid-cols-8 md:grid-cols-8 lg:grid-cols-8',
    
    // Large Widget (LG: 3 units wide)
    'large_large': 'grid-cols-4 md:grid-cols-8 lg:grid-cols-6',
    'large_medium': 'grid-cols-6 md:grid-cols-12 lg:grid-cols-9',
    'large_small': 'grid-cols-8 md:grid-cols-[16] lg:grid-cols-12',
    
    // Full Widget (LG: 4 units wide)
    'full_large': 'grid-cols-4 md:grid-cols-8 lg:grid-cols-8',
    'full_medium': 'grid-cols-6 md:grid-cols-12 lg:grid-cols-12',
    'full_small': 'grid-cols-8 md:grid-cols-[16] lg:grid-cols-[16]',
  };

  // Class string for the grid
  const getGridClass = () => {
    if (widget.viewStyle !== 'grid') {
      return listGridCols[widget.size];
    }
    const key = `${widget.size}_${currentGridSize}`;
    return gridClassesMap[key] || gridClassesMap['small_large'];
  };

  useEffect(() => {
    if (!contentRef.current) return;

    const updateHeight = () => {
      if (contentRef.current) {
        const height = contentRef.current.getBoundingClientRect().height;
        // Calculate span: Height + 24px gap (matches tailwind gap-6) divided by 1px row height
        const gap = 24;
        const span = Math.ceil(height + gap);
        setRowSpan(span);
      }
    };

    const observer = new ResizeObserver(updateHeight);
    observer.observe(contentRef.current);
    
    // Initial calculation
    updateHeight();

    return () => observer.disconnect();
  }, [widget.bookmarks, widget.viewStyle, widget.size, widget.gridItemSize]);

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkTitle || !newLinkUrl) return;

    let url = newLinkUrl;
    if (!url.startsWith('http')) {
      url = `https://${url}`;
    }

    const newBookmark: Bookmark = {
      id: Math.random().toString(36).substring(2, 9),
      title: newLinkTitle,
      url: url,
      description: newLinkDesc
    };

    onUpdate({
      ...widget,
      bookmarks: [...widget.bookmarks, newBookmark]
    });

    setNewLinkTitle('');
    setNewLinkUrl('');
    setNewLinkDesc('');
    setIsAddingLink(false);
  };

  const updateBookmark = (id: string, updates: Partial<Bookmark>) => {
    onUpdate({
      ...widget,
      bookmarks: widget.bookmarks.map(b => b.id === id ? { ...b, ...updates } : b)
    });
  };

  const deleteBookmark = (id: string) => {
    onUpdate({
      ...widget,
      bookmarks: widget.bookmarks.filter(b => b.id !== id)
    });
  };

  const moveBookmark = (index: number, direction: -1 | 1) => {
    const newBookmarks = [...widget.bookmarks];
    const targetIndex = index + direction;
    
    if (targetIndex >= 0 && targetIndex < newBookmarks.length) {
      [newBookmarks[index], newBookmarks[targetIndex]] = [newBookmarks[targetIndex], newBookmarks[index]];
      onUpdate({
        ...widget,
        bookmarks: newBookmarks
      });
    }
  };

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>, bookmarkId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateBookmark(bookmarkId, { iconUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = (id: string) => {
    fileInputRefs.current[id]?.click();
  };

  const getFavicon = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch (e) {
      return 'https://via.placeholder.com/64?text=?';
    }
  };

  // Helper to convert Hex to RGBA for transparency
  const hexToRgba = (hex: string, alpha: number) => {
    if (!hex || !/^#[0-9A-F]{6}$/i.test(hex)) return undefined;
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Background Style logic
  // Use specific widget color if available, otherwise fall back to global custom color
  const effectiveColor = widget.customBackgroundColor || customColor;
  
  // Apply 40% opacity to whatever color is selected to maintain glass effect
  const customRgba = effectiveColor ? hexToRgba(effectiveColor, 0.4) : undefined;

  const baseBgStyle = customRgba 
    ? { backgroundColor: customRgba }
    : {};
  
  // Merge row span into style
  const finalStyle = {
    ...baseBgStyle,
    gridRowEnd: `span ${rowSpan}`
  };
  
  // Ensure backdrop-blur-md is always active. Use default glass bg if no custom color.
  const bgClasses = `rounded-2xl border border-white/10 shadow-xl transition-all duration-300 hover:border-white/20 hover:shadow-2xl overflow-hidden backdrop-blur-md ${
    !customRgba ? 'bg-slate-900/40' : ''
  }`;

  return (
    <div 
      ref={contentRef}
      className={`relative flex flex-col ${bgClasses} ${sizeClasses[widget.size]} min-h-[200px] h-fit`}
      style={finalStyle}
    >
      
      {/* Widget Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
        <h3 className="font-semibold text-white tracking-wide flex items-center gap-2 truncate">
          {widget.title}
          <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 text-[10px] font-mono border border-blue-500/20">
            {widget.bookmarks.length}
          </span>
        </h3>
        <div className="flex items-center gap-2 opacity-100 transition-opacity duration-200">
           <button 
             onClick={() => setIsAddingLink(true)}
             className="p-1.5 text-blue-300 hover:text-white hover:bg-blue-500/30 bg-blue-500/10 rounded-lg transition-all"
             title="Add Link"
           >
             <Plus size={16} />
           </button>
           <button 
             onClick={() => setIsSettingsOpen(true)}
             className={`p-1.5 rounded-lg transition-all ${isSettingsOpen ? 'text-white bg-blue-600 shadow-lg shadow-blue-900/50' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}
             title="Settings"
           >
             <Settings size={16} />
           </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-3 relative">
        {widget.bookmarks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 min-h-[100px]">
            <p className="text-sm">No bookmarks yet</p>
            <Button variant="ghost" size="sm" onClick={() => setIsAddingLink(true)} className="mt-2 text-blue-400">
              <Plus size={14} className="mr-1" /> Add one
            </Button>
          </div>
        ) : (
          <div 
            className={`grid gap-2 ${getGridClass()}`}
          >
            {widget.bookmarks.map(bm => (
              <LinkItem 
                key={bm.id} 
                bookmark={bm} 
                viewStyle={widget.viewStyle} 
                gridItemSize={currentGridSize}
              />
            ))}
          </div>
        )}
      </div>

      {/* Widget Settings Modal */}
      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Widget Settings">
        <div className="space-y-6">
          
          {/* General Settings */}
          <div className="p-4 bg-slate-950/30 rounded-xl border border-white/5 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Appearance</h4>
            
            <div className="space-y-2">
              <label className="text-xs text-slate-400">Widget Name</label>
              <input 
                type="text"
                value={widget.title}
                onChange={(e) => onUpdate({ ...widget, title: e.target.value })}
                className="w-full bg-slate-900/80 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Widget Specific Color */}
            <div className="space-y-2">
               <label className="text-xs text-slate-400">Widget Color</label>
               <div className={`flex items-center gap-2 p-2 rounded-lg border ${widget.customBackgroundColor ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-slate-900/80'}`}>
                  <input 
                    type="color"
                    value={widget.customBackgroundColor || (customColor || '#0f172a')}
                    onChange={(e) => onUpdate({ ...widget, customBackgroundColor: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                  />
                  <div className="flex flex-col">
                     <span className="text-xs text-white font-mono">{widget.customBackgroundColor ? widget.customBackgroundColor : 'Use Global'}</span>
                     {widget.customBackgroundColor && (
                       <button onClick={() => onUpdate({ ...widget, customBackgroundColor: undefined })} className="text-[10px] text-red-400 text-left hover:underline">Reset to Global</button>
                     )}
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-slate-400">View Style</label>
                <div className="flex bg-slate-900/80 p-1 rounded-lg border border-white/10">
                  {[
                    { id: 'list', icon: List },
                    { id: 'detailed', icon: AlignLeft },
                    { id: 'grid', icon: Grid }
                  ].map((style) => (
                    <button
                      key={style.id}
                      onClick={() => onUpdate({ ...widget, viewStyle: style.id as ViewStyle })}
                      className={`flex-1 flex items-center justify-center py-1.5 rounded-md transition-all ${widget.viewStyle === style.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
                      title={style.id}
                    >
                      <style.icon size={14} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-400">Size</label>
                 <div className="flex bg-slate-900/80 p-1 rounded-lg border border-white/10">
                    {(['small', 'medium', 'large', 'full'] as WidgetSize[]).map((s) => (
                       <button
                       key={s}
                       onClick={() => onUpdate({ ...widget, size: s })}
                       className={`flex-1 py-1.5 rounded-md text-[10px] font-medium uppercase transition-all ${widget.size === s ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
                     >
                       {s.charAt(0)}
                     </button>
                    ))}
                  </div>
              </div>
            </div>

            {/* Grid Size Selector (Only visible if grid is selected) */}
            {widget.viewStyle === 'grid' && (
              <div className="space-y-2 mt-2 pt-3 border-t border-white/5 animate-in fade-in slide-in-from-top-2">
                 <label className="text-xs text-slate-400">Grid Item Size</label>
                 <div className="flex bg-slate-900/80 p-1 rounded-lg border border-white/10">
                    {(['small', 'medium', 'large'] as GridItemSize[]).map((s) => (
                       <button
                         key={s}
                         onClick={() => onUpdate({ ...widget, gridItemSize: s })}
                         className={`flex-1 py-1.5 rounded-md text-[10px] font-medium uppercase transition-all ${currentGridSize === s ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
                       >
                         {s}
                       </button>
                    ))}
                 </div>
              </div>
            )}
          </div>

          {/* Bookmark Management */}
          <div className="space-y-2">
             <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Manage Links</h4>
                <Button size="sm" variant="ghost" onClick={() => setIsAddingLink(true)}>
                  <Plus size={14} className="mr-1" /> Add
                </Button>
             </div>

             <div className="bg-slate-950/30 border border-white/5 rounded-xl overflow-hidden">
                {widget.bookmarks.length === 0 ? (
                  <div className="p-4 text-center text-sm text-slate-500">No links added yet</div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {widget.bookmarks.map((bm, idx) => (
                      <div key={bm.id} className="flex items-start gap-3 p-3 hover:bg-white/5 transition-colors group">
                         {/* Icon Upload */}
                         <div className="relative shrink-0 mt-1">
                            <img 
                              src={bm.iconUrl || getFavicon(bm.url)} 
                              alt="icon" 
                              className="w-8 h-8 rounded-md bg-white/10 object-contain p-1 cursor-pointer hover:opacity-80"
                              onClick={() => triggerFileInput(bm.id)}
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100">
                               <Upload size={12} className="text-white drop-shadow-md" />
                            </div>
                            <input 
                              type="file" 
                              accept=".png,.jpg,.jpeg,.ico" 
                              className="hidden"
                              ref={el => fileInputRefs.current[bm.id] = el}
                              onChange={(e) => handleIconUpload(e, bm.id)}
                            />
                         </div>
                         
                         {/* Inputs */}
                         <div className="flex-1 min-w-0 space-y-2">
                            <div className="space-y-0.5">
                                <label className="text-[10px] text-slate-500 font-medium uppercase">Title</label>
                                <input 
                                  type="text" 
                                  value={bm.title}
                                  onChange={(e) => updateBookmark(bm.id, { title: e.target.value })}
                                  className="w-full bg-slate-900/50 rounded px-2 py-1 text-sm text-white border border-transparent focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div className="space-y-0.5">
                                <label className="text-[10px] text-slate-500 font-medium uppercase">URL</label>
                                <input 
                                  type="text" 
                                  value={bm.url}
                                  onChange={(e) => updateBookmark(bm.id, { url: e.target.value })}
                                  className="w-full bg-slate-900/50 rounded px-2 py-1 text-xs text-slate-400 border border-transparent focus:border-blue-500 focus:outline-none font-mono"
                                />
                            </div>
                            <div className="space-y-0.5">
                                <label className="text-[10px] text-slate-500 font-medium uppercase">Description</label>
                                <input 
                                  type="text" 
                                  value={bm.description || ''}
                                  placeholder="Optional description"
                                  onChange={(e) => updateBookmark(bm.id, { description: e.target.value })}
                                  className="w-full bg-slate-900/50 rounded px-2 py-1 text-xs text-slate-300 border border-transparent focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                         </div>

                         {/* Actions */}
                         <div className="flex flex-col items-end gap-1 mt-1">
                            <button 
                              onClick={() => deleteBookmark(bm.id)}
                              className="p-2 text-red-400 hover:bg-red-500/20 rounded-md transition-colors mb-2"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                            
                            <div className="flex gap-1">
                               <button 
                                disabled={idx === 0}
                                onClick={() => moveBookmark(idx, -1)}
                                className="p-1 text-slate-500 hover:text-white hover:bg-white/10 rounded disabled:opacity-30"
                               >
                                 <ArrowUp size={14} />
                               </button>
                               <button 
                                disabled={idx === widget.bookmarks.length - 1}
                                onClick={() => moveBookmark(idx, 1)}
                                className="p-1 text-slate-500 hover:text-white hover:bg-white/10 rounded disabled:opacity-30"
                               >
                                 <ArrowDown size={14} />
                               </button>
                            </div>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
             </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-between items-center">
             <button 
               onClick={() => onDelete(widget.id)}
               className="flex items-center text-xs font-medium text-red-400 hover:text-white hover:bg-red-500 px-3 py-2 rounded-md transition-all border border-transparent hover:border-red-400/30"
             >
               <Trash2 size={14} className="mr-1.5" /> Delete Widget
             </button>
             <Button onClick={() => setIsSettingsOpen(false)}>Close</Button>
          </div>

        </div>
      </Modal>

      {/* Add Link Modal */}
      <Modal isOpen={isAddingLink} onClose={() => setIsAddingLink(false)} title="Add New Bookmark">
        <form onSubmit={handleAddLink} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Title</label>
            <input
              autoFocus
              type="text"
              value={newLinkTitle}
              onChange={e => setNewLinkTitle(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="e.g. Westlaw"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">URL</label>
            <input
              type="text"
              value={newLinkUrl}
              onChange={e => setNewLinkUrl(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="e.g. www.example.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Description (Optional)</label>
            <textarea
              value={newLinkDesc}
              onChange={e => setNewLinkDesc(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-20 resize-none"
              placeholder="Short description..."
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsAddingLink(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Add Bookmark</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};