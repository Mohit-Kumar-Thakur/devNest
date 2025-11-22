import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Shield, Calendar, Ban, Eye } from 'lucide-react';

interface Author {
  id: string;
  name: string;
  email: string;
  role: string;
  reportedCount: number;
  isBanned: boolean;
  createdAt: string;
  postContent?: string;
  postCreatedAt?: string;
}

interface AuthorDetailsSidebarProps {
  selectedAuthor: Author | null;
  onClose: () => void;
  showBanButton?: boolean;
  onBanUser?: (userId: string) => void;
}

export const AuthorDetailsSidebar = ({
  selectedAuthor,
  onClose,
  showBanButton = false,
  onBanUser
}: AuthorDetailsSidebarProps) => {
  if (!selectedAuthor) {
    return (
      <div className="lg:col-span-1">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Author Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Select a chat to view author details</p>
              <p className="text-sm mt-2">
                Click "Reveal Author" to see who is behind anonymous messages
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="lg:col-span-1">
      <Card className="sticky top-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Author Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-3">Real Identity Revealed</h3>
              
              {selectedAuthor.postContent && (
                <div className="mb-4 p-3 bg-white rounded border">
                  <p className="text-sm text-gray-600 mb-1">Posted as anonymous:</p>
                  <p className="text-sm font-medium">"{selectedAuthor.postContent}"</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedAuthor.postCreatedAt && new Date(selectedAuthor.postCreatedAt).toLocaleString()}
                  </p>
                </div>
              )}
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-gray-500" />
                  <div>
                    <p className="font-medium">{selectedAuthor.name}</p>
                    <p className="text-xs text-gray-500">Real Name</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm">{selectedAuthor.email}</p>
                    <p className="text-xs text-gray-500">Email</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-gray-500" />
                  <div>
                    <Badge variant={selectedAuthor.role === 'admin' ? 'default' : 'secondary'}>
                      {selectedAuthor.role}
                    </Badge>
                    <p className="text-xs text-gray-500">Role</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm">
                      {new Date(selectedAuthor.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">Joined</p>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <Badge variant={selectedAuthor.isBanned ? "destructive" : "default"}>
                    {selectedAuthor.isBanned ? 'BANNED USER' : 'Active User'}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    Reported {selectedAuthor.reportedCount || 0} times
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {showBanButton && !selectedAuthor.isBanned && onBanUser && (
                <Button
                  onClick={() => onBanUser(selectedAuthor.id)}
                  className="w-full bg-red-600 hover:bg-red-700"
                  size="sm"
                >
                  <Ban className="w-4 h-4 mr-1" />
                  Ban This User
                </Button>
              )}
              
              <Button
                onClick={onClose}
                variant="outline"
                className="w-full"
                size="sm"
              >
                Close Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};