import React, { useState, useEffect } from 'react';
import { AdminHeader } from './AdminHeader';
import { AdminTabs, AdminTab } from './AdminTabs';
import { AnonymousPostsTab } from './AnonymousPostsTab';
import { FlaggedPostsTab } from './FlaggedPostsTab';
import { AnalyticsTab } from './AnalyticsTab';
import '@/styles/admin.css';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('anonymous');
  const [selectedAuthor, setSelectedAuthor] = useState<any>(null);

  // Spotlight effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cards = document.querySelectorAll(".admin-glass-card");

      cards.forEach((card) => {
        const htmlCard = card as HTMLElement;
        const rect = htmlCard.getBoundingClientRect();

        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        htmlCard.style.setProperty("--x", x.toString());
        htmlCard.style.setProperty("--y", y.toString());
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

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
    <div className="admin-page-wrapper">
      <AdminHeader />

      <div className="max-w-7xl mx-auto p-0" style={{ position: 'relative', zIndex: 0 }}>
        <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default AdminDashboard;