import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload } from "lucide-react";

export function DashboardReview({ currentStage }: { currentStage: string }) {
  const [comment, setComment] = useState("");
  const [markupFiles, setMarkupFiles] = useState<File[]>([]);

  const stageIdx = ["Payment", "Brief", "In Progress", "1st Draft", "Revision 1", "Revision 2", "Final Production", "Delivered"].indexOf(currentStage);
  const isLocked = stageIdx < 3;

  const handleMarkupUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setMarkupFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
  };

  if (isLocked) {
    return (
      <div>
        <h2 className="text-2xl font-medium text-foreground tracking-wide">Review</h2>
        <p className="mt-4 text-muted-foreground font-light">
          Your project files will appear here once the design is ready for review.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-medium text-foreground tracking-wide">Review</h2>
      <p className="mt-2 text-muted-foreground font-light">
        Review your project files and leave comments. You have 2 revision rounds included.
      </p>

      <Tabs defaultValue="round1" className="mt-6">
        <TabsList>
          <TabsTrigger value="round1">Round 1</TabsTrigger>
          <TabsTrigger value="round2">Round 2</TabsTrigger>
        </TabsList>

        <TabsContent value="round1" className="mt-4 space-y-4">
          <div className="border border-border rounded-lg p-6 text-center text-muted-foreground font-light">
            Project files will be uploaded here by the designer.
          </div>

          {/* Markup upload */}
          <div>
            <label className="block text-xs text-muted-foreground mb-2 tracking-wide uppercase">
              Upload marked-up files (optional)
            </label>
            <label className="border border-dashed border-border rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:border-accent/40 transition-colors">
              <Upload className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-light">Print, annotate, and re-upload</span>
              <input type="file" multiple className="hidden" onChange={handleMarkupUpload} />
            </label>
            {markupFiles.length > 0 && (
              <div className="mt-2 space-y-1">
                {markupFiles.map((f, i) => (
                  <div key={i} className="text-sm text-muted-foreground font-light">{f.name}</div>
                ))}
              </div>
            )}
          </div>

          <div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Leave your feedback here..."
              rows={3}
              className="w-full border border-border rounded-lg p-4 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
            <div className="mt-3 flex gap-3">
              <Button variant="outline">Request revision</Button>
              <Button variant="hero">✓ Approve Project</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="round2" className="mt-4 space-y-4">
          <div className="border border-border rounded-lg p-6 text-center text-muted-foreground font-light">
            Round 2 files will appear here if a revision is requested.
          </div>
        </TabsContent>
      </Tabs>

      {/* Additional revision purchase */}
      <div className="mt-8 border border-border rounded-lg p-5">
        <h4 className="font-medium text-foreground">Need more revisions?</h4>
        <p className="text-sm text-muted-foreground mt-1 font-light">
          Purchase additional revision rounds: Small $65 / Medium $85 / Large $125
        </p>
        <Button variant="outline" size="sm" className="mt-3">
          Purchase revision
        </Button>
      </div>
    </div>
  );
}
