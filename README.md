# Manal Alyami — Portfolio

Personal portfolio website for Manal Alyami, AI Engineer & Data Scientist.  
Live at: [manalalyami7.github.io/portfolio](https://manalalyami7.github.io/portfolio)

---

## Features

- **Dark editorial theme** — deep navy background (`#080e1a`) with emerald accent (`#10d9a0`)
- **Project filter system** — filter by All / Web Development / Mobile Apps / AI & Machine Learning / Data Science
- **Show More / Show Less** — collapses project grid to 6 cards by default, expands on demand
- **Scroll reveal animations** — sections and cards fade in on scroll via IntersectionObserver
- **Responsive** — 3-col desktop → 2-col tablet → 1-col mobile with hamburger nav
- **Accessible** — `focus-visible` styles, `aria` labels, `lang` attribute, semantic HTML
- **Favicon** — inline SVG MA monogram, no external file needed
- **CV download** — direct download button in hero linking to AI Engineer CV

---

## Tech Stack

- **HTML5 / CSS3 / Vanilla JS** — no frameworks
- **Fonts** — [Syne](https://fonts.google.com/specimen/Syne) (headings) + [DM Sans](https://fonts.google.com/specimen/DM+Sans) (body) via Google Fonts
- **Icons** — Font Awesome 6
- **Deployment** — GitHub Pages

---

## File Structure

```
portfolio/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # All styles — variables, layout, components, responsive
├── js/
│   └── main.js             # Nav toggle, project filter, show-more, scroll reveal, read-more
└── assets/
    └── Manal Salem Alyami (AI Engineer).pdf   # CV download
```

---

## Sections

| Section | ID |
|---|---|
| Hero | `#home` |
| Projects | `#projects` |
| Experience | `#experience` |
| Education | `#education` |
| Certifications | `#certifications` |
| Recommendations | `#social-proof` |
| Contact | `#contact` |

---

## Project Filter Categories

Each project card uses a `data-category` attribute with space-separated tokens:

| Token | Label |
|---|---|
| `all` | All Projects |
| `web` | Web Development |
| `mobile` | Mobile Apps |
| `ai` | AI & Machine Learning |
| `data` | Data Science |

To add a new project, copy any `.project-card` block in `index.html` and set `data-category` to the appropriate token(s).

---

## Color Variables

Defined in `:root` inside `css/styles.css`:

```css
--primary: #10d9a0;          /* Emerald accent */
--bg: #080e1a;               /* Page background */
--bg-card: #0d1526;          /* Card background */
--bg-section-alt: #0a1220;   /* Alternate section background */
--text: #b8cceb;             /* Body text */
--text-heading: #e4eefb;     /* Heading text */
--text-muted: #607a9e;       /* Muted/secondary text */
```

---

## Running Locally

```bash
git clone https://github.com/ManalAlyami7/portfolio.git
cd portfolio
python -m http.server 8000
```

Then open `http://localhost:8000`.

---

## Deployment

Deployed via GitHub Pages:

1. Go to repository **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: **main**, folder: **/ (root)**
4. Site will be live at `https://manalalyami7.github.io/portfolio`

---

## Contact

**Manal Alyami**  
Email: Manalalyami7@gmail.com  
LinkedIn: [linkedin.com/in/manal-alyami](https://linkedin.com/in/manal-alyami)  
GitHub: [github.com/ManalAlyami7](https://github.com/ManalAlyami7)
