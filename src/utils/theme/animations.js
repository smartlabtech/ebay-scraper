// Animation utilities for Framer Motion and Mantine transitions
export const duration = {
  instant: 0,
  fast: 150,
  normal: 250,
  slow: 350,
  slower: 500,
  slowest: 1000
};

export const easing = {
  linear: [0, 0, 1, 1],
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  smooth: [0.25, 0.46, 0.45, 0.94]
};

// Framer Motion animation variants
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const slideDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 }
};

export const slideLeft = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

export const slideRight = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

export const scale = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
};

export const rotate = {
  initial: { opacity: 0, rotate: -10 },
  animate: { opacity: 1, rotate: 0 },
  exit: { opacity: 0, rotate: 10 }
};

// Stagger children animations
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

// Page transition animations
export const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: duration.normal / 1000,
      ease: easing.easeOut
    }
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: {
      duration: duration.fast / 1000,
      ease: easing.easeIn
    }
  }
};

// Modal animations
export const modalOverlay = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: duration.fast / 1000
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: duration.fast / 1000
    }
  }
};

export const modalContent = {
  initial: { opacity: 0, scale: 0.95, y: 10 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      duration: duration.normal / 1000,
      ease: easing.easeOut
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 10,
    transition: {
      duration: duration.fast / 1000,
      ease: easing.easeIn
    }
  }
};

// Hover animations
export const hoverScale = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 }
};

export const hoverLift = {
  whileHover: { 
    y: -4,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
  }
};

export const hoverGlow = {
  whileHover: {
    boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
  }
};

// Loading animations
export const spin = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};

export const pulse = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

export const bounce = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

// Skeleton loading animation
export const shimmer = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};

// Notification animations
export const notificationSlide = {
  initial: { x: 320, opacity: 0 },
  animate: { 
    x: 0, 
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  exit: { 
    x: 320, 
    opacity: 0,
    transition: {
      duration: duration.fast / 1000
    }
  }
};

// Mantine transition presets
export const mantineTransitions = {
  fade: {
    in: { opacity: 1 },
    out: { opacity: 0 },
    transitionProperty: 'opacity'
  },
  scale: {
    in: { opacity: 1, transform: 'scale(1)' },
    out: { opacity: 0, transform: 'scale(0.9)' },
    common: { transformOrigin: 'center' },
    transitionProperty: 'transform, opacity'
  },
  'scale-y': {
    in: { opacity: 1, transform: 'scaleY(1)' },
    out: { opacity: 0, transform: 'scaleY(0)' },
    common: { transformOrigin: 'top' },
    transitionProperty: 'transform, opacity'
  },
  'scale-x': {
    in: { opacity: 1, transform: 'scaleX(1)' },
    out: { opacity: 0, transform: 'scaleX(0)' },
    common: { transformOrigin: 'left' },
    transitionProperty: 'transform, opacity'
  },
  'slide-down': {
    in: { opacity: 1, transform: 'translateY(0)' },
    out: { opacity: 0, transform: 'translateY(-20px)' },
    transitionProperty: 'transform, opacity'
  },
  'slide-up': {
    in: { opacity: 1, transform: 'translateY(0)' },
    out: { opacity: 0, transform: 'translateY(20px)' },
    transitionProperty: 'transform, opacity'
  },
  'slide-left': {
    in: { opacity: 1, transform: 'translateX(0)' },
    out: { opacity: 0, transform: 'translateX(20px)' },
    transitionProperty: 'transform, opacity'
  },
  'slide-right': {
    in: { opacity: 1, transform: 'translateX(0)' },
    out: { opacity: 0, transform: 'translateX(-20px)' },
    transitionProperty: 'transform, opacity'
  },
  pop: {
    in: { opacity: 1, transform: 'scale(1)' },
    out: { opacity: 0, transform: 'scale(0.8)' },
    common: { transformOrigin: 'center' },
    transitionProperty: 'transform, opacity'
  }
};

// Animation helper functions
export const createTransition = (properties = 'all', options = {}) => {
  const {
    duration: dur = duration.normal,
    easing: ease = 'ease-out',
    delay = 0
  } = options;
  
  return `${properties} ${dur}ms ${ease} ${delay}ms`;
};

export const animateOnScroll = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: {
    duration: duration.normal / 1000,
    ease: easing.easeOut
  }
};

export default {
  duration,
  easing,
  fadeIn,
  slideUp,
  slideDown,
  slideLeft,
  slideRight,
  scale,
  rotate,
  staggerContainer,
  staggerItem,
  pageTransition,
  modalOverlay,
  modalContent,
  hoverScale,
  hoverLift,
  hoverGlow,
  spin,
  pulse,
  bounce,
  shimmer,
  notificationSlide,
  mantineTransitions,
  createTransition,
  animateOnScroll
};