'use client';

import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
import React from 'react';

// Theme configurations
const themes = {
  dark: {
    background: '#0f172a',
    card: '#1e293b',
    text: '#ffffff',
    muted: '#94a3b8',
    accent: '#22d3ee',
    border: '#334155',
    featureBg: '#1e293b',
    footerBg: '#0f172a',
  },
  elegant: {
    background: '#fafafa',
    card: '#ffffff',
    text: '#1a1a1a',
    muted: '#6b7280',
    accent: '#059669',
    border: '#e5e7eb',
    featureBg: '#f3f4f6',
    footerBg: '#1a1a1a',
  },
  traditional: {
    background: '#fefdfb',
    card: '#fff8f0',
    text: '#3d2914',
    muted: '#7c5e3c',
    accent: '#c2410c',
    border: '#e7ddd0',
    featureBg: '#fff8f0',
    footerBg: '#3d2914',
  },
  modern: {
    background: '#ffffff',
    card: '#f8fafc',
    text: '#0f172a',
    muted: '#64748b',
    accent: '#7c3aed',
    border: '#e2e8f0',
    featureBg: '#f1f5f9',
    footerBg: '#0f172a',
  },
};

// Create styles based on theme
const createStyles = (theme: keyof typeof themes) => {
  const t = themes[theme];
  return StyleSheet.create({
    page: {
      backgroundColor: t.background,
      padding: 48,
      fontFamily: 'Helvetica',
    },
    container: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    
    // Header
    brandTag: {
      fontSize: 9,
      color: t.accent,
      letterSpacing: 3,
      textTransform: 'uppercase',
      marginBottom: 10,
      fontFamily: 'Courier',
      fontWeight: 'bold',
    },
    headline: {
      fontSize: 30,
      fontWeight: 'bold',
      color: t.text,
      lineHeight: 1.2,
      marginBottom: 10,
    },
    subheadline: {
      fontSize: 12,
      color: t.muted,
      lineHeight: 1.6,
      maxWidth: 400,
    },
    
    // QR Section
    qrSection: {
      alignItems: 'center',
      marginVertical: 28,
      padding: 24,
      backgroundColor: t.card,
      borderRadius: 12,
      borderWidth: theme === 'elegant' || theme === 'modern' ? 1 : 0,
      borderColor: t.border,
    },
    qrImage: {
      width: 140,
      height: 140,
      marginBottom: 10,
    },
    scanLabel: {
      fontSize: 13,
      color: t.text,
      fontWeight: 'bold',
    },
    scanHint: {
      fontSize: 10,
      color: t.muted,
      marginTop: 4,
    },
    
    // Stats
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 36,
      marginVertical: 18,
      paddingVertical: 14,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: t.border,
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 15,
      fontWeight: 'bold',
      color: t.accent,
    },
    statLabel: {
      fontSize: 8,
      color: t.muted,
      marginTop: 3,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    
    // Features
    featuresSection: {
      marginVertical: 16,
    },
    featuresTitle: {
      fontSize: 11,
      fontWeight: 'bold',
      color: t.text,
      marginBottom: 12,
      textAlign: 'center',
    },
    featuresGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 8,
    },
    featureCard: {
      width: '48%',
      padding: 12,
      backgroundColor: t.featureBg,
      borderRadius: 8,
      borderLeftWidth: 3,
      borderLeftColor: t.accent,
    },
    featureTitle: {
      fontSize: 10,
      fontWeight: 'bold',
      color: t.text,
      marginBottom: 3,
    },
    featureDesc: {
      fontSize: 8,
      color: t.muted,
      lineHeight: 1.4,
    },
    
    // Video Link Section
    videoSection: {
      alignItems: 'center',
      marginVertical: 16,
      padding: 16,
      backgroundColor: t.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: t.accent,
    },
    videoQR: {
      width: 70,
      height: 70,
      marginBottom: 8,
    },
    videoLabel: {
      fontSize: 10,
      color: t.accent,
      fontWeight: 'bold',
    },
    videoHint: {
      fontSize: 8,
      color: t.muted,
      marginTop: 2,
    },
    
    // Footer
    footer: {
      marginTop: 'auto',
      flexDirection: 'row',
      alignItems: 'center',
      padding: 18,
      backgroundColor: t.footerBg,
      borderRadius: 10,
      gap: 16,
    },
    footerText: {
      flex: 1,
    },
    footerHeading: {
      fontSize: 15,
      fontWeight: 'bold',
      color: theme === 'elegant' || theme === 'traditional' ? '#ffffff' : t.accent,
      marginBottom: 5,
    },
    footerSubtext: {
      fontSize: 9,
      color: theme === 'elegant' || theme === 'traditional' ? '#d1d5db' : t.muted,
      lineHeight: 1.5,
    },
    footerQR: {
      width: 65,
      height: 65,
      backgroundColor: '#ffffff',
      borderRadius: 6,
      padding: 3,
    },
  });
};

