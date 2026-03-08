import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Camera, Calendar } from "lucide-react";

export function DashboardBrief() {
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-foreground">Submit Brief</h2>
      <p className="mt-2 text-muted-foreground">
        Upload your floor plan, photos, and references. Describe your vision.
      </p>

      <div className="mt-8 space-y-6">
        {/* File upload */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Upload files
          </label>
          <label className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center cursor-pointer hover:border-primary/40 transition-colors">
            <Upload className="w-8 h-8 text-muted-foreground" />
            <span className="mt-2 text-sm text-muted-foreground">
              Floor plan, photos, reference images
            </span>
            <input type="file" multiple className="hidden" onChange={handleFileChange} />
          </label>
          {files.length > 0 && (
            <div className="mt-3 space-y-1">
              {files.map((f, i) => (
                <div key={i} className="text-sm text-muted-foreground">
                  {f.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Describe your project
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell us about your vision — style, colors, materials, layout preferences..."
            rows={5}
            className="w-full border border-border rounded-xl p-4 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>

        {/* 3D Scan */}
        <div className="border border-border rounded-xl p-5 flex items-start gap-4">
          <Camera className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground">3D Room Scan</h4>
            <p className="text-sm text-muted-foreground mt-1">
              If you have an iPhone Pro with LiDAR, you can scan your room directly from this browser.
              For other devices, photo upload + dimensions work just as well.
            </p>
            <Button variant="outline" size="sm" className="mt-3">
              Launch scanner
            </Button>
          </div>
        </div>

        {/* Calendly */}
        <div className="border border-border rounded-xl p-5 flex items-start gap-4">
          <Calendar className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground">Schedule a call</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Prefer to discuss your project live? Book a quick call.
            </p>
            <Button variant="outline" size="sm" className="mt-3">
              Open calendar
            </Button>
          </div>
        </div>

        <Button variant="hero" className="w-full">
          Submit brief
        </Button>
      </div>
    </div>
  );
}
