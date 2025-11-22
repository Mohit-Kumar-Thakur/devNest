import { useState } from 'react';
import { AdminHeader } from './AdminHeader';
import { AdminTabs, AdminTab } from './AdminTabs';
import { AnonymousPostsTab } from './AnonymousPostsTab';
import { FlaggedPostsTab } from './FlaggedPostsTab';
import { AnalyticsTab } from './AnalyticsTab';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('anonymous');
  const [selectedAuthor, setSelectedAuthor] = useState<any>(null);

  const handleAuthorIdentify = (author: any) => {
    setSelectedAuthor(author);
  };

  const handleCloseAuthor = () => {
    setSelectedAuthor(null);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'anonymous':
        return (
          <AnonymousPostsTab
            onAuthorIdentify={handleAuthorIdentify}
            selectedAuthor={selectedAuthor}
            onCloseAuthor={handleCloseAuthor}
          />
        );
      case 'flagged':
        return (
          <FlaggedPostsTab
            onAuthorIdentify={handleAuthorIdentify}
            selectedAuthor={selectedAuthor}
            onCloseAuthor={handleCloseAuthor}
          />
        );
      case 'analytics':
        return <AnalyticsTab />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default AdminDashboard;