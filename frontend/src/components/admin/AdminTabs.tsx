import { Button } from "@/components/ui/button";
import { User, Flag, MessageSquare } from 'lucide-react';

export type AdminTab = 'anonymous' | 'flagged' | 'analytics';

interface AdminTabsProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

export const AdminTabs = ({ activeTab, onTabChange }: AdminTabsProps) => {
  return (
    <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm border mb-6">
      <Button
        variant={activeTab === 'anonymous' ? 'default' : 'ghost'}
        onClick={() => onTabChange('anonymous')}
        className="flex-1"
      >
        <User className="w-4 h-4 mr-2" />
        All Anonymous Chats
      </Button>
      <Button
        variant={activeTab === 'flagged' ? 'default' : 'ghost'}
        onClick={() => onTabChange('flagged')}
        className="flex-1"
      >
        <Flag className="w-4 h-4 mr-2" />
        Flagged Content
      </Button>
      <Button
        variant={activeTab === 'analytics' ? 'default' : 'ghost'}
        onClick={() => onTabChange('analytics')}
        className="flex-1"
      >
        <MessageSquare className="w-4 h-4 mr-2" />
        Analytics
      </Button>
    </div>
  );
};