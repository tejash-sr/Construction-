import AdminLayout from '@/components/admin/AdminLayout';
import { FolderKanban } from 'lucide-react';

const Projects = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Project Management</h1>
          <p className="text-muted-foreground">Manage all construction projects</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <FolderKanban className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">Projects Coming Soon</h3>
          <p className="text-muted-foreground">Project management features will be available soon.</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Projects;
