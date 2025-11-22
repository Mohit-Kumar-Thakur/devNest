import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from 'lucide-react';

export const AnalyticsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Analytics dashboard coming soon</p>
          <p className="text-sm mt-2">
            Switch to other tabs to manage anonymous chats and flagged content
          </p>
        </div>
      </CardContent>
    </Card>
  );
};