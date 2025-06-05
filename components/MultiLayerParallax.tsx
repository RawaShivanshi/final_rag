import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";

export default function MultiLayerParallax() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Define scroll speeds for depth effect
  const backgroundY1 = useTransform(scrollYProgress, [0, 1], ["0%", "175%"]);
  const backgroundY2 = useTransform(scrollYProgress, [0, 1], ["0%", "125%"]);
  const backgroundY3 = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Text motion: starts slightly faded, becomes bolder on scroll
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 1], [0.5, 1]); // Starts faded, gains full opacity

  return (
    <div
      ref={ref}
      style={{
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        display: "grid",
        placeItems: "center",
        backgroundColor: "#333",
      }}
    >
      {/* Title - Visible initially but gets bolder as you scroll */}
      <motion.h1
        style={{
          y: textY,
          opacity: textOpacity,
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          color: "white",
          fontSize: "4rem",
          fontWeight: "bold",
        }}
        initial={{ opacity: 0.9 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        THE LAND BEYOND THE HIMALAYAS
      </motion.h1>

      {/* Background Layers */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          backgroundImage: `url(/slowest.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "100vw",
          height: "100vh",
          y: backgroundY3,
        }}
      />
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          backgroundImage: `url(/Shiv.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "100vw",
          height: "100vh",
          y: backgroundY2,
        }}
      />
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 20,
          backgroundImage: `url(/fastest.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "100vw",
          height: "100vh",
          y: backgroundY1,
        }}
      />
    </div>
  );
}
