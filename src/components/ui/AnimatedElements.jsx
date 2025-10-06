import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import { useInView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';

// Fade In Animation
export const FadeIn = ({ children, delay = 0, duration = 0.5, ...props }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ delay, duration, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Slide In Animation
export const SlideIn = ({ children, direction = 'left', delay = 0, duration = 0.5, ...props }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const variants = {
    left: { x: -50 },
    right: { x: 50 },
    up: { y: 50 },
    down: { y: -50 }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...variants[direction] }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...variants[direction] }}
      transition={{ delay, duration, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Scale Animation
export const ScaleIn = ({ children, delay = 0, duration = 0.5, ...props }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ delay, duration, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Stagger Children Animation
export const StaggerChildren = ({ children, staggerDelay = 0.1, ...props }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Stagger Item
export const StaggerItem = ({ children, ...props }) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={variants} {...props}>
      {children}
    </motion.div>
  );
};

// Floating Animation
export const Float = ({ children, duration = 3, ...props }) => {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Pulse Animation
export const Pulse = ({ children, duration = 2, ...props }) => {
  return (
    <motion.div
      animate={{
        scale: [1, 1.05, 1]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Rotate Animation
export const Rotate = ({ children, duration = 2, degrees = 360, ...props }) => {
  return (
    <motion.div
      animate={{
        rotate: degrees
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'linear'
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Typewriter Effect
export const Typewriter = ({ text, delay = 0, speed = 50, ...props }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let timeout;
    const timer = setTimeout(() => {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, speed);
      
      timeout = interval;
    }, delay * 1000);

    return () => {
      clearTimeout(timer);
      if (timeout) clearInterval(timeout);
    };
  }, [text, delay, speed]);

  return <span {...props}>{displayText}</span>;
};

// Number Counter Animation
export const Counter = ({ from = 0, to, duration = 2, delay = 0, ...props }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [count, setCount] = useState(from);

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        const startTime = Date.now();
        const endTime = startTime + duration * 1000;

        const updateCount = () => {
          const now = Date.now();
          const progress = Math.min((now - startTime) / (duration * 1000), 1);
          
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          const currentCount = Math.floor(from + (to - from) * easeOutQuart);
          
          setCount(currentCount);

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            setCount(to);
          }
        };

        updateCount();
      }, delay * 1000);

      return () => clearTimeout(timer);
    }
  }, [inView, from, to, duration, delay]);

  return <span ref={ref} {...props}>{count.toLocaleString()}</span>;
};

// Parallax Scroll
export const Parallax = ({ children, offset = 50, ...props }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      style={{
        transform: `translateY(${scrollY * 0.5}px)`
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Reveal on Scroll
export const Reveal = ({ children, ...props }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, clipPath: 'inset(100% 0 0 0)' }}
      animate={inView ? { 
        opacity: 1, 
        clipPath: 'inset(0% 0 0 0)',
        transition: { duration: 0.6, ease: 'easeOut' }
      } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Bouncing Arrow
export const BouncingArrow = ({ direction = 'down', ...props }) => {
  const rotation = {
    down: 0,
    up: 180,
    left: 90,
    right: -90
  };

  return (
    <motion.div
      animate={{
        y: [0, 10, 0]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      style={{ transform: `rotate(${rotation[direction]}deg)` }}
      {...props}
    >
      <svg
        style={{ width: '24px', height: '24px' }}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </motion.div>
  );
};

// Page Transition Wrapper
export const PageTransition = ({ children, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Hover Scale Card
export const HoverCard = ({ children, scale = 1.05, ...props }) => {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Gradient Background Animation
export const AnimatedGradient = ({ colors = ['#667eea', '#764ba2'], ...props }) => {
  const gradientStyle = useSpring({
    from: { backgroundPosition: '0% 50%' },
    to: { backgroundPosition: '100% 50%' },
    config: { duration: 3000 },
    loop: { reverse: true }
  });

  return (
    <animated.div
      style={{
        ...gradientStyle,
        background: `linear-gradient(270deg, ${colors.join(', ')})`,
        backgroundSize: '200% 200%'
      }}
      {...props}
    />
  );
};

// Loading Dots
export const LoadingDots = ({ size = 8, color = 'currentColor' }) => {
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            borderRadius: '50%'
          }}
          animate={{
            y: [0, -10, 0]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.1
          }}
        />
      ))}
    </div>
  );
};

export default {
  FadeIn,
  SlideIn,
  ScaleIn,
  StaggerChildren,
  StaggerItem,
  Float,
  Pulse,
  Rotate,
  Typewriter,
  Counter,
  Parallax,
  Reveal,
  BouncingArrow,
  PageTransition,
  HoverCard,
  AnimatedGradient,
  LoadingDots
};