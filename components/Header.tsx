
import React, { useState, useRef } from 'react';
import { Page, AppSettings, AppIconType } from '../types';
import { Layout, Scale, Briefcase, Gavel, Shield, Plus, Search, Settings as SettingsIcon, Upload, Image as ImageIcon, Trash2, ChevronDown, ChevronUp, PaintBucket } from 'lucide-react';
import { Button } from './Button';
import { Modal } from './Modal';
import { BACKGROUND_PRESETS, HEADER_PRESETS } from '../constants';

interface HeaderProps {
  pages: Page[];
  activePageId: string;
  settings: AppSettings;
  onNavigate: (pageId: string) => void;
  onAddPage: (title: string) => void;
  onUpdateSettings: (settings: AppSettings) => void;
  onUpdatePageDetails: (pageId: string, updates: { title?: string; description?: string; background?: string; customBackgroundImageData?: string; customBackgroundColor?: string }) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  pages, 
  activePageId, 
  settings,
  onNavigate, 
  onAddPage,
  onUpdateSettings,
  onUpdatePageDetails
}) => {
  const [isAddingPage, setIsAddingPage] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [expandedPageId, setExpandedPageId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const pageBgInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleAddPage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPageTitle) {
      onAddPage(newPageTitle);
      setNewPageTitle('');
      setIsAddingPage(false);
    }
  };

  const getIcon = (type: AppIconType) => {
    switch(type) {
      case 'scale': return <Scale className="text-white w-5 h-5" />;
      case 'briefcase': return <Briefcase className="text-white w-5 h-5" />;
      case 'gavel': return <Gavel className="text-white w-5 h-5" />;
      case 'shield': return <Shield className="text-white w-5 h-5" />;
      default: return <Layout className="text-white w-5 h-5" />;
    }
  };

  const handleAppIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateSettings({ ...settings, customAppIconData: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGlobalBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateSettings({ ...settings, customBackgroundImageData: reader.result as string, customBackgroundColor: undefined });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePageBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>, pageId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdatePageDetails(pageId, { customBackgroundImageData: reader.result as string, customBackgroundColor: undefined });
      };
      reader.readAsDataURL(file);
    }
  };

  // Custom header style
  const headerStyleObj = settings.customHeaderColor 
    ? { backgroundColor: settings.customHeaderColor } 
    : {};
  
  const headerClass = settings.customHeaderColor 
    ? `sticky top-0 z-40 w-full backdrop-blur-xl border-b border-white/10 shadow-2xl transition-colors duration-500`
    : `sticky top-0 z-40 w-full backdrop-blur-xl border-b border-white/10 shadow-2xl transition-colors duration-500 ${settings.headerStyle}`;

  return (
    <>
      <header className={headerClass} style={headerStyleObj}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            
            {/* Logo Area */}
            <div className="flex items-center gap-3 shrink-0">
               {settings.customAppIconData ? (
                   <img src={settings.customAppIconData} alt="App Logo" className="w-10 h-10 object-contain" />
                ) : (
                   <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 overflow-hidden">
                      {getIcon(settings.appIcon)}
                   </div>
                )}
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 hidden md:block">
                {settings.appName}
              </span>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar mask-gradient flex-1 px-4">
              {pages.map(page => (
                <button
                  key={page.id}
                  onClick={() => onNavigate(page.id)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    activePageId === page.id 
                      ? 'text-white bg-white/10 shadow-lg shadow-black/20' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {page.title}
                  {activePageId === page.id && (
                    <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                  )}
                </button>
              ))}
              <button 
                onClick={() => setIsAddingPage(true)}
                className="p-2 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors ml-2"
                title="Add Page"
              >
                <Plus size={18} />
              </button>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3 shrink-0">
               <div className="relative hidden lg:block group">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <Search size={14} className="text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                 </div>
                 <input 
                    type="text" 
                    placeholder="Quick find..." 
                    className="block w-full pl-9 pr-3 py-1.5 border border-slate-700 rounded-full leading-5 bg-slate-950/50 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all"
                 />
               </div>
               
               <button
                 onClick={() => setIsSettingsOpen(true)}
                 className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                 title="Portal Settings"
               >
                  <SettingsIcon size={20} />
               </button>

               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">WL</span>
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* Add Page Modal */}
      <Modal isOpen={isAddingPage} onClose={() => setIsAddingPage(false)} title="Create New Page">
        <form onSubmit={handleAddPage} className="space-y-4">
          <div>
             <label className="block text-xs font-medium text-slate-400 mb-1">Page Name</label>
             <input
              autoFocus
              type="text"
              value={newPageTitle}
              onChange={e => setNewPageTitle(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="e.g. Research, Admin..."
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsAddingPage(false)}>Cancel</Button>
            <Button type="submit">Create Page</Button>
          </div>
        </form>
      </Modal>

      {/* Global Settings Modal */}
      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Portal Settings">
        <div className="space-y-8 pb-4">
          
          {/* Branding Section */}
          <section className="space-y-4">
            <h4 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Branding</h4>
            
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">App Name</label>
              <input
                type="text"
                value={settings.appName}
                onChange={e => onUpdateSettings({...settings, appName: e.target.value})}
                className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">App Icon</label>
              <div className="flex flex-col gap-3">
                 <div className="flex gap-2">
                  {(['layout', 'scale', 'briefcase', 'gavel', 'shield'] as AppIconType[]).map(icon => (
                    <button
                      key={icon}
                      onClick={() => onUpdateSettings({...settings, appIcon: icon, customAppIconData: undefined })}
                      className={`p-2 rounded-lg border ${settings.appIcon === icon && !settings.customAppIconData ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                    >
                      {React.cloneElement(getIcon(icon), { className: 'w-5 h-5' })}
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center gap-3">
                   <span className="text-xs text-slate-500">Or upload custom:</span>
                   <button 
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-all ${settings.customAppIconData ? 'bg-blue-600/20 border-blue-500 text-blue-200' : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                   >
                     <Upload size={12} />
                     {settings.customAppIconData ? 'Change Icon' : 'Upload .png/.jpg'}
                   </button>
                   <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden"
                      accept=".png,.jpg,.jpeg,.ico"
                      onChange={handleAppIconUpload}
                   />
                   {settings.customAppIconData && (
                      <button 
                        onClick={() => onUpdateSettings({...settings, customAppIconData: undefined})}
                        className="text-xs text-red-400 hover:text-red-300 underline"
                      >
                        Remove Custom
                      </button>
                   )}
                </div>
              </div>
            </div>
          </section>

          {/* Color Palette Section */}
           <section className="space-y-4">
            <h4 className="text-sm font-semibold text-white border-b border-white/10 pb-2 flex items-center gap-2">
              <PaintBucket size={16} /> Theme Colors
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Header Color */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-400">Menu (Header)</label>
                <div className={`flex items-center gap-2 p-2 rounded-lg border ${settings.customHeaderColor ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-900/50'}`}>
                    <input 
                      type="color"
                      value={settings.customHeaderColor || '#0f172a'}
                      onChange={(e) => onUpdateSettings({...settings, customHeaderColor: e.target.value, headerStyle: ''})}
                      className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                    />
                    <div className="flex flex-col">
                       <span className="text-xs text-white font-mono">{settings.customHeaderColor || 'Default'}</span>
                       {settings.customHeaderColor && (
                         <button onClick={() => onUpdateSettings({...settings, customHeaderColor: undefined})} className="text-[10px] text-red-400 text-left hover:underline">Reset</button>
                       )}
                    </div>
                 </div>
              </div>
              
              {/* Widget Color */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-400">Widgets</label>
                 <div className={`flex items-center gap-2 p-2 rounded-lg border ${settings.customWidgetColor ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-900/50'}`}>
                    <input 
                      type="color"
                      value={settings.customWidgetColor || '#1e293b'}
                      onChange={(e) => onUpdateSettings({...settings, customWidgetColor: e.target.value})}
                      className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                    />
                    <div className="flex flex-col">
                       <span className="text-xs text-white font-mono">{settings.customWidgetColor || 'Default'}</span>
                       {settings.customWidgetColor && (
                         <button onClick={() => onUpdateSettings({...settings, customWidgetColor: undefined})} className="text-[10px] text-red-400 text-left hover:underline">Reset</button>
                       )}
                    </div>
                 </div>
              </div>
            </div>
            
            {/* Preset Header Styles Fallback */}
             <div className="space-y-2 pt-2">
              <label className="block text-xs font-medium text-slate-400">Menu Presets</label>
              <div className="grid grid-cols-2 gap-2">
                {HEADER_PRESETS.map((header, idx) => (
                  <button
                    key={idx}
                    onClick={() => onUpdateSettings({...settings, headerStyle: header.value, customHeaderColor: undefined})}
                    className={`px-3 py-2 text-left text-xs rounded-lg border transition-all ${!settings.customHeaderColor && settings.headerStyle === header.value ? 'border-blue-500 bg-blue-500/10 text-blue-200' : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-500'}`}
                  >
                    {header.name}
                  </button>
                ))}
              </div>
            </div>

           </section>

          {/* Global Background Section */}
          <section className="space-y-4">
            <h4 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Global Background</h4>
            
            <div className="space-y-3">
              <label className="block text-xs font-medium text-slate-400">Presets</label>
              <div className="grid grid-cols-2 gap-2">
                {BACKGROUND_PRESETS.map((bg, idx) => (
                  <button
                    key={idx}
                    onClick={() => onUpdateSettings({...settings, background: bg.value, customBackgroundColor: undefined, customBackgroundImageData: undefined})}
                    className={`px-3 py-2 text-left text-xs rounded-lg border transition-all ${!settings.customBackgroundColor && !settings.customBackgroundImageData && settings.background === bg.value ? 'border-blue-500 bg-blue-500/10 text-blue-200' : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-500'}`}
                  >
                    {bg.name}
                  </button>
                ))}
              </div>

              <label className="block text-xs font-medium text-slate-400 pt-2">Custom Global</label>
              <div className="grid grid-cols-2 gap-3">
                 {/* Color Picker */}
                 <div className={`flex items-center gap-2 p-2 rounded-lg border ${settings.customBackgroundColor ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-900/50'}`}>
                    <input 
                      type="color"
                      value={settings.customBackgroundColor || '#0f172a'}
                      onChange={(e) => onUpdateSettings({...settings, customBackgroundColor: e.target.value, customBackgroundImageData: undefined})}
                      className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                    />
                    <span className="text-xs text-slate-400">Solid Color</span>
                 </div>

                 {/* Image Upload */}
                 <div className={`flex items-center gap-2 p-2 rounded-lg border ${settings.customBackgroundImageData ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-900/50'}`}>
                    <button 
                      onClick={() => bgInputRef.current?.click()}
                      className="flex items-center gap-2 text-xs text-slate-400 hover:text-white w-full"
                    >
                       <ImageIcon size={16} />
                       <span className="truncate">{settings.customBackgroundImageData ? 'Change Image' : 'Upload Image'}</span>
                    </button>
                    <input 
                      type="file"
                      ref={bgInputRef}
                      className="hidden"
                      accept=".png,.jpg,.jpeg,.webp"
                      onChange={handleGlobalBgImageUpload}
                    />
                 </div>
              </div>
            </div>
          </section>

          {/* Pages Section */}
          <section className="space-y-4">
            <h4 className="text-sm font-semibold text-white border-b border-white/10 pb-2">Pages & Navigation</h4>
            <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-2">
              {pages.map(page => (
                <div key={page.id} className="rounded-xl bg-slate-950/50 border border-slate-700 overflow-hidden">
                  {/* Header of Card */}
                  <div className="p-3 flex items-center justify-between bg-slate-900/50 cursor-pointer hover:bg-slate-800/50 transition-colors" onClick={() => setExpandedPageId(expandedPageId === page.id ? null : page.id)}>
                     <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-300 uppercase">{page.title}</span>
                        <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 rounded">{page.background || page.customBackgroundColor || page.customBackgroundImageData ? 'Custom BG' : 'Default BG'}</span>
                     </div>
                     <div className="flex items-center gap-2 text-slate-500">
                        {expandedPageId === page.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                     </div>
                  </div>

                  {/* Expanded Body */}
                  {expandedPageId === page.id && (
                    <div className="p-4 space-y-4 border-t border-slate-800">
                      <div className="space-y-2">
                        <div>
                          <label className="text-[10px] text-slate-500">Title</label>
                          <input
                            type="text"
                            value={page.title}
                            onChange={e => onUpdatePageDetails(page.id, { title: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-md px-2 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500">Description</label>
                          <input
                            type="text"
                            value={page.description || ''}
                            placeholder="Page description..."
                            onChange={e => onUpdatePageDetails(page.id, { description: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-md px-2 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      {/* Page Specific Background */}
                      <div className="pt-2 border-t border-slate-800">
                         <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase">Page Background Override</label>
                         
                         <div className="space-y-2">
                           {/* Presets */}
                           <div className="grid grid-cols-3 gap-1.5">
                              {BACKGROUND_PRESETS.slice(0,3).map((bg, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => onUpdatePageDetails(page.id, { background: bg.value, customBackgroundColor: undefined, customBackgroundImageData: undefined })}
                                  className={`px-2 py-1.5 text-xs rounded border truncate ${page.background === bg.value && !page.customBackgroundColor && !page.customBackgroundImageData ? 'border-blue-500 bg-blue-500/10 text-blue-200' : 'border-slate-700 bg-slate-900 text-slate-400'}`}
                                  title={bg.name}
                                >
                                  {bg.name}
                                </button>
                              ))}
                           </div>

                           {/* Custom Image/Color */}
                           <div className="grid grid-cols-2 gap-2">
                              <div className={`flex items-center gap-2 p-1.5 rounded border ${page.customBackgroundColor ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-900'}`}>
                                <input 
                                  type="color"
                                  value={page.customBackgroundColor || '#0f172a'}
                                  onChange={(e) => onUpdatePageDetails(page.id, { customBackgroundColor: e.target.value, customBackgroundImageData: undefined, background: undefined })}
                                  className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0"
                                />
                                <span className="text-[10px] text-slate-400">Color</span>
                              </div>

                              <div className={`flex items-center gap-2 p-1.5 rounded border ${page.customBackgroundImageData ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-900'}`}>
                                <button 
                                  onClick={() => pageBgInputRefs.current[page.id]?.click()}
                                  className="flex items-center gap-2 text-[10px] text-slate-400 hover:text-white w-full"
                                >
                                  <Upload size={12} />
                                  <span className="truncate">{page.customBackgroundImageData ? 'Change' : 'Upload'}</span>
                                </button>
                                <input 
                                  type="file"
                                  ref={el => pageBgInputRefs.current[page.id] = el}
                                  className="hidden"
                                  accept=".png,.jpg,.jpeg,.webp"
                                  onChange={(e) => handlePageBgImageUpload(e, page.id)}
                                />
                              </div>
                           </div>
                           
                           {(page.background || page.customBackgroundColor || page.customBackgroundImageData) && (
                              <button 
                                onClick={() => onUpdatePageDetails(page.id, { background: undefined, customBackgroundColor: undefined, customBackgroundImageData: undefined })}
                                className="text-[10px] text-red-400 hover:text-red-300 underline w-full text-right"
                              >
                                Use Global Background
                              </button>
                           )}

                         </div>
                      </div>

                      {pages.length > 1 && (
                        <div className="pt-2 flex justify-end">
                           <button 
                             className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 hover:bg-red-500/10 px-2 py-1 rounded transition-colors"
                           >
                             <Trash2 size={12} /> Delete Page
                           </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

        </div>
        <div className="pt-6 mt-6 border-t border-white/10 flex justify-end">
          <Button onClick={() => setIsSettingsOpen(false)}>Done</Button>
        </div>
      </Modal>
    </>
  );
};
