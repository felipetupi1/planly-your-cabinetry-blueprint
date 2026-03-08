import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DashboardReview({ currentStage }: { currentStage: string }) {
  const [comment, setComment] = useState("");

  const isLocked = currentStage === "Brief" || currentStage === "In Progress";

  if (isLocked) {
    return (
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground">Review</h2>
        <p className="mt-4 text-muted-foreground">
          Your project files will appear here once the design is ready for review.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-foreground">Review</h2>
      <p className="mt-2 text-muted-foreground">
        Review your project files and leave comments. You have 2 revision rounds.
      </p>

      <Tabs defaultValue="round1" className="mt-6">
        <TabsList>
          <TabsTrigger value="round1">Round 1</TabsTrigger>
          <TabsTrigger value="round2">Round 2</TabsTrigger>
        </TabsList>

        <TabsContent value="round1" className="mt-4">
          <div className="border border-border rounded-xl p-6 text-center text-muted-foreground">
            Project files will be uploaded here by the designer.
          </div>
          <div className="mt-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Leave your feedback here..."
              rows={3}
              className="w-full border border-border rounded-xl p-4 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
            <div className="mt-3 flex gap-3">
              <Button variant="hero">Approve</Button>
              <Button variant="outline">Request revision</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="round2" className="mt-4">
          <div className="border border-border rounded-xl p-6 text-center text-muted-foreground">
            Round 2 files will appear here if a revision is requested.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
