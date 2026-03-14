import AdminLayout from '@/components/admin/AdminLayout';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Site Settings</h1>
          <p className="text-muted-foreground">Manage site configuration and preferences</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <SettingsIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">Settings Coming Soon</h3>
          <p className="text-muted-foreground">Site settings and configuration will be available soon.</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;
