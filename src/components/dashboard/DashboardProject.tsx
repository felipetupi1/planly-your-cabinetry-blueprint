export function DashboardProject() {
  // Placeholder data — will come from backend
  const project = {
    spaces: [
      { name: "Kitchen", size: "Medium (80–160 sq/ft)", price: 550, render3d: true },
      { name: "Pantry", size: "Small (under 80 sq/ft)", price: 200, render3d: false },
    ],
    discount: 10,
    total: 810,
  };

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-foreground">My Project</h2>
      <p className="mt-2 text-muted-foreground">Summary of what was purchased.</p>

      <div className="mt-6 border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary">
              <th className="text-left p-4 font-medium text-foreground">Space</th>
              <th className="text-left p-4 font-medium text-foreground">Size</th>
              <th className="text-left p-4 font-medium text-foreground">3D Render</th>
              <th className="text-right p-4 font-medium text-foreground">Price</th>
            </tr>
          </thead>
          <tbody>
            {project.spaces.map((s, i) => (
              <tr key={i} className="border-t border-border">
                <td className="p-4 text-foreground">{s.name}</td>
                <td className="p-4 text-muted-foreground">{s.size}</td>
                <td className="p-4 text-muted-foreground">{s.render3d ? "Yes (+$150)" : "No"}</td>
                <td className="p-4 text-right text-foreground font-medium">
                  ${s.price + (s.render3d ? 150 : 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 border-t border-border flex justify-between">
          <span className="text-success text-sm font-medium">Discount ({project.discount}%)</span>
          <span className="font-bold text-foreground text-lg">Total: ${project.total}</span>
        </div>
      </div>
    </div>
  );
}
