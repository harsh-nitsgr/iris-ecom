'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

export default function PaperPlane() {
  const { scrollYProgress } = useScroll();
  
  // The plane moves in a zig-zag down the screen based on overall page scroll
  const x = useTransform(scrollYProgress, 
    [0, 0.2, 0.4, 0.6, 0.8, 1], 
    ['10vw', '80vw', '10vw', '80vw', '10vw', '50vw']
  );
  
  const y = useTransform(scrollYProgress,
    [0, 1],
    ['10vh', '90vh']
  );

  const rotate = useTransform(scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [45, -45, 45, -45, 45, 0]
  );

  return (
    <motion.div 
      className="fixed z-50 pointer-events-none text-gray-900 mix-blend-difference hidden md:block"
      style={{ x, y, rotate }}
    >
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 2L11 13" />
        <path d="M22 2L15 22L11 13L2 9L22 2Z" />
      </svg>
    </motion.div>
  );
}
