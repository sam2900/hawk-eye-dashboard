
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface HawkAnimationProps {
  className?: string;
}

const HawkAnimation: React.FC<HawkAnimationProps> = ({ className }) => {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <motion.div
        className="absolute"
        initial={{ x: -100, y: 20 }}
        animate={{
          x: ["calc(-100%)", "calc(100%)", "calc(100%)", "calc(-100%)"],
          y: [20, -20, -20, 20],
          scaleX: [1, 1, -1, -1]
        }}
        transition={{
          duration: 20,
          times: [0, 0.5, 0.51, 1],
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg
          width="120"
          height="60"
          viewBox="0 0 120 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          <path
            d="M95.5 8.5C92.5 10.5 89.5 12.5 86.5 13C83.5 13.5 80.5 12.5 77.5 11.5C74.5 10.5 71.5 9.5 68.5 9C65.5 8.5 62.5 8.5 59.5 9C56.5 9.5 53.5 10.5 50.5 11.5C47.5 12.5 44.5 13.5 41.5 14C38.5 14.5 35.5 14.5 32.5 13C29.5 11.5 26.5 8.5 23.5 7C20.5 5.5 17.5 5.5 14.5 6C11.5 6.5 8.5 7.5 5.5 8C2.5 8.5 -0.5 8.5 -3.5 6C-6.5 3.5 -9.5 -1.5 -12.5 -1.5C-15.5 -1.5 -18.5 3.5 -21.5 7C-24.5 10.5 -27.5 12.5 -30.5 16C-33.5 19.5 -36.5 24.5 -39.5 27.5C-42.5 30.5 -45.5 31.5 -48.5 31.5C-51.5 31.5 -54.5 30.5 -54.5 30.5L104.5 30.5C104.5 30.5 107.5 27.5 104.5 25C101.5 22.5 98.5 20.5 98.5 18.5C98.5 16.5 101.5 14.5 101.5 12.5C101.5 10.5 98.5 6.5 95.5 8.5Z"
            fill="#FBB829"
          />
          <ellipse cx="77.5" cy="19" rx="2" ry="3" fill="black" />
        </svg>
      </motion.div>
      
      <div className="absolute bottom-0 left-0 right-0">
        <motion.div
          className="w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg width="100%" height="5" viewBox="0 0 100 5" preserveAspectRatio="none">
            <path
              d="M0 5 L100 5 L100 3 C80 0 20 0 0 3 Z"
              fill="#FBB829"
              fillOpacity="0.3"
            />
          </svg>
        </motion.div>
      </div>
    </div>
  );
};

export function LazyHawkAnimation(props: HawkAnimationProps) {
  const [loaded, setLoaded] = React.useState(false);

  useEffect(() => {
    // Dynamically import framer-motion
    import("framer-motion").then(() => {
      setLoaded(true);
    });
  }, []);

  if (!loaded) return <div className={props.className} />;
  return <HawkAnimation {...props} />;
}

export default LazyHawkAnimation;
