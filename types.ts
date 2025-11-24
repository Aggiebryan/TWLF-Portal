
export type ViewStyle = 'list' | 'detailed' | 'grid';
export type WidgetSize = 'small' | 'medium' | 'large' | 'full';
export type AppIconType = 'layout' | 'scale' | 'briefcase' | 'gavel' | 'shield';
export type GridItemSize = 'small' | 'medium' | 'large';

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  iconUrl?: string; // Custom icon URL or Base64 data
}

export interface Widget {
  id: string;
  title: string;
  type: 'bookmarks'; // Extensible for future widget types
  size: WidgetSize;
  viewStyle: ViewStyle;
  gridItemSize?: GridItemSize;
  bookmarks: Bookmark[];
  customBackgroundColor?: string; // Hex color code for specific widget
}

export interface Page {
  id: string;
  title: string;
  description?: string;
  widgets: Widget[];
  // Page specific background overrides
  background?: string; 
  customBackgroundImageData?: string; // Base64 string of uploaded background
  customBackgroundColor?: string; // Hex color code
}

export interface AppSettings {
  appName: string;
  appIcon: AppIconType;
  customAppIconData?: string; // Base64 string of uploaded icon
  
  // Global Background Default
  background: string; // Tailwind classes for gradient (preset)
  customBackgroundImageData?: string; // Base64 string of uploaded background
  customBackgroundColor?: string; // Hex color code
  
  // Theme Colors
  headerStyle: string; // Tailwind classes for header background (preset)
  customHeaderColor?: string; // Hex/RGBA color for header
  customWidgetColor?: string; // Hex/RGBA color for widgets
}

export interface AppState {
  pages: Page[];
  activePageId: string;
  settings: AppSettings;
}