import { Settings } from "lucide-react";

export const SettingsTab = () => {
  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-lg font-semibold text-foreground">Settings</h2>
      <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
        <Settings className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
        <p className="text-sm">Settings page will be available soon.</p>
      </div>
    </div>
  );
};
