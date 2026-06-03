# Derek On Capital — Website

Personal site for Derek Goldstein. Lives at **derekoncapital.com**. Built as a single-page Linktree replacement, brand presence, and pipeline driver into Calendly.

This is a static site — plain HTML/CSS/JS, no build step, no framework. Same deploy pattern as `seakingcapital.com` and `seaking-solutions.com`: drop the files into IONOS via the file manager.

---

## File structure

```
derekoncapital-website/
├── index.html      ← the page
├── styles.css      ← all styles (mobile-first, brand palette)
├── script.js       ← tiny script (just sets the footer year)
├── logo.png        ← circular DC logo (hero)
├── favicon.png     ← square dark navy DC app icon
├── banner.png      ← horizontal banner (currently unused — kept for future OG image / Substack header use)
└── README.md
```

There is **no build step**. The files in this folder *are* the deployable site.

---

## Run locally

Any static-file server works. Pick one:

**Python (built into most systems):**
```bash
cd derekoncapital-website
python -m http.server 8080
```
Open http://localhost:8080

**Node.js:**
```bash
npx serve .
```

**VS Code:** install the "Live Server" extension, right-click `index.html` → *Open with Live Server*.

You don't need npm install or any dependencies — the site references Google Fonts via CDN and that's it.

---

## Deploy to IONOS

1. Log into IONOS, open the **derekoncapital.com** hosting package.
2. Open the **File Manager** (or use SFTP — your call).
3. Navigate to the web root (usually a folder like `/` or `/htdocs` — same place where the Sea King sites live).
4. **Upload the entire contents of this folder** — `index.html`, `styles.css`, `script.js`, `logo.png`, `favicon.png`, `banner.png`. Do *not* upload the folder itself; upload the files inside it. Don't upload `README.md` (no harm if you do, just unnecessary).
5. Visit https://derekoncapital.com/ to confirm it's live. Hard-refresh (Ctrl+Shift+R) if the old cached version shows.

That's it. No SSR, no CI/CD, no Node runtime needed on the server.

---

## Brand reference

- **Tagline:** Fund growth. Keep your company.
- **Subline:** Field notes from the underwriter's seat.
- **Calendly:** https://calendly.com/derek-seakingcapital/intro-call

**Color palette** (defined as CSS variables in `styles.css`):

| Role | Hex | Used for |
|------|-----|----------|
| Navy | `#1a2332` | Primary text, dark sections, icons |
| Bronze | `#a08456` | CTAs, accent rules, hover states |
| Cream | `#f5efe4` | Page background |
| Cream (soft) | `#faf6ee` | Alternating section background |

**Type:**
- Headlines: Playfair Display (serif, matches the logo)
- Body: Inter (clean sans-serif)

Both loaded from Google Fonts.

---

## Editing common things

**Change a social link:** edit `index.html` — search for the `<!-- ─────────── FOLLOW / LINKTREE ─────────── -->` block. Each card is one `<li>`. Change the `href` on the anchor; the `aria-label`; the visible `link-handle` text.

**Add a new social channel:** copy one of the existing `<li>` blocks in `.link-stack`, swap the SVG icon, name, handle, and href. The order matters — top of the list = highest editorial priority.

**Update the about copy:** edit the two `<p class="about-copy">` paragraphs in the `<!-- ─────────── ABOUT ─────────── -->` section.

**Hook up analytics:** there's a placeholder comment in `index.html`'s `<head>`:
```html
<!-- ANALYTICS PLACEHOLDER — drop GA / Plausible snippet here when ready -->
```
Replace it with the GA4 or Plausible snippet when you're ready. No other changes needed.

**Change the favicon or logo:** replace `logo.png` and/or `favicon.png` in this folder with files of the same name. The HTML already references them by filename.

**Change the Calendly URL:** search `index.html` for `calendly.com/derek-seakingcapital/intro-call` — appears in two places (hero CTA and the mid-page CTA section). Update both.

---

## Notes / decisions made along the way

A few judgment calls during the build — flagged here so you can override if you want:

1. **Calendly is a button-out, not embedded.** The spec called for this explicitly. Keeps the page small and avoids the Calendly script bundle on every page load.
2. **`banner.png` is included in the folder but not referenced** in the HTML. Kept it around because it's a beautiful asset and is probably the right thing to use as a Substack banner or future Open Graph image. Right now `og:image` points to `logo.png` (the circular logo) since most preview cards crop centered — squares preview cleaner than horizontal banners on most platforms. Easy to swap if you'd rather use the banner.
3. **No nav bar.** The page is short enough on mobile that a sticky nav adds noise without adding value. Hero → about → links → CTA → businesses → footer scrolls cleanly in one pass.
4. **Footer disclaimer is intentionally short** — one line. The spec asked for "understated."
5. **Bronze (`#a08456`) is used only for accents, CTAs, and the bronze-on-navy CTA section.** Body text stays navy on cream — bronze on cream doesn't have enough contrast for body copy (per the spec).
6. **Fonts via Google Fonts CDN.** Zero local font files to manage. If you ever need to go fully self-hosted (no third-party calls), download the WOFF2s and switch the `@font-face` declarations — but for a personal site this CDN dependency is fine.
7. **Order of social channels:** Substack and LinkedIn first (per the spec — that's where the substantive content lives), then YouTube → X → Instagram → TikTok. Reorder in `index.html` if you want a different priority.

---

## Browser support

Modern browsers (Chrome, Safari, Firefox, Edge — last 2 versions). No IE support needed. Mobile Safari and Chrome on Android are the priority since that's where most traffic will come from (social bios → phone).
