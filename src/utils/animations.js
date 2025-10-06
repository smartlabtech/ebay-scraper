// Animation utilities for Framer Motion and other animation libraries

export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5 }
};

export const slideIn = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { type: 'spring', stiffness: 100 }
};

export const slideUp = {
  initial: { y: 50, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.5, ease: 'easeOut' }
};

export const scaleIn = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.3 }
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const staggerItem = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 }
};

// Card hover animation
export const cardHover = {
  scale: 1.02,
  transition: { duration: 0.2 }
};

// Button tap animation
export const buttonTap = {
  scale: 0.95
};

// Modal animations
export const modalOverlay = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
};

export const modalContent = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
  transition: { type: 'spring', damping: 25, stiffness: 300 }
};

// Notification animations
export const notificationSlide = {
  initial: { x: 400, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 400, opacity: 0 },
  transition: { type: 'spring', damping: 25 }
};

// List animations
export const listItemAnimation = (index) => ({
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { delay: index * 0.05 }
});

// Skeleton loading animation
export const skeletonPulse = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

// Progress bar animation
export const progressBarFill = (progress) => ({
  initial: { width: 0 },
  animate: { width: `${progress}%` },
  transition: { duration: 0.8, ease: 'easeOut' }
});

// Counter animation helper
export const animateCounter = (start, end, duration = 1000, onUpdate) => {
  const startTime = Date.now();
  const range = end - start;

  const updateCounter = () => {
    const now = Date.now();
    const progress = Math.min((now - startTime) / duration, 1);
    
    // Easing function
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(start + range * easeOutQuart);
    
    onUpdate(current);
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  };

  requestAnimationFrame(updateCounter);
};

// Parallax effect
export const parallaxY = (offset = 100) => ({
  y: [0, offset],
  transition: { duration: 0 }
});

// Typewriter effect
export const typewriterAnimation = (text, speed = 50) => ({
  initial: { width: 0 },
  animate: { width: '100%' },
  transition: {
    duration: (text.length * speed) / 1000,
    ease: 'linear'
  }
});

// Shake animation (for errors)
export const shake = {
  animate: {
    x: [-10, 10, -10, 10, 0],
    transition: { duration: 0.4 }
  }
};

// Bounce animation
export const bounce = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 0.6,
      times: [0, 0.5, 1],
      repeat: Infinity,
      repeatDelay: 1
    }
  }
};

// Rotate animation
export const rotate360 = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};

// Flip animation
export const flipCard = {
  initial: { rotateY: 0 },
  animate: { rotateY: 180 },
  transition: { duration: 0.6 }
};

// Gradient animation
export const gradientShift = {
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};

// Custom spring presets
export const springConfig = {
  gentle: { type: 'spring', stiffness: 100, damping: 15 },
  wobbly: { type: 'spring', stiffness: 180, damping: 12 },
  stiff: { type: 'spring', stiffness: 400, damping: 40 },
  slow: { type: 'spring', stiffness: 50, damping: 20 }
};

// Animation delay helper
export const getStaggerDelay = (index, baseDelay = 0.1) => index * baseDelay;

// Stagger children animation variant
export const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Scroll-triggered animation wrapper
export const scrollAnimation = (threshold = 0.1) => ({
  viewport: { once: true, amount: threshold },
  transition: { duration: 0.6, ease: 'easeOut' }
});