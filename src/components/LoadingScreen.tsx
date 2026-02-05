import React, { useEffect, useState } from 'react';
import { GridScan } from './animations/GridScan';
import ASCIIText from './animations/ASCIIText';

interface LoadingScreenProps {
  onComplete: () => void;
  duration?: number;
  fadeOutDuration?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  duration = 5000,
  fadeOutDuration = 1000
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      const fadeTimer = setTimeout(() => {
        onComplete();
      }, fadeOutDuration);
      return () => clearTimeout(fadeTimer);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, fadeOutDuration, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-black transition-opacity ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        transitionDuration: `${fadeOutDuration}ms`,
        pointerEvents: isFadingOut ? 'none' : 'auto'
      }}
    >
      <GridScan
        sensitivity={0.55}
        lineThickness={1}
        linesColor="#392e4e"
        gridScale={0.1}
        scanColor="#FF9FFC"
        scanOpacity={0.4}
        enablePost={true}
        bloomIntensity={0.6}
        chromaticAberration={0.002}
        noiseIntensity={0.01}
        scanDirection="pingpong"
        scanDuration={2.0}
        scanDelay={0.5}
        scanGlow={0.8}
        scanSoftness={1.5}
      />
      <div className={`absolute inset-0 transition-opacity ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}
        style={{
          transitionDuration: `${fadeOutDuration}ms`,
          pointerEvents: 'none',
          zIndex: 40
        }}>
        <ASCIIText
          text="Hey!"
          enableWaves={true}
          asciiFontSize={8}
          textFontSize={80}
          textColor="#fdf9f3"
          planeBaseHeight={4}
        />
      </div>
    </div>
  );
};
