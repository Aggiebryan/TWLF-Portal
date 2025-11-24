
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Widget } from './components/Widget';
import { Modal } from './components/Modal';
import { Button } from './components/Button';
import { AppState, Page, Widget as IWidget, AppSettings } from './types';
import { loadState, saveState } from './services/storageService';
import { Plus } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState | null>(null);
  const [isAddingWidget, setIsAddingWidget] = useState(false);
  const [newWidgetTitle, setNewWidgetTitle] = useState('');

  // Load initial state
  useEffect(() => {
    const loaded = loadState();
    setState(loaded);
  }, []);

  // Save on change
  useEffect(() => {
    if (state) {
      saveState(state);
    }
  }, [state]);

  if (!state) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;

  const activePage = state.pages.find(p => p.id === state.activePageId) || state.pages[0];

  const handleNavigate = (pageId: string) => {
    setState(prev => prev ? ({ ...prev, activePageId: pageId }) : null);
  };

  const handleAddPage = (title: string) => {
    const newPage: Page = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      description: 'New page description',
      widgets: []
    };
    setState(prev => prev ? ({
      ...prev,
      pages: [...prev.pages, newPage],
      activePageId: newPage.id
    }) : null);
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setState(prev => prev ? ({ ...prev, settings: newSettings }) : null);
  };

  const handleUpdatePageDetails = (pageId: string, updates: { title?: string; description?: string; background?: string; customBackgroundImageData?: string; customBackgroundColor?: string }) => {
    setState(prev => {
      if (!prev) return null;
      const updatedPages = prev.pages.map(p => 
        p.id === pageId ? { ...p, ...updates } : p
      );
      return { ...prev, pages: updatedPages };
    });
  };

  const updateWidget = (updatedWidget: IWidget) => {
    setState(prev => {
      if (!prev) return null;
      const updatedPages = prev.pages.map(page => {
        if (page.id === prev.activePageId) {
          return {
            ...page,
            widgets: page.widgets.map(w => w.id === updatedWidget.id ? updatedWidget : w)
          };
        }
        return page;
      });
      return { ...prev, pages: updatedPages };
    });
  };

  const deleteWidget = (widgetId: string) => {
     setState(prev => {
      if (!prev) return null;
      const updatedPages = prev.pages.map(page => {
        if (page.id === prev.activePageId) {
          return {
            ...page,
            widgets: page.widgets.filter(w => w.id !== widgetId)
          };
        }
        return page;
      });
      return { ...prev, pages: updatedPages };
    });
  };

  const handleAddWidget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWidgetTitle) return;

    const newWidget: IWidget = {
      id: Math.random().toString(36).substring(2, 9),
      title: newWidgetTitle,
      type: 'bookmarks',
      size: 'medium',
      viewStyle: 'list',
      bookmarks: []
    };

    setState(prev => {
      if (!prev) return null;
      const updatedPages = prev.pages.map(page => {
        if (page.id === prev.activePageId) {
          return {
            ...page,
            widgets: [...page.widgets, newWidget]
          };
        }
        return page;
      });
      return { ...prev, pages: updatedPages };
    });

    setNewWidgetTitle('');
    setIsAddingWidget(false);
  };

  // Calculate Background Logic
  // Priority: Page Custom Image -> Page Custom Color -> Page Preset -> Global Custom Image -> Global Custom Color -> Global Preset
  const getBackgroundStyle = () => {
    // 1. Page specific overrides
    if (activePage.customBackgroundImageData) {
       return { 
        backgroundImage: `url(${activePage.customBackgroundImageData})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed' 
      };
    }
    if (activePage.customBackgroundColor) {
      return { backgroundColor: activePage.customBackgroundColor };
    }

    // 2. Global settings fallbacks
    if (state.settings.customBackgroundImageData) {
      return { 
        backgroundImage: `url(${state.settings.customBackgroundImageData})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed' 
      };
    }
    if (state.settings.customBackgroundColor) {
      return { backgroundColor: state.settings.customBackgroundColor };
    }
    return {};
  };
  
  // Determine class names for gradients if no custom color/image
  const hasCustomBackground = activePage.customBackgroundImageData || activePage.customBackgroundColor || state.settings.customBackgroundImageData || state.settings.customBackgroundColor;
  // If page has a preset background string, use it. If not, use global setting.
  const bgClassName = !hasCustomBackground 
     ? (activePage.background || state.settings.background)
     : '';

  const hasImageBackground = !!(activePage.customBackgroundImageData || state.settings.customBackgroundImageData);

  return (
    <div 
      className={`min-h-screen transition-colors duration-500 text-slate-200 selection:bg-blue-500/30 ${bgClassName}`}
      style={getBackgroundStyle()}
    >
      
      {/* Background Ambience (Only show if no custom image to avoid visual clutter) */}
      {!hasImageBackground && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/10 blur-[120px]" />
        </div>
      )}

      {/* Dark overlay for readability if using custom image */}
      {hasImageBackground && (
        <div className="fixed inset-0 z-0 bg-black/40 pointer-events-none" />
      )}

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header 
          pages={state.pages} 
          activePageId={state.activePageId} 
          settings={state.settings}
          onNavigate={handleNavigate}
          onAddPage={handleAddPage}
          onUpdateSettings={handleUpdateSettings}
          onUpdatePageDetails={handleUpdatePageDetails}
        />

        <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
               <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">{activePage.title}</h1>
               <p className="text-slate-300 drop-shadow-md font-medium">{activePage.description || "Manage your essential legal links and tools."}</p>
            </div>
            <Button onClick={() => setIsAddingWidget(true)} variant="primary" icon={<Plus size={18}/>}>
              Add Widget
            </Button>
          </div>

          <div className="grid grid-cols-12 gap-x-6 gap-y-0 pb-20 items-start auto-rows-[1px]">
            {activePage.widgets.map(widget => (
              <Widget 
                key={widget.id} 
                widget={widget} 
                customColor={state.settings.customWidgetColor}
                onUpdate={updateWidget}
                onDelete={deleteWidget}
              />
            ))}
            
            {activePage.widgets.length === 0 && (
              <div className="col-span-12 flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-800/50 bg-slate-900/20 rounded-3xl backdrop-blur-sm">
                <p className="text-slate-400 text-lg mb-4">This page is empty.</p>
                <Button variant="secondary" onClick={() => setIsAddingWidget(true)}>
                  Create your first widget
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add Widget Modal */}
      <Modal isOpen={isAddingWidget} onClose={() => setIsAddingWidget(false)} title="Create New Widget">
        <form onSubmit={handleAddWidget} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Widget Title</label>
            <input
              autoFocus
              type="text"
              value={newWidgetTitle}
              onChange={e => setNewWidgetTitle(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="e.g. Legal Research"
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsAddingWidget(false)}>Cancel</Button>
            <Button type="submit">Create Widget</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default App;
