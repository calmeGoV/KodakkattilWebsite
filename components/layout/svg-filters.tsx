/**
 * Duotone separation for archival imagery: shadows to primary-deep, highlights
 * to brass. A two-colour print, not a sepia costume filter. See DESIGN.md §4.
 *
 * Rendered once, hidden, at the root.
 */
export function SvgFilters() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      className="absolute"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
        <filter id="duotone-brass" colorInterpolationFilters="sRGB">
          {/* Flatten to luminance first so the separation is clean. */}
          <feColorMatrix
            type="matrix"
            values="0.2126 0.7152 0.0722 0 0
                    0.2126 0.7152 0.0722 0 0
                    0.2126 0.7152 0.0722 0 0
                    0      0      0      1 0"
          />
          {/* Map black → #10261D (primary-deep), white → #D8BC85 (brass glow). */}
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0.063 0.847" />
            <feFuncG type="table" tableValues="0.149 0.737" />
            <feFuncB type="table" tableValues="0.114 0.522" />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  );
}
