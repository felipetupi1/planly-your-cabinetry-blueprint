import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Camera, Calendar, Ruler, Smartphone } from "lucide-react";

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
  length: "", width: "", ceilingHeight: "",
  doorWidths: "", doorHeights: "", windowWidths: "", windowHeights: "",
  trimDepth: "", baseboardHeight: "", obstacles: "",
};

function useIsIPhone() {
  const [isIPhone, setIsIPhone] = useState(false);
  useEffect(() => {
    const ua = navigator.userAgent;
    setIsIPhone(/iPhone/i.test(ua) && /Safari/i.test(ua));
  }, []);
  return isIPhone;
}

export function DashboardBrief() {
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [measurements, setMeasurements] = useState<MeasurementData>(emptyMeasurements);
  const isIPhone = useIsIPhone();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
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
      ? sqft >= 160 ? "Large (over 160 sq/ft)" : sqft >= 80 ? "Medium (80–160 sq/ft)" : "Small (under 80 sq/ft)"
      : null;

  return (
    <div>
      <h2 className="text-2xl font-medium text-foreground tracking-wide">Submit Brief</h2>
      <p className="mt-2 text-muted-foreground font-light">
        Upload your floor plan, photos, and references. Add measurements and describe your vision.
      </p>

      <div className="mt-8 space-y-6">
        {/* 3D Scan — device-aware */}
        <div className="border border-border rounded-lg p-5 flex items-start gap-4">
          {isIPhone ? (
            <>
              <Smartphone className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground">Scan your space in 3D</h4>
                <p className="text-sm text-muted-foreground mt-1 font-light">
                  Use your iPhone's camera to create a 3D scan of your room.
                </p>
                <Button variant="hero" size="sm" className="mt-3" onClick={() => window.open("https://poly.cam/capture", "_blank")}>
                  Scan your space
                </Button>
              </div>
            </>
          ) : (
            <>
              <Camera className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground">3D Room Scan</h4>
                <p className="text-sm text-muted-foreground mt-1 font-light">
                  3D scanning requires an iPhone. You can upload photos and use our measurement form below — it works just as well.
                </p>
              </div>
            </>
          )}
        </div>

        {/* File upload */}
        <div>
          <label className="block text-xs text-muted-foreground mb-2 tracking-wide uppercase">Upload files</label>
          <label className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center cursor-pointer hover:border-accent/40 transition-colors">
            <Upload className="w-8 h-8 text-muted-foreground" />
            <span className="mt-2 text-sm text-muted-foreground font-light">Floor plan, photos, reference images — drag and drop or click</span>
            <input type="file" multiple className="hidden" onChange={handleFileChange} />
          </label>
          {files.length > 0 && (
            <div className="mt-3 space-y-1">
              {files.map((f, i) => (
                <div key={i} className="text-sm text-muted-foreground font-light">{f.name}</div>
              ))}
            </div>
          )}
        </div>

        {/* Measurement form */}
        <div className="border border-border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <Ruler className="w-5 h-5 text-accent" />
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
            <p className="mt-3 text-sm font-medium text-accent">{sqft.toFixed(0)} sq/ft — {sizeTier}</p>
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
          <label className="block text-xs text-muted-foreground mb-2 tracking-wide uppercase">Describe your project</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell us about your vision — style, colors, materials, layout preferences..."
            rows={5}
            className="w-full border border-border rounded-lg p-4 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>

        {/* Room Mapping Tool placeholder */}
        <div className="border border-border rounded-lg p-5 flex items-start gap-4">
          <Ruler className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground">Room Mapping Tool</h4>
            <p className="text-sm text-muted-foreground mt-1 font-light">
              Place doors, windows, and fixtures on your floor plan interactively.
            </p>
            <Button variant="outline" size="sm" className="mt-3">
              Open room tool
            </Button>
          </div>
        </div>

        {/* Calendly */}
        <div className="border border-border rounded-lg p-5 flex items-start gap-4">
          <Calendar className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground">Book a 20-min consultation</h4>
            <p className="text-sm text-muted-foreground mt-1 font-light">
              Prefer to discuss your project live? Schedule a quick call with our team.
            </p>
            <Button variant="outline" size="sm" className="mt-3">
              Open calendar
            </Button>
          </div>
        </div>

        <Button variant="hero" className="w-full">Submit brief</Button>
      </div>
    </div>
  );
}
