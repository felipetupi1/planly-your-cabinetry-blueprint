import { useState } from "react";
import { useParams } from "react-router-dom";
import { DashboardProject } from "@/components/dashboard/DashboardProject";
import { DashboardBrief } from "@/components/dashboard/DashboardBrief";
import { DashboardReview } from "@/components/dashboard/DashboardReview";
import { DashboardDelivery } from "@/components/dashboard/DashboardDelivery";
import { DashboardMessages } from "@/components/dashboard/DashboardMessages";

const stages = ["Payment", "Brief", "In Progress", "1st Draft", "Revision 1", "Revision 2", "Final Production", "Delivered"] as const;
type Stage = (typeof stages)[number];

const sections = [
  { id: "project", label: "My Project" },
  { id: "brief", label: "Brief" },
  { id: "review", label: "Review" },
  { id: "delivery", label: "Delivery" },
  { id: "messages", label: "Messages" },
];

function StatusBar({ currentStage }: { currentStage: Stage }) {
  const currentIdx = stages.indexOf(currentStage);

  return (
    <div className="w-full border-b border-border bg-background px-12 py-5">
      <div className="max-w-[800px]">
        {/* Progress line */}
        <div className="relative flex items-center">
          {stages.map((stage, i) => {
            const isActive = i === currentIdx;
            const isPast = i < currentIdx;
            const isFuture = i > currentIdx;

            return (
              <div key={stage} className="flex items-center flex-1 last:flex-none">
                {/* Dot */}
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    isActive ? "bg-accent" : isPast ? "bg-primary" : "bg-warm-gray"
                  }`}
                />
                {/* Line */}
                {i < stages.length - 1 && (
                  <div
                    className={`flex-1 h-[3px] ${
                      isPast ? "bg-primary" : "bg-warm-gray"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
        {/* Labels */}
        <div className="relative flex mt-2">
          {stages.map((stage, i) => {
            const isActive = i === currentIdx;
            const isPast = i < currentIdx;
            return (
              <div key={stage} className="flex-1 last:flex-none">
                <span
                  className={`text-[9px] font-light tracking-[1px] uppercase whitespace-nowrap ${
                    isActive
                      ? "text-accent font-normal"
                      : isPast
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {stage}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DashboardContent({ activeSection, currentStage }: { activeSection: string; currentStage: Stage }) {
  switch (activeSection) {
    case "project": return <DashboardProject />;
    case "brief": return <DashboardBrief />;
    case "review": return <DashboardReview currentStage={currentStage} />;
    case "delivery": return <DashboardDelivery currentStage={currentStage} />;
    case "messages": return <DashboardMessages />;
    default: return <DashboardProject />;
  }
}

export default function Dashboard() {
  const { projectId } = useParams();
  const [activeSection, setActiveSection] = useState("project");
  const currentStage: Stage = "Brief";

  return (
    <div className="min-h-screen flex">
      {/* Fixed sidebar */}
      <aside className="w-[220px] min-h-screen bg-primary flex flex-col flex-shrink-0">
        <div className="px-5 py-6">
          <span className="text-[11px] font-medium tracking-[4px] uppercase text-primary-foreground">
            MEASURED
          </span>
        </div>
        <nav className="mt-4 flex-1">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`dash-nav-item w-full text-left ${activeSection === s.id ? "active" : ""}`}
            >
              {s.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-screen bg-background">
        <StatusBar currentStage={currentStage} />
        <main className="flex-1 px-12 py-8">
          <div className="max-w-[800px]">
            <DashboardContent activeSection={activeSection} currentStage={currentStage} />
          </div>
        </main>
      </div>
    </div>
  );
}
