

# LOQ Degen - Performance-Optimized Rebuild

## Project Overview
Pixel-perfect recreation of loq-degen.dev with significant performance improvements. The site is a memecoin launch service landing page featuring WebGL backgrounds, interactive animations, and Solana blockchain integration.

---

## Phase 1: Foundation & Core Structure

### 1.1 Design System Setup
- Extract exact colors from the original site (dark purple #060010 background, gradient purples #5227FF, #FF9FFC, #B19EEF)
- Configure typography to match original (font weights, sizes, spacing)
- Set up CSS custom properties for consistent theming

### 1.2 Layout Architecture
- Implement full-screen section-based scrolling (snap scroll)
- Build responsive grid system matching original breakpoints
- Create reusable container components with exact max-widths

---

## Phase 2: UI Components (Pixel-Perfect Recreation)

### 2.1 Navigation
- Floating navigation bar with rounded pill buttons (HOME, WHAT I GET, PROFITS, JOURNEYS, TOOLS, FAQS)
- Responsive behavior matching original

### 2.2 Hero Section (First Screen)
- "Welcome Degen" animated gradient text with bracket borders
- Right-side "Launch Memecoins" CTA card with:
  - "LIMITED SPACES" badge with pulsing indicator
  - Gradient headline with "MOONS" highlight
  - "JOIN NOW" gradient button
  - Avatar stack with member count
  - Instagram social link

### 2.3 "What I Get" Section
- 6-card bento grid layout (Custom Token, Hype Strategy, Custom Website, Resources, Launch Plan, Team Support)
- Cards with SVG icons, hover glow effects, exact styling

### 2.4 Profits Section
- Interactive canvas grid gallery with project screenshots
- Draggable/pannable grid view
- "$BEARMAS" case study display

### 2.5 Journeys Section
- Testimonial carousel with customer screenshots
- "Trusted By Influencers" quote section
- Project showcase cards (Bullish Degen, ZKForge, Own Nothing)

### 2.6 Tools Section
- 11 service cards with expandable pricing:
  - Dex Ranking, Volume Boosters, Bumps, Bundle Terminal
  - Phantom Trending, DEX Reactions, Holder Boost
  - Chat Managers, Raiders, PF Stream Viewers, PF Comments, Phantom Group Chats
- Each card shows pricing options when clicked
- Prices fetched dynamically from database

### 2.7 FAQ Section
- Accordion-style expandable questions
- 6 FAQ items with smooth animations

### 2.8 Footer
- Navigation links
- Testimonial quotes from users

---

## Phase 3: Performance-Optimized Animations

### 3.1 Optimized WebGL Background
- Recreate laser flow effect using optimized Three.js/WebGL
- Use offscreen canvas where supported
- Implement proper cleanup and memory management
- Add adaptive quality based on device performance
- Pause rendering when not visible (IntersectionObserver)

### 3.2 GPU-Accelerated UI Animations
- All transitions use only `transform` and `opacity`
- Gradient text animations optimized with `will-change`
- Hover effects using hardware-accelerated properties
- No layout-triggering animations

### 3.3 Scroll Performance
- IntersectionObserver for section visibility
- Virtual scrolling for heavy sections
- Debounced scroll handlers

---

## Phase 4: Backend (Lovable Cloud Edge Functions)

### 4.1 Balance Endpoint (`/api/balance`)
- Validate Solana public key
- Fetch balance via Helius RPC (API key in secrets)
- Return lamports and SOL amount
- Rate limiting to prevent abuse

### 4.2 Notification Endpoint (`/api/notify`)
- Accept message from frontend
- Send to Telegram via bot API
- Telegram credentials in secrets (never exposed)
- Input validation

### 4.3 Price Endpoint (`/api/price`)
- Fetch SOL/USD from CoinGecko
- 15-second in-memory cache
- Fallback price if API fails
- Structured error responses

### 4.4 Pricing Data Endpoint (`/api/pricing`)
- Serve tool pricing from database
- Admin-editable without code changes

---

## Phase 5: Database Schema

### 5.1 Tools & Pricing Table
- Tool name, description, category
- Pricing tiers (different durations/volumes)
- Active/inactive status
- Sort order

### 5.2 Testimonials Table (Optional)
- Customer quotes
- Associated images
- Display order

---

## Phase 6: Performance Optimizations

### 6.1 Image Optimization
- Lazy loading with blur placeholders
- WebP format with fallbacks
- Responsive image sizes
- Preload critical images

### 6.2 Code Splitting
- Dynamic imports for heavy components (Three.js, canvas)
- Route-based code splitting
- Defer non-critical scripts

### 6.3 Bundle Optimization
- Tree shaking unused code
- Minification and compression
- Optimized production builds

### 6.4 Core Web Vitals
- Target Lighthouse score: 95+
- Minimize Cumulative Layout Shift (CLS)
- Optimize Largest Contentful Paint (LCP)
- Reduce First Input Delay (FID)

---

## Phase 7: Security

### 7.1 Backend Security
- All API keys in Lovable Cloud secrets
- No credentials exposed to frontend
- Rate limiting on all endpoints
- Input validation and sanitization
- CORS configured properly

### 7.2 Frontend Security
- No RPC keys in client code
- Validate user inputs
- Secure API calls only through backend

---

## Technical Stack
- **Frontend**: Vite + React + TypeScript + Tailwind CSS
- **3D/WebGL**: Three.js via @react-three/fiber (v8) + drei (v9)
- **Backend**: Lovable Cloud Edge Functions
- **Database**: Lovable Cloud (Supabase)
- **Animations**: Framer Motion + GPU-accelerated CSS

---

## Deliverables
✅ Exact 1:1 visual replica of loq-degen.dev  
✅ Lighthouse performance score 95+  
✅ Smooth scrolling, zero jank  
✅ Mobile-first responsive design  
✅ Secure backend with proper secret management  
✅ Database-driven pricing for easy updates  
✅ Production-ready, deployable

