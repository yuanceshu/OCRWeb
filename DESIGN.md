# OCR Archive Atlas - DESIGN.md

> A paper archive interface laid over a deep blue dossier cloth: warm parchment cards, serif catalogue titles, stamped document specimens, tabbed dividers, and compact OCR metadata laid out like an index desk.

**Theme:** light, archival, document-first  
**Refero basis:** Slite "Warm parchment editorial desk" as the closest base, with Granola "Field notes on warm parchment" for hairline note-card structure and Calendly "Sky Blueprint on Bright Paper" for the disciplined deep-blue accent system.

## North Star

This product should feel like an official OCR archive cabinet opened on a work desk. The interface is not a generic SaaS dashboard. It is a catalogue, dossier, and index system: precise enough for API documentation, warm enough to feel handled by humans, and tactile enough that every card reads like a real record.

The primary mood is "catalogued paper on blue archive board." Use warm off-white surfaces, navy cloth-like framing, printed borders, small labels, metadata chips, stamps, tabs, clips, and document thumbnails. Keep the experience functional and scannable; the archival styling should organize information, not bury it.

## Design Tokens

### Colors

| Name | Value | Token | Role |
| --- | --- | --- | --- |
| Archive Navy | `#193d6a` | `--color-archive-navy` | Primary frame, active tabs, CTA buttons, strong document labels |
| Blueprint Blue | `#275889` | `--color-blueprint-blue` | Secondary panels, side rails, icons, hovered controls |
| Faded Denim | `#6f89a8` | `--color-faded-denim` | Muted blue borders, secondary icon strokes, inactive dividers |
| Parchment | `#f6efe4` | `--color-parchment` | Page/card ground, hero paper, document surfaces |
| Vellum | `#fbf7ef` | `--color-vellum` | Raised card surfaces and input fields |
| Aged Edge | `#d9cbb7` | `--color-aged-edge` | Paper borders, torn-edge shadows, separators |
| Ink | `#1f2b3d` | `--color-ink` | Primary text and serif headings |
| Typewriter Gray | `#625b52` | `--color-typewriter-gray` | Secondary text, descriptions, metadata |
| Stamp Blue | `#244b82` | `--color-stamp-blue` | Circular stamp graphics, selected states, seal marks |
| Tag Amber | `#b36b21` | `--color-tag-amber` | Ticket/invoice category badges |
| Evidence Green | `#3f6f5a` | `--color-evidence-green` | License/business category badges |
| Tape Beige | `#e7dac4` | `--color-tape-beige` | Tape strips, inactive tabs, clipped label backgrounds |
| Warning Red | `#9b3f35` | `--color-warning-red` | Rare error states, destructive alerts, red stamp accents |

### Typography

Use a print-like pairing:

| Use | Font Direction | Size/Weight | Notes |
| --- | --- | --- | --- |
| Display catalogue title | Serif, Songti/Noto Serif SC/Georgia fallback | 48-72px, 700 | Large OCR/catalogue headings; tight but readable |
| Section heading | Serif | 24-32px, 700 | Index titles, archive summary headings |
| Card title | Serif or sturdy sans | 18-22px, 700 | Document/API names |
| Body and UI | Humanist sans, Noto Sans SC/Inter fallback | 14-16px, 400-600 | Documentation text, labels, navigation |
| Metadata/code | Monospace, JetBrains Mono/Consolas fallback | 12-13px, 500 | IDs like `ID-001`, endpoint names, field keys |

Letter spacing should stay normal. Do not use viewport-scaled type. Large Chinese headings need generous line height around `1.15`; dense card text should sit around `1.45`.

### Spacing

Base unit: `8px`.

| Token | Value | Role |
| --- | --- | --- |
| `--space-xs` | `4px` | Chip gaps, icon gaps |
| `--space-sm` | `8px` | Compact card internals |
| `--space-md` | `16px` | Standard component padding |
| `--space-lg` | `24px` | Card gutters and panel padding |
| `--space-xl` | `32px` | Section separation |
| `--space-2xl` | `48px` | Hero and major canvas rhythm |

Prefer dense but breathable layouts. The screenshot's feeling comes from many small pieces arranged with a consistent archive-grid rhythm, not from giant empty marketing sections.

### Shape

