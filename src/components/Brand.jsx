import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X, ArrowRight, Play, HeartPulse, Check, MousePointer2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

const Brand = ({ className = '' }) => (
  <span className={`font-batang font-normal text-[1.15em] ${className}`}>
    Dance<span className="text-accent">2</span>Dance
  </span>
);

export default Brand;
