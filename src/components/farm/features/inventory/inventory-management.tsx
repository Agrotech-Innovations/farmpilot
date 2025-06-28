import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export interface InventoryCategory {
  name: string;
  count: number;
  status: string;
  colorClass: string;
}

interface InventoryManagementProps {
  categories: InventoryCategory[];
  onCategoryClick?: (category: string) => void;
  className?: string;
}

export function InventoryManagement({
  categories,
  onCategoryClick,
  className = ''
}: InventoryManagementProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle>Inventory Management</CardTitle>
          <CardDescription>
            Track seeds, fertilizers, feed, tools, and harvested produce
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className="p-4 border border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => onCategoryClick?.(category.name)}
              >
                <h3 className={`font-semibold ${category.colorClass}`}>
                  {category.name}
                </h3>
                <p className="text-2xl font-bold">{category.count} items</p>
                <p className="text-sm text-muted-foreground">
                  {category.status}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
