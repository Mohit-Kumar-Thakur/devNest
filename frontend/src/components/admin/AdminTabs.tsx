import { User, Flag, MessageSquare } from 'lucide-react';

export type AdminTab = 'anonymous' | 'flagged' | 'analytics';

interface AdminTabsProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

export const AdminTabs = ({ activeTab, onTabChange }: AdminTabsProps) => {
  return (
    <div className="admin-tabs-container">
      <button
        onClick={() => onTabChange('anonymous')}
        className={`admin-tab ${activeTab === 'anonymous' ? 'active' : ''}`}
      >
        <User className="w-4 h-4 mr-2" />
        All Anonymous Chats
      </button>
      <button
        onClick={() => onTabChange('flagged')}
        className={`admin-tab ${activeTab === 'flagged' ? 'active' : ''}`}
      >
        <Flag className="w-4 h-4 mr-2" />
        Flagged Content
      </button>
      <button
        onClick={() => onTabChange('analytics')}
        className={`admin-tab ${activeTab === 'analytics' ? 'active' : ''}`}
      >
        <MessageSquare className="w-4 h-4 mr-2" />
        Analytics
      </button>
    </div>
  );
};