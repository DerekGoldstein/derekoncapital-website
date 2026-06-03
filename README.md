# Derek On Capital — Website

Personal site for Derek Goldstein. Lives at **derekoncapital.com**. Built as a single-page Linktree replacement, brand presence, and pipeline driver into Calendly.

This is a static site — plain HTML/CSS/JS, no build step, no framework. Same deploy pattern as `seakingcapital.com` and `seaking-solutions.com`: drop the files into IONOS via the file manager.

---

## File structure

```
derekoncapital-website/
├── index.html      ← home page
├── blog/
│   └── index.html  ← /blog/ hub — cards linking out to Substack articles
├── styles.css      ← all styles (mobile-first, brand palette)
├── script.js       ← tiny script (just sets the footer year)
├── .htaccess       ← forces HTTPS + security headers + caching (Apache / IONOS)
├── robots.txt      ← lets crawlers in, points them at the sitemap
├── sitemap.xml     ← list of on-domain URLs for Google
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
4. **Upload the entire contents of this folder** — `index.html`, `styles.css`, `script.js`, `logo.png`, `favicon.png`, `banner.png`, `robots.txt`, `sitemap.xml`, and the hidden `.htaccess`. Do *not* upload the folder itself; upload the files inside it. Don't upload `README.md` or the `.claude/` folder (no harm, just unnecessary).
5. **Recreate the `blog/` folder** in the web root and upload `blog/index.html` into it. (File Manager: create a new folder named `blog`, open it, upload the file.)
6. Visit https://derekoncapital.com/ and https://derekoncapital.com/blog/ to confirm both are live. Hard-refresh (Ctrl+Shift+R) if an old cached version shows.

That's it. No SSR, no CI/CD, no Node runtime needed on the server.

> **Heads up — `.htaccess` is a hidden file.** The IONOS File Manager hides dotfiles by default. Turn on **Settings → Show hidden files** (or the eye/“show hidden” toggle) before uploading, or it'll look like the upload silently skipped it. If you use SFTP, make sure your client shows hidden files too. Without `.htaccess`, HTTP won't redirect to HTTPS.

---

## HTTPS / SSL — Cloudflare in front of IONOS

This site uses **Cloudflare in front of IONOS** for HTTPS. Cloudflare terminates TLS at its edge (free Universal SSL — automatically issued, Let's Encrypt-backed, auto-renewed) and proxies plain HTTP back to the IONOS origin. The IONOS-bundled free SSL cert is **not** used here — that one slot was already assigned to another domain on the same hosting plan.

### Setup (one-time)

1. **Add `derekoncapital.com` to Cloudflare** (free plan). It auto-imports the existing DNS records from IONOS.
2. **Change the nameservers at IONOS** (Domains & SSL → derekoncapital.com → Nameservers) to the two Cloudflare gave you. Wait for Cloudflare's status to flip to **Active** (usually within an hour, occasionally up to a day).
3. **Cloudflare → SSL/TLS → Overview → Encryption mode = Flexible.** The IONOS origin has no cert, so Flexible is the only mode that works here.
4. **Cloudflare → SSL/TLS → Edge Certificates → Always Use HTTPS = ON.** This is what redirects `http://` → `https://`. The `.htaccess` intentionally does *not* do that redirect — origin-side redirects loop forever behind Cloudflare-Flexible (because Cloudflare forwards plain HTTP to origin even when the visitor is on HTTPS).
5. The `.htaccess` keeps a `www → apex` redirect as defense-in-depth. Optional polish: add a Cloudflare **Redirect Rule** (`http.host eq "www.derekoncapital.com" → https://derekoncapital.com/$1`) so the www→apex happens at the edge instead of round-tripping to IONOS.

### About end-to-end encryption

The Cloudflare ↔ IONOS hop is plain HTTP. For a static personal site with no logins, forms, or PII, that's acceptable — every visitor and crawler sees HTTPS end-to-end. If we ever need full encryption to the origin, the move is to migrate hosting to **Cloudflare Pages / Netlify / Vercel** (built-in TLS, push-to-deploy from this GitHub repo), since IONOS Web Hosting has no shell and no custom-cert upload on this tier.

### Verify

- `http://derekoncapital.com` → 301 → `https://derekoncapital.com`. Padlock valid; issuer is one of Cloudflare's auto-rotating edge certs (e.g. "Google Trust Services" or "Let's Encrypt", depending on which Cloudflare currently has provisioned).
- `http://www.derekoncapital.com` → 301 → `https://derekoncapital.com`.
- `https://derekoncapital.com/blog/` loads with padlock, no mixed-content warnings.
- Optional A-rating check: https://www.ssllabs.com/ssltest/.

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

**Update the page copy:** the live home page is short by design. The main strings are: the big headline in `<h2 class="cta-title">` (top section), the "Follow along" blurb in `<p class="section-desc">` inside `<!-- FOLLOW / LINKTREE -->`, and the businesses blurb in the `<p class="section-desc">` inside `<!-- BUSINESSES -->`. Edit those directly in `index.html`.

**Hook up analytics:** there's a placeholder comment in `index.html`'s `<head>`:
```html
<!-- ANALYTICS PLACEHOLDER — drop GA / Plausible snippet here when ready -->
```
Replace it with the GA4 or Plausible snippet when you're ready. No other changes needed.

**Change the favicon or logo:** replace `logo.png` and/or `favicon.png` in this folder with files of the same name. The HTML already references them by filename.

**Change the Calendly URL:** search `index.html` for `calendly.com/derek-seakingcapital/intro-call` — appears once, on the "Book a free intro call" button in the top CTA section.

**Edit the header nav:** the nav lives in `<header class="site-header">` near the top of both `index.html` and `blog/index.html`. The two links are **Home** (`/`) and **Field Notes** (`/blog/`). Whichever link matches the current page gets `aria-current="page"` (which styles it bronze).

