import { MessageCircle } from "lucide-react";

export const MessagesTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-foreground">
        Messages & Notifications
      </h2>
      <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
        <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
        <p className="text-sm">
          Messages and notifications feature will be available soon.
        </p>
      </div>
    </div>
  );
};
