export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-heading font-bold text-foreground">Measured</span>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Measured. Professional cabinetry design, delivered online.
        </p>
      </div>
    </footer>
  );
}
