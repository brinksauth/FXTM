'use client';

import React, { useEffect, useState } from 'react';
import { privacyEventName, readPrivacyPreference } from '@/utils/privacy';

interface CountUpProps {
  end: number;
  duration?: number; // in milliseconds
  prefix?: string;
  suffix?: string;
  decimals?: number;
  bypassPrivacy?: boolean;
}

export default function CountUp({
  end,
  duration = 1000,
  prefix = '',
  suffix = '',
  decimals = 0,
  bypassPrivacy = false,
}: CountUpProps) {
  const [count, setCount] = useState(0);
  const [isPrivate, setIsPrivate] = useState(() => readPrivacyPreference());

  useEffect(() => {
    const handlePrivacyChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsPrivate(customEvent.detail);
    };

    window.addEventListener(privacyEventName, handlePrivacyChange);
    return () => window.removeEventListener(privacyEventName, handlePrivacyChange);
  }, []);

  useEffect(() => {
    let startTime: number | null = null;
    const startValue = 0;

    let frameId = 0;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing out quadratic
      const easeProgress = progress * (2 - progress);
      const currentValue = startValue + easeProgress * (end - startValue);
      
      setCount(currentValue);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [end, duration]);

  if (isPrivate && !bypassPrivacy) {
    return <span>••••</span>;
  }

  const formattedValue = count.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
}
