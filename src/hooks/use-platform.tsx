
import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';

export function usePlatformInfo() {
  const [platform, setPlatform] = useState({
    isNative: false,
    isIOS: false,
    isAndroid: false,
    isMobile: false,
  });

  useEffect(() => {
    const checkPlatform = () => {
      const isNative = Capacitor.isNativePlatform();
      const isIOS = isNative && Capacitor.getPlatform() === 'ios';
      const isAndroid = isNative && Capacitor.getPlatform() === 'android';
      
      // Verifica se é mobile (nativo ou via user agent)
      const isMobile = isNative || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth < 768;
      
      setPlatform({
        isNative,
        isIOS,
        isAndroid,
        isMobile
      });
    };
    
    checkPlatform();
    
    window.addEventListener('resize', checkPlatform);
    return () => window.removeEventListener('resize', checkPlatform);
  }, []);
  
  return platform;
}
