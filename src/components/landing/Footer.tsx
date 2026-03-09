export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm font-medium text-foreground tracking-[4px] uppercase">MEASURED</span>
        <p className="text-sm text-muted-foreground font-light">
          © {new Date().getFullYear()} Measured. Professional cabinetry design, delivered online.
        </p>
      </div>
    </footer>
  );
}
