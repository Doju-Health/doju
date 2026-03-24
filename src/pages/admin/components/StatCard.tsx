import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  sub?: {
    label: string;
    value: number;
    icon?: React.ElementType;
    color?: string;
  }[];
}

export function StatCard({ title, value, icon: Icon, sub }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="rounded-md bg-muted p-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
        {sub && sub.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3">
            {sub.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                {item.icon && (
                  <item.icon className={`h-3.5 w-3.5 ${item.color ?? ""}`} />
                )}
                <span className="font-medium">{item.value}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
