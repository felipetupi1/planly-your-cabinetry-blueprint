import { Download, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardDelivery({ currentStage }: { currentStage: string }) {
  const isUnlocked = currentStage === "Approved" || currentStage === "Delivered";

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-foreground">Final Delivery</h2>

      {!isUnlocked ? (
        <div className="mt-8 border border-border rounded-xl p-10 text-center">
          <Lock className="w-10 h-10 text-muted-foreground mx-auto" />
          <p className="mt-4 text-muted-foreground">
            Your files will be available here once the project is approved.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          <p className="text-muted-foreground">
            Your project is ready. Download your files and take them to any cabinetmaker.
          </p>
          <div className="border border-border rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Project Documents (PDF)</p>
              <p className="text-sm text-muted-foreground">Floor plan, sections, elevations</p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" /> Download
            </Button>
          </div>
          <div className="border border-border rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">CAD Files (DWG)</p>
              <p className="text-sm text-muted-foreground">Editable construction documents</p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" /> Download
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
