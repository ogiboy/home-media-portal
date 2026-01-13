import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 30% 20%, #4f8cff, #1b2b55 60%, #0a0f1a 100%)',
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 36,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.3))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0a0f1a',
            fontSize: 60,
            fontWeight: 700,
            letterSpacing: -2,
          }}
        >
          HM
        </div>
      </div>
    ),
    size
  );
}
