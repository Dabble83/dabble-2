/**
 * TODO(Master Plan §5.6): Replace with rotating neighbor quotes + light attributions
 * (first name + neighborhood). See docs/MASTER_PLAN.md §5.6.
 */
export function TestimonialRow() {
  return (
    <section
      className="border-t border-[var(--rule)] bg-[var(--surface)] py-14"
      aria-label="Testimonials"
    >
      <div className="ui-container">
        <p className="ui-label">Neighbors say</p>
        <div className="mt-4 rounded-xl border border-dashed border-[var(--rule)] bg-[color-mix(in_srgb,var(--cream)_55%,var(--surface))] px-6 py-10 text-center font-sans text-[var(--text-secondary)] [font-size:var(--fs-small)]">
          Testimonial carousel placeholder — wire real quotes per Master Plan §5.6.
        </div>
      </div>
    </section>
  );
}
