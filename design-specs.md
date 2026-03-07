# Amazon.in UI Style Guide
> Complete design system reference extracted from Amazon.in marketplace

---

## 1. Color Palette

### Primary Colors
| Token | Hex | Usage |
|---|---|---|
| Brand Orange | `#FF9900` | CTA buttons, highlights, icons, cart badge |
| Dark Orange (Hover) | `#E47911` | Button hover states |
| Header Navy | `#131921` | Top navigation bar background |
| Secondary Nav | `#232F3E` | Sub-navigation bar background |
| Link Blue | `#007185` | Anchor links, "Explore all", "See all offers" |
| Link Blue Hover | `#C7511F` | Hovered anchor links |

### Neutral Colors
| Token | Hex | Usage |
|---|---|---|
| Page Background | `#EAEDED` | Main page background |
| White | `#FFFFFF` | Cards, panels, form inputs |
| Light Gray | `#F3F3F3` | Section backgrounds, input fields |
| Border Gray | `#DDDDDD` | Card borders, dividers |
| Text Primary | `#0F1111` | Main body text, product titles |
| Text Secondary | `#565959` | Secondary labels, metadata |
| Text Muted | `#888C8C` | Placeholder text, disabled states |

### Feedback Colors
| Token | Hex | Usage |
|---|---|---|
| Error Red | `#CC0000` | Error messages, validation text |
| Success Green | `#007600` | "In Stock", success messages |
| Rating Star | `#FF9900` | Star ratings |
| Prime Blue | `#00A8E0` | Prime badge, Prime label |
| Discount Badge | `#CC0C39` | Sale/discount percentage badges |

---

## 2. Typography

### Font Family
```css
font-family: "Amazon Ember", "Helvetica Neue", Helvetica, Arial, sans-serif;
```

### Font Scale
| Element | Size | Weight | Line Height |
|---|---|---|---|
| Page Title (H1) | `28px` | `700` | `36px` |
| Section Title (H2) | `21px` | `700` | `29px` |
| Card Title (H3) | `18px` | `700` | `24px` |
| Product Title | `14px` | `400` | `20px` |
| Body Text | `14px` | `400` | `20px` |
| Small / Label | `12px` | `400` | `16px` |
| Micro / Fine Print | `11px` | `400` | `15px` |
| Navigation Item | `13px` | `700` | `19px` |
| Button Text | `13px` | `700` | `29px` |
| Price Large | `28px` | `400` | `36px` |
| Price Small | `18px` | `400` | `24px` |
| Strikethrough MRP | `14px` | `400` | `20px` |

---

## 3. Spacing System

Amazon uses an **8px base grid** with some 4px micro-spacing.

| Token | Value | Usage |
|---|---|---|
| `space-1` | `4px` | Micro gaps, icon padding |
| `space-2` | `8px` | Tight spacing, inline gaps |
| `space-3` | `12px` | Small component padding |
| `space-4` | `16px` | Standard padding |
| `space-5` | `20px` | Card internal padding |
| `space-6` | `24px` | Section gaps |
| `space-8` | `32px` | Large section padding |
| `space-10` | `40px` | Hero section padding |

### Common Padding Values
```css
/* Navigation bar */
padding: 8px 18px;

/* Cards / product tiles */
padding: 12px;

/* Buttons (primary CTA) */
padding: 9px 10px;

/* Search bar input */
padding: 4px 8px;

/* Section containers */
padding: 16px 20px;

/* Form inputs */
padding: 6px 8px;
```

---

## 4. Margins

```css
/* Page-level horizontal margin (content area) */
margin: 0 auto;
max-width: 1500px;

/* Card grid gap */
gap: 8px;

/* Between sections */
margin-bottom: 12px;

/* Product image bottom margin */
margin-bottom: 8px;

/* Navigation items */
margin: 0 8px;

/* Form field groups */
margin-bottom: 16px;
```

---

## 5. Border Radius

| Component | Radius |
|---|---|
| Primary CTA Button | `8px` |
| Search Bar | `4px` (left: 4px, right: 4px) |
| Search Button | `0 4px 4px 0` |
| Product Cards | `4px` |
| Dropdown Menus | `4px` |
| Badge / Pills | `3px` |
| Avatar / Icons | `50%` (circle) |
| Input Fields | `3px` |
| Toast / Alerts | `4px` |

---

## 6. Shadows & Elevation

```css
/* Product card (default) */
box-shadow: 0 2px 5px 0 rgba(213, 217, 217, 0.5);

/* Card hover */
box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);

/* Dropdown menus */
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.13), 0 2px 10px rgba(0, 0, 0, 0.1);

/* Modal / overlay */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);

/* Header bar */
box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.15);

/* Sticky elements */
box-shadow: 0 4px 8px -4px rgba(0, 0, 0, 0.3);
```

---

## 7. Buttons

### Primary CTA Button (Orange)
```css
background-color: #FFD814;  /* Add to Cart */
/* OR */
background-color: #FF9900;  /* Buy Now */

color: #0F1111;
border: 1px solid #FCD200;
border-radius: 8px;
padding: 9px 10px;
font-size: 13px;
font-weight: 700;
cursor: pointer;
min-width: 100px;
text-align: center;

/* Gradient (Amazon uses subtle gradients) */
background: linear-gradient(to bottom, #F7DFA5, #F0C14B);
```

### Secondary Button
```css
background: #FFFFFF;
border: 1px solid #D5D9D9;
border-radius: 8px;
color: #0F1111;
padding: 9px 10px;
font-size: 13px;
```

### Hover States
```css
/* Primary hover */
background-color: #E47911;
border-color: #C45500;

/* Secondary hover */
background-color: #F7F8F8;
border-color: #D5D9D9;
```

