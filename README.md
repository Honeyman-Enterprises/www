# Honeyman Enterprises - React Website

Modern React + TypeScript website for Honeyman Enterprises with Docker-first development workflow.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- No Node.js installation required on host machine

### Start Development

```bash
# Start all services (dev + test)
docker-compose up

# Or in detached mode
docker-compose up -d

# View logs
docker-compose logs -f dev

# Stop services
docker-compose down
```

The development server will be available at: **http://localhost:5181**

### Rebuild Containers

Always rebuild when making infrastructure changes:

```bash
docker-compose up --build
```

## 📋 Project Structure

```
honeyman-react/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx       # Sticky black nav with white text
│   │   │   ├── Footer.tsx       # Dark footer with newsletter
│   │   │   └── Layout.tsx       # Main wrapper
│   │   └── ui/                  # Reusable UI components
│   ├── sections/
│   │   ├── Hero.tsx             # Vanta.js globe animation
│   │   ├── About.tsx            # Company info
│   │   ├── Method.tsx           # 5-stage workflow (centered!)
│   │   ├── Services.tsx         # 3 service cards
│   │   └── Contact.tsx          # HubSpot form integration
│   ├── hooks/
│   │   └── useScrolled.ts       # Navbar scroll effect
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
│   └── logo.svg                 # 1:1 ratio logo
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## 🎨 Design System

### Colors
- **Navy**: `#0B2442` - Primary backgrounds, hero
- **Teal**: `#2AA7A1` - Accents, interactive elements
- **Gold**: `#BE8A2F` - CTAs, highlights
- **Cream**: `#F7F5F2` - Body background
- **Dark**: `#232629` - Footer background

### Typography
- **Headings**: Oswald (bold, uppercase, tracking-tight)
- **Body**: Roboto Condensed

### Tailwind Classes
```jsx
<div className="bg-navy text-white">      // Navy background
<div className="bg-teal hover:bg-teal-dark">  // Teal with hover
<button className="bg-gold hover:bg-gold-dark"> // Gold CTA
<section className="bg-cream">            // Cream section
```

## 📧 HubSpot Form Integration

### What You Need (No API Key Required!)

HubSpot embedded forms only need **2 things**:
1. **Portal ID** - Your HubSpot account ID (8-digit number)
2. **Form ID** - Specific form identifier (UUID format)

### Quick Setup

1. **Find Your Portal ID**
   - HubSpot Settings → Account Defaults → Hub ID
   - Or from any form embed code

2. **Get Your Form ID**
   - Marketing → Forms → Select form
   - Copy ID from URL or embed code
   - Format: `abc123de-f456-7890-ghij-klmnopqrstuv`

3. **Update Contact Component**

   Edit `src/sections/Contact.tsx`:

   ```typescript
   region: 'na1',              // 'na1' or 'eu1' based on your account
   portalId: '12345678',       // Your 8-digit Portal ID
   formId: 'abc123...',        // Your Form ID (UUID)
   ```

4. **Test the Form**
   - Visit http://localhost:5181/#contact
   - Form loads automatically (2-3 seconds)
   - Test submission → Check HubSpot Contacts

**Detailed Instructions**: See `HUBSPOT_SETUP.md` for complete guide with troubleshooting.

### HubSpot Form Styling

The form inherits styling from the parent container. To customize:

```tsx
<div id="hubspot-form" className="bg-white/10 p-6 rounded-lg">
  {/* Adjust background, padding, border as needed */}
</div>
```

## 🔧 Key Features

### ✅ Navigation
- **Sticky to top** - Stays visible while scrolling
- **Black background** (#000000) with **white text** (#FFFFFF)
- **1:1 Logo** - Square gold placeholder (replace with real logo)
- **Smooth scroll** - Animated scrolling to sections
- **Scroll shadow** - Adds shadow when scrolled

### ✅ Hero Section
- **Vanta.js Globe** - Animated 3D globe background
- **Navy background** with teal globe accent
- **Dual CTAs** - Schedule Call (gold), Explore Services (outline)
- **Animated chevron** - Bounce animation for scroll indicator

### ✅ Method Section
- **5 Stages** - Discovery → Strategy → Approval → Execution → Delivery
- **Center Aligned** - Boxes properly centered (FIXED!)
- **Alternating colors** - Teal and gold stages
- **SVG path** - Curved connector line (desktop only)
- **Hover effects** - Cards lift on hover

### ✅ Services Section
- **3 Cards** - Strategy, Digital Transformation, AI Consulting
- **Icon circles** - Navy backgrounds with white icons
- **Hover animations** - Lift and shadow effects
- **Feature lists** - Checkmarks with teal accent

### ✅ Contact Section
- **HubSpot Form** - Live form integration
- **Contact info** - Email and calendar links
- **Navy background** - Matches hero section
- **Two-column layout** - Info + form side by side

## 🐳 Docker Workflow

### Development Container
- **Port**: 5181 → 5173 (internal)
- **Hot Reload**: Enabled via volume mounts
- **Command**: `npm install && npm run dev`

### Test Container
- **Watch Mode**: Runs tests on file changes
- **Command**: `npm install && npm run test:watch`

### Important Commands

```bash
# NEVER run these on host machine
❌ npm install
❌ npm run dev
❌ npm run build

# ALWAYS use Docker
✅ docker-compose up
✅ docker-compose restart
✅ docker-compose logs -f dev
```

## 📦 Dependencies

### Production
- **React 19.1.1** - UI framework
- **Vanta.js** - 3D globe animation
- **Three.js** - WebGL graphics (for Vanta)
- **Lucide React** - Icon library (Feather icons replacement)

### Development
- **Vite 7.1.7** - Build tool
- **TypeScript 5.9.3** - Type safety
- **Tailwind CSS 3.4.14** - Utility-first CSS
- **Vitest** - Test runner

## 🚨 Common Issues

### Port Already in Use
```bash
# Stop other services using 5173-5180
docker-compose down
docker kill $(docker ps -q)
docker-compose up
```

### Changes Not Showing
```bash
# Force rebuild
docker-compose up --build --force-recreate
```

### TypeScript Errors
```bash
# Check types
docker-compose exec dev npm run build
```

## 📝 Next Steps

### Required Before Launch

1. **Replace Logo**
   - Create proper 1:1 ratio logo
   - Replace `/public/logo.svg`

2. **Add HubSpot Keys**
   - Update Portal ID in `Contact.tsx`
   - Update Form ID in `Contact.tsx`

3. **Update Content**
   - Replace placeholder image in About section
   - Add real team photos
   - Update service descriptions

4. **Testing**
   - Test form submissions
   - Test responsive design on mobile
   - Test all navigation links
   - Verify Vanta.js performance

5. **SEO Optimization**
   - Add meta tags
   - Create sitemap
   - Add analytics (Google/Plausible)

### Optional Enhancements

- [ ] Mobile menu hamburger
- [ ] Newsletter form integration
- [ ] Blog section
- [ ] Case studies page
- [ ] Team page
- [ ] Performance optimization
- [ ] Progressive Web App (PWA)

## 📄 License

Private - Honeyman Enterprises

---

**Development URL**: http://localhost:5181  
**Built with**: React + TypeScript + Vite + Tailwind + Docker