---

## The blog — adding a post

The blog lives at **`/blog/`** (`blog/index.html`). It's a hub that lists your Substack articles as cards; clicking a card opens the full article **on Substack** (opens in a new tab). This was the chosen approach: near-zero upkeep, and it's what unlocks Google Publisher Center via your Substack RSS feed. (Trade-off: Google gives the *article's* ranking credit to Substack, not derekoncapital.com. See the SEO section for the upgrade path if you ever want that credit on your own domain.)

**To add a new article**, edit `blog/index.html` and do three small things:

1. **Add the card.** Copy one `<li>` block inside `.post-list`, paste it at the **top** (newest first), and update four things:
   - the `href` → the Substack post URL
   - the `<time>` → both `datetime="YYYY-MM-DD"` and the visible date (e.g. `June 3, 2026`)
   - the `<h2 class="post-title">` → the article title
   - the `<p class="post-excerpt">` → one-line summary (the Substack subtitle works great)
   - (also update the `aria-label` on the link so screen readers announce the right title)
2. **Add it to the structured data.** In the `<head>`, find the `"blogPost"` array in the JSON-LD block and add a matching `BlogPosting` entry (headline, url, datePublished, description). This is what tells Google it's an article.
3. **Bump the sitemap.** In `sitemap.xml`, update the `<lastmod>` on the `/blog/` URL to today's date so Google re-crawls sooner.

That's it — re-upload `blog/index.html` and `sitemap.xml`. No build step.

> The two posts currently listed were pulled from your live feed (`derekoncapital.substack.com/feed`). They'll need to be added by hand as you publish — there's intentionally no JavaScript fetching the feed at runtime (keeps the page fast, crawlable, and dependency-free).

---

## SEO & Google Publisher Center

What's now wired up for search:

- **`robots.txt`** — lets all crawlers in, points to the sitemap.
- **`sitemap.xml`** — lists the on-domain pages (`/` and `/blog/`). Substack posts aren't in here; Google gets those from the RSS feed instead.
- **Canonical tags** on both pages (prevents duplicate-URL confusion).
- **JSON-LD structured data** — a `Person` + `WebSite` graph on the home page (feeds Google's knowledge panel and ties together all your social profiles via `sameAs`), and a `Blog` + `BlogPosting` list on `/blog/`.
- **Open Graph + Twitter cards** with absolute image URLs (so link previews render on LinkedIn/X/iMessage).
- **RSS discovery** `<link>` in both `<head>`s pointing at the Substack feed.

### Turn it on in Google (do these once)

1. **Google Search Console** — add **derekoncapital.com** as a *Domain* property and verify (IONOS lets you add the TXT record they give you in the DNS panel). Then **Sitemaps → submit** `https://derekoncapital.com/sitemap.xml`. This is the single highest-leverage SEO step — it's how Google discovers and indexes the site.
2. **Google Publisher Center** (https://publishercenter.google.com) — create a publication "Derek On Capital", add **derekoncapital.com** as the website, verify ownership (it reuses Search Console verification), then add your **Substack RSS feed** as a content source:
   ```
   https://derekoncapital.substack.com/feed
   ```
   That feed is already valid and auto-updates every time you publish — nothing to maintain.
3. Sanity-check the structured data with the **Rich Results Test** (https://search.google.com/test/rich-results) — paste `https://derekoncapital.com/` and `https://derekoncapital.com/blog/`.

### If you later want the SEO credit on *your* domain

Linking out to Substack sends ranking signals to Substack. To capture them on derekoncapital.com, the upgrade path is to **republish each post as a real page** under `/blog/<slug>/` with the full text, and set the **canonical on Substack** to point at your domain (Substack: Post → Settings → Canonical URL). More upkeep, but then the articles rank for *you*. The current structure (folder-per-page under `/blog/`) is already set up to grow that way.

---

## Notes / decisions made along the way

A few judgment calls during the build — flagged here so you can override if you want:

1. **Calendly is a button-out, not embedded.** The spec called for this explicitly. Keeps the page small and avoids the Calendly script bundle on every page load.
2. **`banner.png` is included in the folder but not referenced** in the HTML. Kept it around because it's a beautiful asset and is probably the right thing to use as a Substack banner or future Open Graph image. Right now `og:image` points to `logo.png` (the circular logo) since most preview cards crop centered — squares preview cleaner than horizontal banners on most platforms. Easy to swap if you'd rather use the banner.
3. **Sticky cream header nav** with two links — *Home* and *Field Notes* (→ `/blog/`). It sits translucent over the navy CTA section at the top of the home page (backdrop-filter blur). Page flow on the home page: nav → CTA-hero (logo + "Book a free intro call") → Follow along → Businesses → footer.
4. **Footer disclaimer is intentionally short** — one line. The spec asked for "understated."
5. **Bronze (`#a08456`) is used only for accents, CTAs, and the bronze-on-navy CTA section.** Body text stays navy on cream — bronze on cream doesn't have enough contrast for body copy (per the spec).
6. **Fonts via Google Fonts CDN.** Zero local font files to manage. If you ever need to go fully self-hosted (no third-party calls), download the WOFF2s and switch the `@font-face` declarations — but for a personal site this CDN dependency is fine.
7. **Order of social channels:** Substack and LinkedIn first (per the spec — that's where the substantive content lives), then YouTube → X → Instagram → TikTok. Reorder in `index.html` if you want a different priority.

---

## Browser support

Modern browsers (Chrome, Safari, Firefox, Edge — last 2 versions). No IE support needed. Mobile Safari and Chrome on Android are the priority since that's where most traffic will come from (social bios → phone).
