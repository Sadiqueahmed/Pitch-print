import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const value = searchParams.get('value');
    const size = parseInt(searchParams.get('size') || '200', 10);

    if (!value) {
      return NextResponse.json(
        { error: 'Value parameter is required' },
        { status: 400 }
      );
    }

    const dataUrl = await QRCode.toDataURL(value, {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });

    return NextResponse.json({ dataUrl });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}
