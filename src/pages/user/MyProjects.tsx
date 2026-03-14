import UserLayout from '@/components/user/UserLayout';
import { FolderKanban, Clock } from 'lucide-react';

const MyProjects = () => {
  return (
    <UserLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Projects</h1>
          <p className="text-gray-600">Track your ongoing and completed projects</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FolderKanban className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Projects Yet</h3>
          <p className="text-gray-600 mb-6">
            Projects will appear here once your quotes are approved and work begins.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Check back soon for updates</span>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default MyProjects;
