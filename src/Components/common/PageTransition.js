import React from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
  return React.createElement(motion.div, {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  }, children);
};

export default PageTransition; 