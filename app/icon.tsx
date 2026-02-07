import { ImageResponse } from 'next/og';

export const size = {
  width: 512,
  height: 512,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(circle at 30% 20%, #4f8cff, #1b2b55 60%, #0a0f1a 100%)',
      }}
    >
      <div
        style={{
          width: 320,
          height: 320,
          borderRadius: 96,
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,255,255,0.3))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#0a0f1a',
          fontSize: 160,
          fontWeight: 700,
          letterSpacing: -6,
        }}
      >
        HM
      </div>
    </div>,
    size,
  );
}
