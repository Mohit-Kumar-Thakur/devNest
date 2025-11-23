import { MessageSquare, Flag, User, TrendingUp } from 'lucide-react';

export const AnalyticsTab = () => {
  const stats = [
    { label: 'Total Posts', value: '1,234', icon: <MessageSquare className="w-6 h-6 text-blue-400" /> },
    { label: 'Flagged Posts', value: '42', icon: <Flag className="w-6 h-6 text-red-400" /> },
    { label: 'Active Users', value: '892', icon: <User className="w-6 h-6 text-green-400" /> },
    { label: 'Growth Rate', value: '+12%', icon: <TrendingUp className="w-6 h-6 text-purple-400" /> }
  ];

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {stats.map((stat, idx) => (
          <div key={idx} className="admin-glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="stat-icon-wrapper">
                {stat.icon}
              </div>
              <div>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#ffffff' }}>
                  {stat.value}
                </p>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)', margin: '4px 0 0 0' }}>
                  {stat.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-glass-card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '16px', margin: 0 }}>
          Recent Activity
        </h2>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {[
            { action: 'New post created', time: '5 minutes ago', author: 'User #1234' },
            { action: 'Content flagged', time: '15 minutes ago', author: 'User #5678' },
            { action: 'User registered', time: '1 hour ago', author: 'New User' },
            { action: 'Anonymous post identified', time: '2 hours ago', author: 'Admin Action' }
          ].map((activity, idx) => (
            <div key={idx} style={{
              padding: '12px',
              borderBottom: idx !== 3 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ margin: 0, fontWeight: '500', color: '#ffffff' }}>{activity.action}</p>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                  {activity.time}
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', margin: '4px 0 0 0' }}>
                {activity.author}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};