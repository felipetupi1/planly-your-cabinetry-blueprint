import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Camera, Calendar, Ruler } from "lucide-react";

interface MeasurementData {
  length: string;
  width: string;
  ceilingHeight: string;
  doorWidths: string;
  doorHeights: string;
  windowWidths: string;
  windowHeights: string;
  trimDepth: string;
  baseboardHeight: string;
  obstacles: string;
}

const emptyMeasurements: MeasurementData = {
  length: "",
  width: "",
  ceilingHeight: "",
  doorWidths: "",
  doorHeights: "",
  windowWidths: "",
  windowHeights: "",
  trimDepth: "",
  baseboardHeight: "",
  obstacles: "",
};

export function DashboardBrief() {
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [measurements, setMeasurements] = useState<MeasurementData>(emptyMeasurements);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const updateMeasurement = (key: keyof MeasurementData, value: string) => {
    setMeasurements((prev) => ({ ...prev, [key]: value }));
  };

  const sqft =
    measurements.length && measurements.width
      ? parseFloat(measurements.length) * parseFloat(measurements.width)
      : null;

  const sizeTier =
    sqft !== null && sqft > 0
      ? sqft >= 160
        ? "Large (over 160 sq/ft)"
        : sqft >= 80
        ? "Medium (80–160 sq/ft)"
        : "Small (under 80 sq/ft)"
      : null;

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-foreground">Submit Brief</h2>
      <p className="mt-2 text-muted-foreground">
        Upload your floor plan, photos, and references. Add measurements and describe your vision.
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

        {/* Measurement form */}
        <div className="border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Ruler className="w-5 h-5 text-primary" />
            <h4 className="font-medium text-foreground">Room measurements</h4>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Length (ft)</label>
              <Input type="number" min="0" value={measurements.length} onChange={(e) => updateMeasurement("length", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Width (ft)</label>
              <Input type="number" min="0" value={measurements.width} onChange={(e) => updateMeasurement("width", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Ceiling height (ft)</label>
              <Input type="number" min="0" value={measurements.ceilingHeight} onChange={(e) => updateMeasurement("ceilingHeight", e.target.value)} />
            </div>
          </div>
          {sqft !== null && sqft > 0 && (
            <p className="mt-3 text-sm font-medium text-primary">
              {sqft.toFixed(0)} sq/ft — {sizeTier}
            </p>
          )}
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Door widths (in)</label>
              <Input placeholder="e.g. 32, 36" value={measurements.doorWidths} onChange={(e) => updateMeasurement("doorWidths", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Door heights (in)</label>
              <Input placeholder="e.g. 80" value={measurements.doorHeights} onChange={(e) => updateMeasurement("doorHeights", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Window widths (in)</label>
              <Input placeholder="e.g. 36, 48" value={measurements.windowWidths} onChange={(e) => updateMeasurement("windowWidths", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Window heights (in)</label>
              <Input placeholder="e.g. 48" value={measurements.windowHeights} onChange={(e) => updateMeasurement("windowHeights", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Trim / casing depth (in)</label>
              <Input placeholder="e.g. 3.5" value={measurements.trimDepth} onChange={(e) => updateMeasurement("trimDepth", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Baseboard height (in)</label>
              <Input placeholder="e.g. 5" value={measurements.baseboardHeight} onChange={(e) => updateMeasurement("baseboardHeight", e.target.value)} />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-xs text-muted-foreground mb-1">Obstacles or special conditions</label>
            <textarea
              value={measurements.obstacles}
              onChange={(e) => updateMeasurement("obstacles", e.target.value)}
              placeholder="Radiators, vents, pipes, electrical panels..."
              rows={2}
              className="w-full border border-border rounded-lg p-3 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
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
              For other devices, photo upload + the measurement form above work just as well.
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
