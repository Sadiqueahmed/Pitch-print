'use client';

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Download, 
  QrCode, 
  Loader2,
  CheckCircle,
  Eye,
  Video,
  Database,
  X,
  ChevronRight,
  MapPin,
  Calendar,
  Trash2
} from 'lucide-react';

// Dynamic import for PDF to avoid SSR issues
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink),
  { ssr: false, loading: () => <Button disabled className="h-11">Loading PDF...</Button> }
);

const PitchFlyer = dynamic(
  () => import('@/components/pdf/PitchFlyer').then(mod => mod.PitchFlyer),
  { ssr: false }
);

interface QRDataUrls {
  projectQR: string;
  whatsappQR: string;
  videoQR?: string;
}

interface Lead {
  id: string;
  shopName: string;
  demoUrl: string;
  brandName: string;
  location: string;
  createdAt: string;
}

interface Feature {
  title: string;
  description: string;
}

// Business type presets with features
const businessTypes: Record<string, { label: string; features: Feature[] }> = {
  restaurant: {
    label: 'Restaurant / Café',
    features: [
      { title: 'Digital Menu', description: 'Beautiful online menu that updates instantly.' },
      { title: 'WhatsApp Ordering', description: 'Accept orders directly via WhatsApp.' },
      { title: 'Google Maps Ready', description: 'Get found by hungry customers nearby.' },
      { title: 'Mobile-First', description: 'Perfect for customers on the go.' },
    ],
  },
  retail: {
    label: 'Retail / Shop',
    features: [
      { title: 'Product Catalog', description: 'Showcase your products beautifully.' },
      { title: 'Google Maps Optimized', description: 'Local customers find you easily.' },
      { title: 'Contact Integration', description: 'One-tap calls and directions.' },
      { title: 'Fast Loading', description: 'Under 2 seconds on any network.' },
    ],
  },
  service: {
    label: 'Service Business',
    features: [
      { title: 'Online Booking', description: 'Let customers book appointments 24/7.' },
      { title: 'Service Showcase', description: 'Display your services and pricing.' },
      { title: 'Reviews Integration', description: 'Build trust with customer reviews.' },
      { title: 'Instant Contact', description: 'One-tap calling and messaging.' },
    ],
  },
  auto: {
    label: 'Auto / Garage',
    features: [
      { title: 'Service Gallery', description: 'Show your workshop and work quality.' },
      { title: 'Price Transparency', description: 'Clear service pricing displayed.' },
      { title: 'WhatsApp Booking', description: 'Easy appointment scheduling.' },
      { title: 'Google Maps', description: 'Customers find your location easily.' },
    ],
  },
  general: {
    label: 'General Business',
    features: [
      { title: 'Lightning Fast', description: 'Loads in under 2 seconds.' },
      { title: 'SEO Optimized', description: 'Rank higher on Google.' },
      { title: 'Mobile-First', description: 'Perfect on any device.' },
      { title: 'Custom Design', description: 'Tailored to your brand.' },
    ],
  },
};

// Theme configurations
const themeConfigs = {
  dark: {
    label: 'Dark Mode',
    bg: 'bg-slate-900',
    card: 'bg-slate-800',
    text: 'text-white',
    muted: 'text-slate-400',
    accent: 'text-cyan-400',
    border: 'border-slate-700',
  },
  elegant: {
    label: 'Elegant',
    bg: 'bg-gray-50',
    card: 'bg-white',
    text: 'text-gray-900',
    muted: 'text-gray-500',
    accent: 'text-emerald-600',
    border: 'border-gray-200',
  },
  traditional: {
    label: 'Traditional',
    bg: 'bg-amber-50',
    card: 'bg-orange-50',
    text: 'text-amber-950',
    muted: 'text-amber-700',
    accent: 'text-orange-600',
    border: 'border-amber-200',
  },
  modern: {
    label: 'Modern',
    bg: 'bg-white',
    card: 'bg-slate-50',
    text: 'text-slate-900',
    muted: 'text-slate-500',
    accent: 'text-violet-600',
    border: 'border-slate-200',
  },
};

