export function DashboardProject() {
  const project = {
    id: "MEAS-2026-001",
    date: "March 9, 2026",
    spaces: [
      { name: "Kitchen", size: "Medium (80–160 sq/ft)", price: 550, render3d: true },
      { name: "Pantry", size: "Small (under 80 sq/ft)", price: 200, render3d: false },
    ],
    discount: 10,
    total: 810,
  };

  return (
    <div>
      <h2 className="text-2xl font-medium text-foreground tracking-wide">My Project</h2>
      <p className="mt-2 text-muted-foreground font-light">Summary of what was purchased.</p>

      <div className="mt-4 flex gap-6 text-sm text-muted-foreground font-light">
        <span>Project ID: <span className="text-foreground font-medium">{project.id}</span></span>
        <span>Submitted: <span className="text-foreground font-medium">{project.date}</span></span>
      </div>

      <div className="mt-6 border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary">
              <th className="text-left p-4 font-medium text-foreground tracking-wide">Space</th>
              <th className="text-left p-4 font-medium text-foreground tracking-wide">Size</th>
              <th className="text-left p-4 font-medium text-foreground tracking-wide">3D Render</th>
              <th className="text-right p-4 font-medium text-foreground tracking-wide">Price</th>
            </tr>
          </thead>
          <tbody>
            {project.spaces.map((s, i) => (
              <tr key={i} className="border-t border-border">
                <td className="p-4 text-foreground">{s.name}</td>
                <td className="p-4 text-muted-foreground font-light">{s.size}</td>
                <td className="p-4 text-muted-foreground font-light">{s.render3d ? "Yes (+$150)" : "No"}</td>
                <td className="p-4 text-right text-foreground font-medium">${s.price + (s.render3d ? 150 : 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 border-t border-border flex justify-between">
          <span className="text-success text-sm font-medium">Discount ({project.discount}%)</span>
          <span className="font-medium text-foreground text-lg">Total: ${project.total}</span>
        </div>
      </div>
    </div>
  );
}
