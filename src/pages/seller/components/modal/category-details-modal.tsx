import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { QueryWrapper } from "@/components/query-wrapper/query-wrapper";
import { useGetACategory } from "../../api/use-get-a-category";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CategoryDetailsModalProps {
  categoryId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CategoryDetailsModal = ({
  categoryId,
  open,
  onOpenChange,
}: CategoryDetailsModalProps) => {
  const getCategory = useGetACategory(categoryId);
  const { data: category } = getCategory;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-lg overflow-y-auto">
        <QueryWrapper currentQuery={getCategory}>
          {category && (
            <>
              <SheetHeader>
                <SheetTitle>{category.name}</SheetTitle>
                <SheetDescription>
                  Category #{category.id.slice(0, 8).toUpperCase()}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <div className="rounded-xl overflow-hidden border border-border">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-56 object-cover"
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Description
                  </h4>
                  <p className="text-sm leading-relaxed">
                    {category.description}
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Status
                    </span>
                    <Badge
                      className={cn(
                        "rounded-full",
                        category.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700",
                      )}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Date Created
                    </span>
                    <span className="text-sm font-medium">
                      {format(new Date(category.createdAt), "MMM dd, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </QueryWrapper>
      </SheetContent>
    </Sheet>
  );
};
