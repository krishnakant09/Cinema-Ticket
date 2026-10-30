# 🎬 CINEVERSE 3D — Next-Gen 3D Cinema Ticket Booking Website

An immersive, full-stack WebGL cinema ticket booking platform built with **React**, **Three.js**, and **Tailwind CSS**. Users can explore an interactive 3D cinema auditorium, rotate/zoom around tiered stadium seating, inspect true **first-person eye-level sightlines (POV mode)** towards the curved IMAX laser screen, customize concessions, apply discounts, and generate scannable digital holographic tickets.

---

## 🌟 Key Highlights & Features

### 1. 🎥 Real-Time Interactive 3D Auditorium
- **Giant Curved IMAX Screen**: Features an animated dynamic teaser canvas texture that projects color-matched atmospheric lighting across the theater.
- **Tiered Stadium Risers**: Acoustically calibrated tiered elevation across 10 rows (Rows A to J) with carpeted aisles and recessed LED runner lights.
- **Detailed 3D Seat Modeling**:
  - Individually modeled armrests, cushions, backrests, and cup holders.
  - Distinct tiers: **VIP Recliners** ($24.50, luxury leather with wider dimensions), **Premium Club** ($18.00, center sweet-spot acoustic zone), and **Standard Classic** ($13.50).
  - Wheelchair accessible berths with companion seating.
  - Selected seats emit a pulsing holographic beacon cone with amber glow.
  - Occupied/booked seats are realistically muted.
- **Raycasting & 3D HUD Tooltip**: Real-time cursor raycasting reveals row, seat number, tier badge, and price floating directly above hovered seats.

### 2. 👁️ First-Person "View From Seat" (POV Mode)
- Click **"3D POV"** on any seat in either the 3D hall or the 2D matrix.
- The 3D camera smoothly flies right into that chair at eye level (~1.1m elevation), facing directly towards the curved screen.
- Allows ticket buyers to verify viewing angle, screen size perception, and distance before reserving!

### 3. 📐 Synchronized 2D Seating Matrix & Split View
- Live bidirectional synchronization: selecting a seat in 3D reflects in the 2D layout and vice-versa.
- Quick Tier Filter pills (All, VIP, Premium, Standard).
- Switch view layout modes anytime: **Split View (3D + 2D)**, **3D Theater Only**, or **2D Matrix Only**.

### 4. 🍿 Gourmet Concessions & Add-Ons
- Pre-order theater snacks to skip line queues:
  - Truffle & Butter Jumbo Popcorn
  - Sweet Caramel Glaze Tub
  - Artisan Queso Nachos
  - Ice-cold Fountain Sodas & Wild Cherry ICEE
  - VIP Premiere Duo Combo (Save 20%)

### 5. 💳 Checkout & Promo Discounts
- Itemized billing breakdown (Tickets, Concessions, Convenience fee, Taxes).
- Working discount promo codes:
  - `CINEMA20` — 20% off entire booking
  - `IMAXVIP` — 15% off VIP experience
  - `FIRST5` — $5 off tickets
- Simulated payment options: Credit/Debit Card, Apple Pay, and Google Pay with 256-bit encryption indicator.

### 6. 🎟️ Digital Holographic Ticket Pass
- Confetti celebration upon reservation completion (`canvas-confetti`).
- Holographic cinema boarding pass with dynamic QR code, barcode, auditorium number, assigned seats, and transaction ID.
- Instant "Print / Save PDF" option and one-click "Book Another Movie" flow.

### 7. 🔊 Web Audio API Synthesizer
- Zero external audio file latency. Synthesizes realistic futuristic clicks, pops, whooshes, and celebratory chimes.
- Toggle sound on/off anytime from the header bar.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/)

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Start the local development server
npm run dev

# 3. Open in your browser
# http://localhost:5173
```

### Production Build

```bash
# Build optimized bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🛠️ Tech Stack
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **3D Graphics**: [Three.js](https://threejs.org/) + OrbitControls + WebGL
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Visual FX**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Audio**: Web Audio API Procedural Synthesizer
