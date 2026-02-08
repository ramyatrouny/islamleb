/** Shared decorative gradient orbs used as page backgrounds */
export function DecorativeBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -top-1/4 -right-1/4 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-1/4 -left-1/4 h-[500px] w-[500px] rounded-full bg-[#2d6a4f]/5 blur-3xl" />
    </div>
  );
}
