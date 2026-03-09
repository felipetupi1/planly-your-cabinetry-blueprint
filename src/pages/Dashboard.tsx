import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";
import { FileText, Upload, Eye, Download, MessageSquare } from "lucide-react";
import { DashboardProject } from "@/components/dashboard/DashboardProject";
import { DashboardBrief } from "@/components/dashboard/DashboardBrief";
import { DashboardReview } from "@/components/dashboard/DashboardReview";
import { DashboardDelivery } from "@/components/dashboard/DashboardDelivery";
import { DashboardMessages } from "@/components/dashboard/DashboardMessages";

const stages = ["Payment", "Brief", "In Progress", "1st Draft", "Revision 1", "Revision 2", "Final Production", "Delivered"] as const;
type Stage = (typeof stages)[number];

const sections = [
  { id: "project", label: "My Project", icon: FileText },
  { id: "brief", label: "Brief", icon: Upload },
  { id: "review", label: "Review", icon: Eye },
  { id: "delivery", label: "Delivery", icon: Download },
  { id: "messages", label: "Messages", icon: MessageSquare },
];

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

function DashboardSidebar({
  activeSection,
  setActiveSection,
}: {
  activeSection: string;
  setActiveSection: (s: string) => void;
}) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="bg-primary text-primary-foreground">
      <SidebarContent className="pt-4">
        <div className="px-4 pb-4">
          {!collapsed && (
            <span className="text-sm font-medium tracking-[4px] uppercase text-primary-foreground">
              MEASURED
            </span>
          )}
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sections.map((s) => (
                <SidebarMenuItem key={s.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveSection(s.id)}
                    className={activeSection === s.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"}
                  >
                    <s.icon className="w-4 h-4 mr-2" />
                    {!collapsed && <span className="tracking-wide">{s.label}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default function Dashboard() {
  const { projectId } = useParams();
  const [activeSection, setActiveSection] = useState("project");
  const currentStage: Stage = "Brief";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b border-border px-4 gap-4">
            <SidebarTrigger />
            <div className="flex-1" />
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {stages.map((stage, i) => {
                const currentIdx = stages.indexOf(currentStage);
                const isActive = stage === currentStage;
                const isPast = i < currentIdx;
                return (
                  <div key={stage} className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap tracking-wide ${
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : isPast
                          ? "bg-success/20 text-success"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {stage}
                    </span>
                    {i < stages.length - 1 && (
                      <div className={`w-4 h-px ${isPast ? "bg-success" : "bg-border"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </header>
          <main className="flex-1 p-6 md:p-10 max-w-4xl">
            <DashboardContent activeSection={activeSection} currentStage={currentStage} />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
