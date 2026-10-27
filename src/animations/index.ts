'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export * from './motion';
export * from './reveal';
export * from './text';
export * from './parallax';
export * from './marquee';
export * from './media';
export * from './pin';
export * from './pointer';
export { BREAKPOINT_QUERY, POINTER_QUERY } from './config';
export { gsap, ScrollTrigger, SplitText };
