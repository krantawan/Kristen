import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

interface AnimatedStatProps {
  value: number;
  fractionDigits?: number;
}

const AnimatedStat = ({ value, fractionDigits = 0 }: AnimatedStatProps) => {
  const motionValue = useMotionValue(value);
  const spring = useSpring(motionValue, { stiffness: 100, damping: 20 });
  const display = useTransform(spring, (val) => val.toFixed(fractionDigits));

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  return <motion.span>{display}</motion.span>;
};

export default AnimatedStat;