---

## 8. Navigation Bar

### Top Header (`#131921`)
```css
height: 60px;
padding: 8px 18px;
display: flex;
align-items: center;
gap: 8px;
```

### Sub-navigation (`#232F3E`)
```css
height: 39px;
padding: 0 10px;
font-size: 13px;
font-weight: 700;
color: #FFFFFF;
```

### Search Bar
```css
height: 40px;
border-radius: 4px;
border: none;
flex: 1;

/* Input field */
border: 1px solid #CDBA96;
border-radius: 4px 0 0 4px;
padding: 4px 8px;
font-size: 15px;

/* Search button */
background: #FEBD69;
border-radius: 0 4px 4px 0;
width: 45px;
```

---

## 9. Cards & Product Tiles

```css
/* Product card */
background: #FFFFFF;
border: 1px solid #DDDDDD;
border-radius: 4px;
padding: 12px;
box-shadow: 0 2px 5px 0 rgba(213, 217, 217, 0.5);
transition: box-shadow 0.2s ease;

/* Card hover */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

/* Category section card */
background: #FFFFFF;
border-radius: 4px;
padding: 16px 20px;
margin-bottom: 12px;
```

---

## 10. Grid & Layout

```css
/* Main content wrapper */
max-width: 1500px;
margin: 0 auto;
padding: 0 18px;

/* Product grid (search/listing page) */
display: grid;
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
gap: 8px;

/* Homepage category grid (4 column) */
display: grid;
grid-template-columns: repeat(4, 1fr);
gap: 12px;

/* 2x2 image grid inside category card */
display: grid;
grid-template-columns: 1fr 1fr;
gap: 8px;

/* Left sidebar + main content */
display: flex;
gap: 16px;

/* Sidebar width */
width: 220px;
flex-shrink: 0;
```

---

## 11. Form Inputs

```css
/* Text input */
border: 1px solid #888C8C;
border-radius: 3px;
padding: 6px 8px;
font-size: 13px;
width: 100%;
box-sizing: border-box;
outline: none;

/* Focus state */
border-color: #E77600;
box-shadow: 0 0 0 3px rgba(228, 121, 17, 0.5);

/* Error state */
border-color: #CC0000;
box-shadow: 0 0 0 2px rgba(204, 0, 0, 0.3);

/* Dropdown select */
background: #FFFFFF url("arrow.svg") right 8px center no-repeat;
appearance: none;
padding-right: 28px;
```

---

## 12. Badges & Labels

```css
/* Prime badge */
color: #00A8E0;
font-weight: 700;
font-size: 12px;

/* Discount badge */
background: #CC0C39;
color: #FFFFFF;
font-size: 12px;
font-weight: 700;
padding: 2px 5px;
border-radius: 3px;

/* "New" badge */
background: #E3F4FF;
color: #007185;
font-size: 11px;
padding: 2px 4px;
border-radius: 3px;

/* Sponsored label */
color: #565959;
font-size: 11px;
```

---

## 13. Images

```css
/* Product image */
width: 100%;
aspect-ratio: 1 / 1;
object-fit: contain;
background: #FFFFFF;

/* Category thumbnail */
width: 120px;
height: 120px;
object-fit: cover;
border-radius: 2px;

/* Hero banner */
width: 100%;
height: 350px;
object-fit: cover;
```

---

## 14. Transitions & Animations

```css
/* Standard hover transition */
transition: all 0.2s ease;

/* Button press */
transition: background-color 0.1s ease;

/* Carousel slide */
transition: transform 0.3s ease-in-out;

/* Dropdown open */
transition: opacity 0.15s ease, visibility 0.15s ease;
```

---

## 15. Responsive Breakpoints

| Breakpoint | Width | Behavior |
|---|---|---|
| Mobile | `< 480px` | Single column, stacked nav |
| Tablet | `480px – 768px` | 2-column grid |
| Desktop Small | `768px – 1024px` | 3-column grid |
| Desktop | `1024px – 1366px` | 4-column grid |
| Wide Desktop | `> 1366px` | 5–6 column grid, max-width 1500px |

---

## 16. Z-Index Scale

| Layer | Value | Usage |
|---|---|---|
| Base | `0` | Default content |
| Raised | `10` | Cards on hover |
| Dropdown | `100` | Nav dropdowns |
| Sticky Header | `200` | Sticky navigation |
| Modal Overlay | `500` | Background overlay |
| Modal Content | `600` | Modal dialog |
| Toast | `900` | Notifications |

---

## Quick Reference Cheatsheet

```css
/* === AMAZON.IN CORE TOKENS === */

/* Colors */
--color-brand:        #FF9900;
--color-header:       #131921;
--color-nav:          #232F3E;
--color-link:         #007185;
--color-bg:           #EAEDED;
--color-card:         #FFFFFF;
--color-border:       #DDDDDD;
--color-text:         #0F1111;
--color-text-muted:   #565959;
--color-error:        #CC0000;
--color-success:      #007600;

/* Typography */
--font-family:        "Amazon Ember", Arial, sans-serif;
--font-size-base:     14px;
--line-height-base:   20px;

/* Spacing */
--space-xs:   4px;
--space-sm:   8px;
--space-md:   16px;
--space-lg:   24px;
--space-xl:   32px;

/* Border Radius */
--radius-sm:  3px;
--radius-md:  4px;
--radius-lg:  8px;
--radius-full: 50%;

/* Shadows */
--shadow-card: 0 2px 5px 0 rgba(213, 217, 217, 0.5);
--shadow-hover: 0 4px 12px rgba(0, 0, 0, 0.15);
--shadow-dropdown: 0 2px 10px rgba(0, 0, 0, 0.1);
```