interface Feature {
  title: string;
  description: string;
}

interface PitchFlyerProps {
  shopName: string;
  demoUrl: string;
  brandName: string;
  projectQRDataUrl: string;
  whatsappQRDataUrl: string;
  videoQRDataUrl?: string;
  headline?: string;
  subheadline?: string;
  features?: Feature[];
  theme?: 'dark' | 'elegant' | 'traditional' | 'modern';
}

export function PitchFlyer({
  shopName,
  brandName,
  projectQRDataUrl,
  whatsappQRDataUrl,
  videoQRDataUrl,
  headline,
  subheadline,
  features,
  theme = 'dark',
}: PitchFlyerProps) {
  const styles = createStyles(theme);
  
  const defaultFeatures: Feature[] = [
    { title: 'Lightning Fast', description: 'Loads in under 2 seconds.' },
    { title: 'SEO Optimized', description: 'Rank higher on Google.' },
    { title: 'Mobile-First', description: 'Perfect on any device.' },
    { title: 'Custom Design', description: 'Tailored to your brand.' },
  ];

  const flyerFeatures = features || defaultFeatures;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Header */}
          <View>
            <Text style={styles.brandTag}>{brandName}</Text>
            <Text style={styles.headline}>
              {headline || `I built a new digital home for ${shopName}.`}
            </Text>
            <Text style={styles.subheadline}>
              {subheadline || 'A modern, fast, and mobile-ready website designed specifically for your business. Scan the QR code to preview.'}
            </Text>
          </View>

          {/* Main QR Section */}
          <View style={styles.qrSection}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image style={styles.qrImage} src={projectQRDataUrl} />
            <Text style={styles.scanLabel}>Scan to Preview Website</Text>
            <Text style={styles.scanHint}>Point your camera at the QR code</Text>
          </View>

          {/* Video Walkthrough Section */}
          {videoQRDataUrl && (
            <View style={styles.videoSection}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image style={styles.videoQR} src={videoQRDataUrl} />
              <Text style={styles.videoLabel}>📹 Watch Video Walkthrough</Text>
              <Text style={styles.videoHint}>See the website in action</Text>
            </View>
          )}

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>&lt;2s</Text>
              <Text style={styles.statLabel}>Load Time</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>100%</Text>
              <Text style={styles.statLabel}>Mobile Ready</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>SEO</Text>
              <Text style={styles.statLabel}>Optimized</Text>
            </View>
          </View>

          {/* Features */}
          <View style={styles.featuresSection}>
            <Text style={styles.featuresTitle}>What You Get</Text>
            <View style={styles.featuresGrid}>
              {flyerFeatures.slice(0, 4).map((feature, index) => (
                <View key={index} style={styles.featureCard}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDesc}>{feature.description}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerText}>
              <Text style={styles.footerHeading}>Interested? Let's Chat</Text>
              <Text style={styles.footerSubtext}>
                Scan to message the developer anonymously via WhatsApp.
              </Text>
            </View>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image style={styles.footerQR} src={whatsappQRDataUrl} />
          </View>
        </View>
      </Page>
    </Document>
  );
}
