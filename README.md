# 🎯 Pitch Print

**Anonymous Developer Lead Generation Tool** — Generate professional pitch flyers for local businesses.

![Pitch Print](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

### 🌐 [Click here to view the Live Project on Vercel](https://pitch-print.vercel.app)





---

# 📄 Pitch-Print

**Bridging the Gap Between Local Businesses and Modern Web Solutions.**

**Pitch-Print** is a full-stack utility designed for freelance developers to bridge the digital divide. It generates high-quality, printable physical "pitch cards" that developers can leave with local shop owners or restaurants.

---

## 💡 The Problem

Many local businesses in areas like Guwahati have no digital presence, but owners are often hesitant to engage with cold-calling developers.

## 🛠️ The Solution

Pitch-Print allows you to generate a professional, physical template that includes:

* **A Custom QR Code:** Directly linking to a live demo of what *their* website could look like.
* **Anonymous Contact:** Secure methods for owners to reach out if they are interested.
* **Customer Engagement:** Secondary templates for the shop's customers to view the menu/services digitally.

---


## ✨ Features

- 🎨 **4 Theme Presets** — Dark, Elegant, Traditional, Modern
- 🏪 **5 Business Types** — Restaurant, Retail, Service, Auto, General (with dynamic features)
- 👁️ **Real-time Preview** — See changes instantly as you type
- 📹 **Video Walkthrough** — Add a Loom/YouTube QR code for demos
- 📱 **WhatsApp Pre-fill** — Scanned messages include shop name automatically
- 📊 **Lead Dashboard** — Track all your leads in one place
- 🖨️ **Print-Optimized** — High contrast, laser printer friendly
- 🔒 **Anonymous Contact** — Phone number hidden in QR code only

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- PostgreSQL database (Neon, Supabase, Vercel Postgres, etc.)

### Local Development

```bash
# Clone the repository
git clone https://github.com/Sadiqueahmed/Pitch-print.git
cd Pitch-print

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚢 Deploy to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Sadiqueahmed/Pitch-print&env=DATABASE_URL&envDescription=PostgreSQL%20connection%20string&envLink=https://github.com/Sadiqueahmed/Pitch-print/blob/main/.env.example)

### Manual Deploy

1. **Fork or clone** this repository to your GitHub account

2. **Create a Vercel account** at [vercel.com](https://vercel.com)

3. **Create a PostgreSQL database**:
   - [Neon](https://neon.tech) (Free tier available)
   - [Supabase](https://supabase.com) (Free tier available)
   - [Vercel Postgres](https://vercel.com/storage/postgres)

4. **Deploy on Vercel**:
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy
   vercel
   ```

5. **Set environment variables** in Vercel Dashboard:
   - Go to your project → Settings → Environment Variables
   - Add `DATABASE_URL` with your PostgreSQL connection string

6. **Run database migration**:
   ```bash
   # In Vercel dashboard → Storage → your database → Query
   # Or run locally with your production DATABASE_URL
   npx prisma db push
   ```

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@host:5432/db?sslmode=require` |

## 📖 How to Use

1. **Enter Your Details**
   - Brand Name (e.g., "Luit Lab")
   - WhatsApp Number (for anonymous contact)

2. **Enter Shop Details**
   - Shop/Restaurant Name
   - Demo Website URL
   - Location (default: Guwahati)
   - Video Walkthrough URL (optional)

3. **Select Theme & Business Type**
   - Choose a theme that matches the business vibe
   - Select business type for relevant features

4. **Generate & Download**
   - Click "Generate Flyer"
   - Preview the PDF
   - Download and print!

## 🏗️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **PDF**: [@react-pdf/renderer](https://react-pdf.org/)
- **Database**: [Prisma](https://www.prisma.io/) + PostgreSQL
- **QR Codes**: [qrcode](https://www.npmjs.com/package/qrcode)

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── leads/route.ts      # Lead CRUD API
│   │   └── qrcode/route.ts     # QR generation API
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                # Main application
├── components/
│   ├── pdf/
│   │   └── PitchFlyer.tsx      # PDF template component
│   └── ui/                     # shadcn/ui components
├── hooks/
├── lib/
│   ├── db.ts                   # Prisma client
│   └── utils.ts
└── ...
```

## 🎨 Themes

| Theme | Best For | Colors |
|-------|----------|--------|
| **Dark** | Tech businesses, modern shops | Slate + Cyan |
| **Elegant** | Professional services | White + Emerald |
| **Traditional** | Local restaurants, heritage shops | Amber + Orange |
| **Modern** | Retail, fashion, lifestyle | White + Violet |

## 📱 WhatsApp Pre-fill

When a shop owner scans the WhatsApp QR, they get a pre-filled message:

```
Hi! I'm the owner of [Shop Name]. I just scanned the flyer from [Your Lab]. I'm interested in the website.
```

This makes it easy for them to start the conversation!

## 🔧 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push Prisma schema to database
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Create and apply migrations
```

## 📄 License

MIT License - feel free to use this for your own lead generation!

---

Built with ❤️ by [Luit Lab](https://github.com/Sadiqueahmed)