| Element | Radius | Notes |
| --- | --- | --- |
| Paper cards | `6px` | Slight rounding only; corners may look worn |
| Buttons | `4px` | Rectangular, official, stamped |
| Inputs | `6px` | Soft enough for paper, never pill-shaped |
| Badges/chips | `4px` | Label-like, not modern capsules |
| Stamps/seals | `999px` | Circular only when imitating archive stamps |

Avoid large generic SaaS card radii. Cards should feel like paper slips, not floating glass panels.

### Borders And Shadows

Use borders before shadows.

```css
:root {
  --border-paper: 1px solid rgba(82, 69, 51, 0.20);
  --border-blueprint: 1px solid rgba(25, 61, 106, 0.28);
  --shadow-paper: 0 2px 0 rgba(82, 69, 51, 0.08), 0 8px 22px rgba(30, 35, 42, 0.12);
  --shadow-clipped: 0 4px 10px rgba(31, 43, 61, 0.16);
  --shadow-inset-paper: inset 0 0 0 1px rgba(255, 255, 255, 0.55);
}
```

Shadows should be short and dusty. Never use glossy, deep, modern product-card shadows.

## Layout System

### Page Frame

Use a full-viewport archive board:

- Outer background: deep blue cloth/blueprint field.
- Inner work surface: parchment panels arranged in a controlled grid.
- Header: fixed-height paper nav strip with a subtle bottom border.
- Main content: hero catalogue band, specimen strip, index directory, summary panel, reference footer.
- Optional right rail: vertical tabs for "接口图鉴", "字段结构", "示例档案".

The first viewport should immediately show the product identity and working interface. Do not make a marketing hero that hides the catalogue.

### Grid

Use a 12-column desktop grid with `24px` gutters.

- Left filter/index rail: 2-3 columns.
- Main record grid: 6-7 columns.
- Right archive summary: 2-3 columns.
- On mobile, collapse to one column with the summary after the search/filters.

Cards should align like index cards on a desk. Slight rotations are allowed only for decorative specimen cards in the top visual band, never for dense data cards that users must scan repeatedly.

### Information Density

This is an operational documentation tool. Keep density high:

- Show IDs, categories, fields, scenario tags, and descriptions directly on cards.
- Use compact chips for field names.
- Keep actions short, icon-assisted, and consistently placed.
- Avoid oversized empty cards, large promotional copy, and decorative filler.

## Components

### Archive Header

Paper strip with logo left, compact nav center, support/action button right.

- Active nav uses Archive Navy text plus a short underline.
- Header background should be Vellum with faint paper noise.
- Logo may combine a circular OCR magnifier mark with a serif Chinese product title.

### Catalogue Hero

Large torn-paper or framed parchment panel.

- Title: oversized serif, e.g. `OCR 识别接口图鉴`.
- Subtitle: concise, documentation-oriented.
- Search input: wide, rectangular, with search icon and muted placeholder.
- Add subtle seal/compass/watermark graphics at low opacity.

### Specimen Cards

Top-row document examples: ID card, license, receipt, plain text.

- Card surface: Vellum or Parchment.
- Use paper border, tape/clip detail, small category label, document ID, and circular "已收录" stamp.
- Document thumbnails should look like scanned artifacts, not polished marketing screenshots.
- Category badges may use Evidence Green, Tag Amber, Stamp Blue, or muted purple-blue, but only as small labels.

### Index Directory

Left panel for filters and counts.

- Use section rows with small icons and chevrons.
- Counts align right in monospace or tabular numerals.
- Panel border should resemble a printed ledger box.
- Collapsible sections should feel like opening index drawers, with simple height transitions.

### Record Cards

Core API/documentation cards.

- Title at top left, ID tag top right.
- Thumbnail left, description right or below depending on width.
- Field chips in one compact row.
- Archive tag line at bottom.
- Primary action button bottom right in Archive Navy.
- Maintain identical card heights per row on desktop.

### Archive Summary

Right-side summary panel.

- Use stacked statistic rows with icons in square or circular paper frames.
- Big numerals should be serif or tabular, dark navy.
- Include recommendation/update sections as compact record snippets.

### Reference Footer

Paper tag/cards along the bottom.