// Generate QR code via API
const generateQRDataUrl = async (value: string, size: number = 200): Promise<string> => {
  const response = await fetch(`/api/qrcode?value=${encodeURIComponent(value)}&size=${size}`);
  const data = await response.json();
  return data.dataUrl;
};

// Format WhatsApp URL with pre-filled message
const formatWhatsAppUrl = (number: string, shopName: string, brandName: string): string => {
  const cleanNumber = number.replace(/\D/g, '');
  const formattedNumber = cleanNumber.startsWith('91') ? cleanNumber : `91${cleanNumber}`;
  const message = encodeURIComponent(`Hi! I'm the owner of ${shopName}. I just scanned the flyer from ${brandName}. I'm interested in the website.`);
  return `https://wa.me/${formattedNumber}?text=${message}`;
};

export default function PitchPrintApp() {
  // Form state
  const [brandName, setBrandName] = useState('Luit Lab');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [shopName, setShopName] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [location, setLocation] = useState('Guwahati');
  
  // Custom content
  const [headline, setHeadline] = useState('');
  const [subheadline, setSubheadline] = useState('');
  
  // Theme & Business Type
  const [theme, setTheme] = useState<keyof typeof themeConfigs>('dark');
  const [businessType, setBusinessType] = useState('general');
  
  // QR codes
  const [qrDataUrls, setQrDataUrls] = useState<QRDataUrls | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);
  
  // Leads dashboard
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showDashboard, setShowDashboard] = useState(false);

  // Mark PDF as ready after mount
  useEffect(() => {
    setPdfReady(true);
  }, []);

  // Load leads from API on mount
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads');
      if (response.ok) {
        const data = await response.json();
        setLeads(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  // Generate QR codes
  const handleGenerate = async () => {
    if (!shopName || !demoUrl || !whatsappNumber) return;
    
    setIsGenerating(true);
    
    try {
      const projectQR = await generateQRDataUrl(demoUrl, 200);
      const whatsappUrl = formatWhatsAppUrl(whatsappNumber, shopName, brandName);
      const whatsappQR = await generateQRDataUrl(whatsappUrl, 200);
      
      let videoQR: string | undefined;
      if (videoUrl) {
        videoQR = await generateQRDataUrl(videoUrl, 150);
      }
      
      setQrDataUrls({ projectQR, whatsappQR, videoQR });
      setIsReady(true);
    } catch (error) {
      console.error('Error generating QR codes:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Save lead to database
  const saveLead = async () => {
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopName, demoUrl, whatsappNumber, brandName, location }),
      });
      fetchLeads();
    } catch (error) {
      console.error('Error saving lead:', error);
    }
  };

  // Delete lead
  const deleteLead = async (id: string) => {
    try {
      await fetch(`/api/leads?id=${id}`, { method: 'DELETE' });
      fetchLeads();
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const canGenerate = shopName && demoUrl && whatsappNumber;
  const currentFeatures = businessTypes[businessType]?.features || businessTypes.general.features;
  const themeConfig = themeConfigs[theme];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                  Pitch Print
                  <Badge variant="secondary" className="font-mono text-xs">{brandName}</Badge>
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">Professional Pitch Flyer Generator</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isReady && (
                <div className="flex items-center gap-2 text-sm text-emerald-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Ready to download</span>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDashboard(!showDashboard)}
                className="gap-2"
              >
                <Database className="h-4 w-4" />
                <span className="hidden sm:inline">Leads ({leads.length})</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Leads Dashboard */}
      {showDashboard && (
        <div className="border-b border-gray-100 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Lead Dashboard</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowDashboard(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            {leads.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {leads.map((lead) => (
                  <div key={lead.id} className="bg-white rounded-lg p-4 border border-gray-200 flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{lead.shopName}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {lead.location || 'Guwahati'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                      onClick={() => deleteLead(lead.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No leads saved yet. Generate a flyer and save it!</p>
            )}
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left - Form */}
          <div className="space-y-6">
            {/* Theme & Business Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-gray-500 mb-1.5 block">Theme</Label>
                <Select value={theme} onValueChange={(v) => setTheme(v as typeof theme)}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(themeConfigs).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-gray-500 mb-1.5 block">Business Type</Label>
                <Select value={businessType} onValueChange={setBusinessType}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(businessTypes).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Brand Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                <h2 className="font-medium text-gray-900 text-sm">Your Details</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">Brand Name</Label>
                  <Input
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="Luit Lab"
                    className="h-9 font-mono text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">WhatsApp Number</Label>
                  <Input
                    placeholder="9876543210"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400">Number encoded in QR with pre-filled message — never shown as text</p>
            </div>

            <Separator />

            {/* Shop Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-blue-500 rounded-full" />
                <h2 className="font-medium text-gray-900 text-sm">Shop Details</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">Shop Name</Label>
                  <Input
                    placeholder="Sharma's Kitchen"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">Location</Label>
                  <Input
                    placeholder="Guwahati"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Demo Website URL</Label>
                <Input
                  placeholder="https://demo.vercel.app"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Video Walkthrough URL (Optional)</Label>
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="https://loom.com/video..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="h-9 text-sm flex-1"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Loom/YouTube video showing the website in action</p>
              </div>
            </div>

            <Separator />

            {/* Customize Message */}
            <details className="group">
              <summary className="flex items-center gap-2 cursor-pointer list-none">
                <div className="w-1 h-4 bg-violet-500 rounded-full" />
                <h2 className="font-medium text-gray-900 text-sm">Customize Message</h2>
                <ChevronRight className="h-4 w-4 text-gray-400 ml-auto group-open:rotate-90 transition-transform" />
              </summary>
              
              <div className="space-y-3 mt-3 pl-3">
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">Headline</Label>
                  <Input
                    placeholder={`I built a new digital home for ${shopName || '[Shop]'}.`}
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">Subheadline</Label>
                  <Textarea
                    placeholder="A modern, fast website designed for your business."
                    value={subheadline}
                    onChange={(e) => setSubheadline(e.target.value)}
                    className="text-sm min-h-16"
                  />
                </div>
              </div>
            </details>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                className="w-full h-11 bg-gray-900 hover:bg-gray-800"
                onClick={handleGenerate}
                disabled={!canGenerate || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : isReady ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Regenerate Flyer
                  </>
                ) : (
                  <>
                    <QrCode className="h-4 w-4 mr-2" />
                    Generate Flyer
                  </>
                )}
              </Button>

              {isReady && qrDataUrls && pdfReady && (
                <div className="flex gap-2">
                  <PDFDownloadLink
                    document={
                      <PitchFlyer
                        shopName={shopName}
                        demoUrl={demoUrl}
                        brandName={brandName}
                        projectQRDataUrl={qrDataUrls.projectQR}
                        whatsappQRDataUrl={qrDataUrls.whatsappQR}
                        videoQRDataUrl={qrDataUrls.videoQR}
                        headline={headline}
                        subheadline={subheadline}
                        features={currentFeatures}
                        theme={theme}
                      />
                    }
                    fileName={`pitch-${shopName.toLowerCase().replace(/\s+/g, '-')}.pdf`}
                    className="flex-1"
                  >
                    {({ loading }) => (
                      <Button
                        className="w-full h-11 bg-emerald-600 hover:bg-emerald-700"
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4 mr-2" />
                        )}
                        Download PDF
                      </Button>
                    )}
                  </PDFDownloadLink>
                  <Button variant="outline" className="h-11 px-4" onClick={saveLead}>
                    Save Lead
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right - Live Preview */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="h-4 w-4 text-gray-400" />
              <span className="text-xs text-gray-500">Live Preview</span>
              <Badge variant="outline" className="ml-auto text-xs">{themeConfigs[theme].label}</Badge>
            </div>
            
            {/* Preview Card */}
            <div className={`rounded-xl overflow-hidden shadow-lg border ${themeConfig.border} ${themeConfig.bg} p-6`}>
              {/* Header */}
              <div className="mb-5">
                <p className={`text-xs ${themeConfig.accent} tracking-widest uppercase mb-1 font-mono font-semibold`}>
                  {brandName || 'Your Brand'}
                </p>
                <h3 className={`text-lg font-bold ${themeConfig.text} leading-tight`}>
                  {headline || `I built a new digital home for ${shopName || '[Shop Name]'}.`}
                </h3>
                <p className={`text-xs ${themeConfig.muted} mt-1.5 leading-relaxed`}>
                  {subheadline || 'A modern, fast, and mobile-ready website designed for your business.'}
                </p>
              </div>

              {/* QR Section */}
              <div className={`${themeConfig.card} rounded-xl p-5 text-center mb-4 border ${themeConfig.border}`}>
                {qrDataUrls?.projectQR ? (
                  <img src={qrDataUrls.projectQR} alt="QR" className="w-28 h-28 mx-auto mb-2" />
                ) : (
                  <div className={`w-28 h-28 mx-auto mb-2 ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg flex items-center justify-center`}>
                    <QrCode className={`h-10 w-10 ${theme === 'dark' ? 'text-slate-500' : 'text-gray-300'}`} />
                  </div>
                )}
                <p className={`text-sm ${themeConfig.text} font-semibold`}>Scan to Preview Website</p>
                <p className={`text-xs ${themeConfig.muted} mt-0.5`}>Point your camera at the QR code</p>
              </div>

              {/* Video QR */}
              {videoUrl && (
                <div className={`flex items-center justify-center gap-4 mb-4 p-3 ${themeConfig.card} rounded-lg border ${themeConfig.border}`}>
                  {qrDataUrls?.videoQR ? (
                    <img src={qrDataUrls.videoQR} alt="Video QR" className="w-14 h-14" />
                  ) : (
                    <div className={`w-14 h-14 ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'} rounded flex items-center justify-center`}>
                      <Video className={`h-5 w-5 ${theme === 'dark' ? 'text-slate-500' : 'text-gray-300'}`} />
                    </div>
                  )}
                  <div className="text-left">
                    <p className={`text-xs ${themeConfig.accent} font-semibold`}>📹 Watch Video Walkthrough</p>
                    <p className={`text-xs ${themeConfig.muted}`}>See the website in action</p>
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className={`flex justify-center gap-6 py-3 border-y ${themeConfig.border} mb-4`}>
                <div className="text-center">
                  <p className={`text-sm font-bold ${themeConfig.accent}`}>&lt;2s</p>
                  <p className={`text-xs ${themeConfig.muted}`}>Load</p>
                </div>
                <div className="text-center">
                  <p className={`text-sm font-bold ${themeConfig.accent}`}>100%</p>
                  <p className={`text-xs ${themeConfig.muted}`}>Mobile</p>
                </div>
                <div className="text-center">
                  <p className={`text-sm font-bold ${themeConfig.accent}`}>SEO</p>
                  <p className={`text-xs ${themeConfig.muted}`}>Ready</p>
                </div>
              </div>

              {/* Features */}
              <div className="mb-4">
                <p className={`text-xs font-semibold ${themeConfig.text} mb-2 text-center`}>What You Get</p>
                <div className="grid grid-cols-2 gap-2">
                  {currentFeatures.map((feature) => (
                    <div 
                      key={feature.title} 
                      className={`${themeConfig.card} rounded-lg p-2.5 border-l-2 ${theme === 'dark' ? 'border-cyan-400' : theme === 'traditional' ? 'border-orange-500' : theme === 'modern' ? 'border-violet-500' : 'border-emerald-500'}`}
                    >
                      <p className={`text-xs font-semibold ${themeConfig.text}`}>{feature.title}</p>
                      <p className={`text-xs ${themeConfig.muted} mt-0.5`}>{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className={`flex items-center gap-3 bg-gray-900 rounded-xl p-3.5`}>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">Interested? Let's Chat</p>
                  <p className="text-xs text-gray-400 mt-0.5">Scan to message via WhatsApp</p>
                </div>
                <div className="bg-white rounded-lg p-1">
                  {qrDataUrls?.whatsappQR ? (
                    <img src={qrDataUrls.whatsappQR} alt="WhatsApp QR" className="w-12 h-12" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                      <QrCode className="h-5 w-5 text-gray-300" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Status */}
            {isReady && (
              <div className="mt-3 flex items-center justify-center gap-2 text-sm text-emerald-600">
                <CheckCircle className="h-4 w-4" />
                <span>Flyer ready — Print-optimized for laser printers</span>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-4 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center text-xs text-gray-400">
          <p>Pitch Print by {brandName} — Anonymous Developer Lead Generation</p>
        </div>
      </footer>
    </div>
  );
}
