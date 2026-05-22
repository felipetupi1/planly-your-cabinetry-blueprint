import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const STAGES = [
  "Payment",
  "Brief",
  "In Progress",
  "1st Draft",
  "Revision 1",
  "Revision 2",
  "Final Production",
  "Delivered",
];

interface Props {
  projectId: string;
  onBack: () => void;
}

export function AdminProjectDetail({ projectId, onBack }: Props) {
  const [project, setProject] = useState<any>(null);
  const [spaces, setSpaces] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [fileUrls, setFileUrls] = useState<Record<string, string>>({});
  const [newMessage, setNewMessage] = useState("");
  const [newNote, setNewNote] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [{ data: proj }, { data: sps }, { data: msgs }, { data: nts }, { data: fls }] = await Promise.all([
      supabase.from("projects").select("*").eq("id", projectId).maybeSingle(),
      supabase.from("spaces").select("*").eq("project_id", projectId),
      supabase.from("messages").select("*").eq("project_id", projectId).order("created_at", { ascending: true }),
      supabase.from("project_notes").select("*").eq("project_id", projectId).order("created_at", { ascending: false }),
      supabase.storage.from("project-files").list(projectId, { sortBy: { column: "created_at", order: "desc" } }),
    ]);
    setProject(proj);
    setSpaces(sps || []);
    setMessages(msgs || []);
    setNotes(nts || []);
    setFiles(fls || []);

    // Generate signed URLs for the (now private) bucket
    const urls: Record<string, string> = {};
    await Promise.all(
      (fls || []).map(async (f: any) => {
        const { data } = await supabase.storage
          .from("project-files")
          .createSignedUrl(`${projectId}/${f.name}`, 3600);
        if (data?.signedUrl) urls[f.name] = data.signedUrl;
      })
    );
    setFileUrls(urls);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const updateStage = async (stage: string) => {
    const { error } = await supabase.from("projects").update({ stage }).eq("id", projectId);
    if (error) return toast({ title: "Error", description: error.message });
    setProject({ ...project, stage });
    toast({ title: "Status updated", description: stage });
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const { error } = await supabase.from("messages").insert({
      project_id: projectId,
      content: newMessage.trim(),
      from_role: "admin",
    });
    if (error) return toast({ title: "Error", description: error.message });
    setNewMessage("");
    load();
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    const { error } = await supabase.from("project_notes").insert({
      project_id: projectId,
      content: newNote.trim(),
    });
    if (error) return toast({ title: "Error", description: error.message });
    setNewNote("");
    load();
  };

  const deleteNote = async (id: string) => {
    await supabase.from("project_notes").delete().eq("id", id);
    load();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `${projectId}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("project-files").upload(path, file);
    setUploading(false);
    if (error) return toast({ title: "Upload failed", description: error.message });
    toast({ title: "File uploaded" });
    e.target.value = "";
    load();
  };

  const fileUrl = (name: string) => fileUrls[name] || "#";

  const deleteFile = async (name: string) => {
    await supabase.storage.from("project-files").remove([`${projectId}/${name}`]);
    load();
  };

  if (loading) return <div className="text-muted-foreground text-sm">Loading project...</div>;
  if (!project) return <div className="text-muted-foreground text-sm">Project not found.</div>;

  const total = spaces.reduce((s, sp) => s + (sp.price || 0), 0);
  const dateStr = project.created_at
    ? new Date(project.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";

  return (
    <div className="space-y-8">
      <button onClick={onBack} className="text-xs tracking-[3px] uppercase text-muted-foreground hover:text-foreground">
        ← Back to projects
      </button>

      {/* HEADER */}
      <div className="border border-border rounded-lg p-6">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <h2 className="text-2xl font-medium text-foreground tracking-wide">{project.client_name}</h2>
            <div className="text-sm text-muted-foreground mt-1">{project.client_email}</div>
            <div className="text-xs text-muted-foreground mt-2 font-light">
              ID: {project.id.slice(0, 8).toUpperCase()} · Created {dateStr}
            </div>
            <div className="text-xs text-muted-foreground mt-2 font-light">
              Spaces: {spaces.map((s) => `${s.space_label} (${s.size || "?"})`).join(", ") || "—"}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-medium text-foreground">${total}</div>
            <span className="inline-block mt-2 text-xs font-medium px-3 py-1 rounded-full bg-accent/10 text-accent">
              {project.stage}
            </span>
          </div>
        </div>
      </div>

      {/* STATUS PIPELINE */}
      <div>
        <h3 className="dash-label mb-3">Status Pipeline</h3>
        <div className="flex flex-wrap gap-2">
          {STAGES.map((s) => {
            const active = project.stage === s;
            return (
              <button
                key={s}
                onClick={() => updateStage(s)}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors tracking-wide ${
                  active
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* FILES */}
      <div>
        <h3 className="dash-label mb-3">Files</h3>
        <div className="border border-border rounded-lg p-4 space-y-3">
          <label className="block">
            <input
              type="file"
              accept=".pdf,.dwg,image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="text-xs file:mr-3 file:py-2 file:px-4 file:border file:border-primary file:bg-background file:text-primary file:rounded-[2px] file:text-[10px] file:uppercase file:tracking-[3px] file:font-medium"
            />
          </label>
          {files.length === 0 ? (
            <div className="text-xs text-muted-foreground font-light">No files uploaded yet.</div>
          ) : (
            <ul className="divide-y divide-border">
              {files.map((f) => (
                <li key={f.name} className="flex items-center justify-between py-2 text-sm">
                  <a
                    href={fileUrl(f.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline truncate"
                  >
                    {f.name}
                  </a>
                  <button
                    onClick={() => deleteFile(f.name)}
                    className="text-xs text-muted-foreground hover:text-destructive ml-3"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* MESSAGES */}
      <div>
        <h3 className="dash-label mb-3">Messages</h3>
        <div className="border border-border rounded-lg p-4 space-y-3">
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-xs text-muted-foreground font-light">No messages yet.</div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-3 rounded-lg text-sm ${
                    m.from_role === "admin" ? "bg-accent/10 ml-8" : "bg-secondary mr-8"
                  }`}
                >
                  <div className="text-[10px] uppercase tracking-[2px] text-muted-foreground mb-1">
                    {m.from_role} · {new Date(m.created_at).toLocaleString()}
                  </div>
                  <div className="text-foreground whitespace-pre-wrap">{m.content}</div>
                </div>
              ))
            )}
          </div>
          <div className="flex gap-2 pt-2 border-t border-border">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message to the client..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button onClick={sendMessage}>Send</Button>
          </div>
        </div>
      </div>

      {/* NOTES */}
      <div>
        <h3 className="dash-label mb-3">Internal Notes (admin only)</h3>
        <div className="border border-border rounded-lg p-4 space-y-3">
          <div className="flex gap-2">
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Private note — not visible to client"
              className="min-h-[60px]"
            />
            <Button onClick={addNote}>Add</Button>
          </div>
          {notes.length === 0 ? (
            <div className="text-xs text-muted-foreground font-light">No notes yet.</div>
          ) : (
            <ul className="space-y-2">
              {notes.map((n) => (
                <li key={n.id} className="bg-secondary p-3 rounded text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-foreground whitespace-pre-wrap flex-1">{n.content}</div>
                    <button
                      onClick={() => deleteNote(n.id)}
                      className="text-xs text-muted-foreground hover:text-destructive"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="text-[10px] uppercase tracking-[2px] text-muted-foreground mt-2">
                    {new Date(n.created_at).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