- Use icon panels for "字段命名规范", "初次接入建议", "常见错误说明".
- Cards should be horizontal, like reference file tabs.
- Keep copy short and action-oriented.

### Side Tabs

Vertical tabs can sit on the right blue board edge.

- Active tab: Archive Navy with white text.
- Inactive tabs: Tape Beige with Ink text.
- Tabs should feel physically attached to the archive board.

## Imagery And Texture

Use texture sparingly but deliberately:

- Subtle paper grain on Parchment/Vellum surfaces.
- Fine blue cloth or blueprint texture on the outer board.
- Low-opacity compass/seal/watermark line art.
- Tape strips, binder clips, string tags, rings, and stamped circles as small structural accents.

Do not use generic stock photos, blobs, glossy gradients, glassmorphism, or decorative orbs. Visual assets must reinforce the archive/document metaphor.

## Interaction States

- Hover on record cards: lift by `2px`, deepen paper shadow, darken border to Blueprint Blue.
- Active filters: navy text, pale blue background, left border marker.
- Buttons: Archive Navy fill, Vellum text; hover slightly brighter.
- Inputs: focus border Stamp Blue, subtle inset paper shadow.
- Disabled state: faded ink, desaturated surface, no motion.

Motion should be quiet and physical: cards slide, tabs tuck, stamps fade in. Avoid bouncy consumer-app animation.

## Accessibility

- Preserve strong contrast between Ink and Parchment.
- Do not put small Typewriter Gray text over textured blue backgrounds.
- All icon-only buttons need accessible labels and tooltips.
- Keep focus rings visible in Stamp Blue or Archive Navy.
- Ensure text never overlaps decorative stamps, clips, or seals.

## Do

- Use warm paper surfaces and deep blue structure as the signature pairing.
- Keep the first screen useful: search, specimen cards, filters, record cards, and summary should be visible.
- Use serif typography for catalogue identity and sans/mono for practical UI.
- Treat badges, IDs, stamps, and tabs as information architecture.
- Make repeated documentation cards stable in size and easy to scan.
- Use realistic document thumbnails and archival marks to make OCR subject matter tangible.

## Don't

- Do not turn this into a clean white SaaS dashboard.
- Do not use glossy gradients, oversized hero slogans, or generic marketing sections.
- Do not make all UI elements rounded pills.
- Do not let texture reduce readability.
- Do not scatter decorative clips/stamps where users need to read dense text.
- Do not use pure black text or pure white paper surfaces unless a real document thumbnail requires it.

## CSS Starter

```css
:root {
  color-scheme: light;

  --color-archive-navy: #193d6a;
  --color-blueprint-blue: #275889;
  --color-faded-denim: #6f89a8;
  --color-parchment: #f6efe4;
  --color-vellum: #fbf7ef;
  --color-aged-edge: #d9cbb7;
  --color-ink: #1f2b3d;
  --color-typewriter-gray: #625b52;
  --color-stamp-blue: #244b82;
  --color-tag-amber: #b36b21;
  --color-evidence-green: #3f6f5a;
  --color-tape-beige: #e7dac4;
  --color-warning-red: #9b3f35;

  --font-display: "Noto Serif SC", "Songti SC", Georgia, serif;
  --font-ui: "Noto Sans SC", Inter, "Microsoft YaHei", sans-serif;
  --font-mono: "JetBrains Mono", Consolas, monospace;

  --radius-paper: 6px;
  --radius-control: 4px;

  --border-paper: 1px solid rgba(82, 69, 51, 0.20);
  --border-blueprint: 1px solid rgba(25, 61, 106, 0.28);
  --shadow-paper: 0 2px 0 rgba(82, 69, 51, 0.08), 0 8px 22px rgba(30, 35, 42, 0.12);
  --shadow-clipped: 0 4px 10px rgba(31, 43, 61, 0.16);
}
```

## Refero Source Notes

- Slite: warm parchment editorial desk; cream ground, ink text, soft document-workspace mood.
- Granola: field notes on warm parchment; serif headlines and hairline-ruled note-card borders.
- Calendly: sky blueprint on bright paper; deep blue hierarchy and clear information structure.

Use this file as the source of truth when implementing the OCR interface catalogue. If a Refero style and the screenshot conflict, prefer the screenshot for metaphor and layout, and prefer Refero for token discipline and component consistency.
