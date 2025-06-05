"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./carousel.module.scss";
import Image from "next/image";
import previousDisabled from "../public/images/previous-disabled.svg";
import previousEnabled from "../public/images/previous-enabled.svg";
import nextDisabled from "../public/images/next-disabled.svg";
import nextEnabled from "../public/images/next-enabled.svg";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// Import your images
import imageOne from "../public/images/img4.jpg";
import imageTwo from "../public/images/img1.jpg";
import imageThree from "../public/images/img6.jpg";
import imageFour from "../public/images/img5.jpg";
import imageFive from "../public/images/img7.jpg";

const Carousel = () => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState("next");
  const [activeBg, setActiveBg] = useState(0);
  const [prevBg, setPrevBg] = useState(0);
  const [bgOpacity, setBgOpacity] = useState(1);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Setup scroll tracking for fade-in effect
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      let progress = 0;
      if (rect.top <= windowHeight && rect.bottom >= 0) {
        progress = Math.min(1, 1 - rect.top / windowHeight);
      } else if (rect.top <= 0) {
        progress = 1;
      }
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Transition between slides
  useEffect(() => {
    setBgOpacity(0);
    const timer = setTimeout(() => {
      setPrevBg(activeBg);
      setActiveBg(activeIndex);
      setBgOpacity(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  const handleNext = () => {
    setTransitionDirection("next");
    setActiveIndex((prevIndex) =>
      prevIndex === 4 ? prevIndex : prevIndex + 1
    );
  };

  const handlePrevious = () => {
    setTransitionDirection("previous");
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? prevIndex : prevIndex - 1
    );
  };

  const bgStyles = [
    {
      background: "linear-gradient(135deg, rgba(10, 70, 150, 0.75), rgba(10, 50, 100, 0.85))"
    },
    {
      background: "linear-gradient(135deg, rgba(40, 60, 55, 0.85), rgba(20, 40, 35, 0.95))"
    },
    {
      background: "linear-gradient(135deg, rgba(150, 75, 20, 0.75), rgba(100, 50, 20, 0.85))"
    },
    {
      background: "linear-gradient(135deg, rgb(165,178,100,0.75), rgb(165,178,100,0.85))"
    },
    {
      background: "linear-gradient(135deg, rgba(150, 70, 0, 0.75), rgba(100, 40, 0, 0.85))"
    },
    {
      background: "linear-gradient(135deg, rgba(10, 15, 74, 0.95), rgba(0, 0, 0, 0.95))"
    },
    {
      background: "linear-gradient(135deg, rgba(140, 90, 50, 0.75), rgba(100, 60, 40, 0.85))"
    }
  ];

  const borderStyles = [
    { borderColor: "#26d0a8", glowColor: "rgba(38, 208, 168, 0.5)" },
    { borderColor: "#e14444", glowColor: "rgba(225, 68, 68, 0.5)" },
    { borderColor: "#ff9d45", glowColor: "rgba(255, 157, 69, 0.5)" },
    { borderColor: "#3c90ff", glowColor: "rgba(60, 144, 255, 0.5)" },
    { borderColor: "#708C56", glowColor: "rgba(62, 179, 138, 0.5)" },
    { borderColor: "#ffb52e", glowColor: "rgba(255, 181, 46, 0.5)" },
    { borderColor: "#e9a965", glowColor: "rgba(233, 169, 101, 0.5)" }
  ];

  const texts = [
    {
      title: "Talk to the Characters",
      description:
        "What if you could speak directly to the heroes and anti-heroes of the Mahabharata? From Draupadi’s fiery courage to Karna’s tragic loyalty—chat with the icons of the epic and hear what they might say in their own words.",
    },
    {
      title: "Ancient Deities",
      description:
        "Explore the rich spiritual heritage of India through its pantheon of deities, each representing different aspects of the divine cosmic energy. From Vishnu's preservation to Shiva's transformation, these divine forms have guided seekers on the path to enlightenment for millennia.",
    },
    {
      title: "Random Shloka Generator",
      description:
        "Generate a sacred shloka from the Mahabharata, complete with its original Sanskrit and a clear explanation. Whether it's wisdom from the Bhagavad Gita or a war cry from the battlefield, feel the power of ancient verse.",
    },
    {
      title: "Mahabharata Excerpt Generator",
      description:
        "Click once and land on a powerful moment—Bhishma on his deathbed, Arjuna in moral crisis, or Krishna revealing cosmic truth. Get a random slice of the Mahabharata and uncover a story fragment that could change your perspective.",
    },
    {
      title: "Places of Power & Legend",
      description:
        "Discover the magnificent temples of India, where spiritual devotion takes physical form through intricate stone carvings and architectural brilliance. These sacred spaces were designed as bridges between worlds, where humans can commune with the divine.",
    },
    {
      title: "Natural Splendor",
      description:
        "Meet the sadhus and spiritual masters whose teachings have transformed millions of lives. These wisdom keepers maintain ancient traditions, dedicating their lives to inner knowledge and the pursuit of higher consciousness, offering guidance to all who seek deeper meaning.",
    },
    {
      title: "Wisdom Keepers",
      description:
        "Witness the vibrant colors and extraordinary beauty of India's wildlife. The majestic peacock, India's national bird, symbolizes grace, joy, and beauty. Its stunning display of feathers has inspired artists, poets, and seekers for generations.",
    },
  ];

  const images = [imageOne, imageTwo, imageThree, imageFour, imageFive];

  const textVariants = {
    hidden: {
      opacity: 0,
      y: transitionDirection === "next" ? 30 : -30,
      x: transitionDirection === "next" ? 100 : -100,
      transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] },
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: { duration: 0.7, ease: [0.43, 0.13, 0.23, 0.96], delay: 0.1 },
    },
    exit: {
      opacity: 0,
      y: transitionDirection === "next" ? -30 : 30,
      x: transitionDirection === "next" ? -100 : 100,
      transition: { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] },
    }
  };

  const textContainerVariant = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const calculateImagePosition = () => {
    const positions = [];
    for (let i = 0; i < images.length; i++) {
      const relativePosition = i - activeIndex;
      let opacity = 0;
      let x = 0;
      let scale = 1;
      let rotate = 0;
      let zIndex = 0;
      if (relativePosition >= -2 && relativePosition <= 2) {
        if (relativePosition === 0) {
          opacity = 1;
          x = 0;
          scale = 1;
          rotate = 0;
          zIndex = 10;
        } else if (relativePosition === -1) {
          opacity = 0.7;
          x = -130;
          scale = 0.85;
          rotate = 3;
          zIndex = 8;
        } else if (relativePosition === -2) {
          opacity = 0.4;
          x = -220;
          scale = 0.7;
          rotate = 6;
          zIndex = 6;
        } else if (relativePosition === 1) {
          opacity = 0.7;
          x = 130;
          scale = 0.85;
          rotate = -3;
          zIndex = 8;
        } else if (relativePosition === 2) {
          opacity = 0.4;
          x = 220;
          scale = 0.7;
          rotate = -6;
          zIndex = 6;
        }
      } else {
        opacity = 0;
        x = relativePosition < 0 ? -300 : 300;
        scale = 0.5;
        rotate = relativePosition < 0 ? 10 : -10;
        zIndex = 1;
      }
      positions.push({
        opacity,
        x,
        scale,
        rotate,
        zIndex,
        display: (relativePosition >= -2 && relativePosition <= 2) ? 'block' : 'none'
      });
    }
    return positions;
  };

  const imagePositions = calculateImagePosition();

  return (
    <div className={styles.carouselContainer} ref={sectionRef} style={{ opacity: scrollProgress }}>
      <div className={styles.backgroundTransition} style={{ ...bgStyles[prevBg] }}></div>
      <div
        className={styles.backgroundCurrent}
        style={{ ...bgStyles[activeBg], opacity: bgOpacity }}
      ></div>
      <div className={styles.spiralBackground}></div>
      <div className={styles.bgPattern}></div>
      <div className={styles.backgroundOverlay}></div>

      <AnimatePresence mode="wait">
        <motion.div
          className={styles.contentContainer}
          key={`content-${activeIndex}`}
          variants={textContainerVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className={styles.titleContainer}>
            <motion.h1 variants={textVariants}>
              {texts[activeIndex].title}
            </motion.h1>
          </div>
          <div className={styles.descriptionContainer}>
            <motion.p variants={textVariants}>
              {texts[activeIndex].description}
            </motion.p>
          </div>
          <motion.div className={styles.buttonContainer} variants={textVariants}>
            <button
              onClick={() => router.push("/mahabharata-rag")}
              className={styles.discoverMoreButton}
            >
              Discover More
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className={styles.imagesContainer}>
        {images.map((image, index) => {
          const position = imagePositions[index];
          const borderStyle = borderStyles[index];
          return (
            <motion.div
              key={`slide-${index}`}
              className={`${styles.slideContainer}`}
              initial={false}
              animate={{
                opacity: position.opacity,
                x: position.x,
                scale: position.scale,
                rotate: position.rotate,
                zIndex: position.zIndex
              }}
              transition={{
                duration: 0.65,
                ease: [0.25, 0.1, 0.25, 1.0],
                opacity: { duration: 0.5 }
              }}
              style={{ display: position.display }}
            >
              <div
                className={styles.slideImageWrapper}
                style={{
                  borderColor: index === activeIndex ? borderStyle.borderColor : 'rgba(255,255,255,0.3)',
                  boxShadow: index === activeIndex ? `0 0 20px ${borderStyle.glowColor}, inset 0 0 10px ${borderStyle.glowColor}` : 'none'
                }}
              >
                <div className={styles.slideOverlay} style={{ opacity: index === activeIndex ? 0 : 0.4 }}></div>
                <Image
                  className={styles.slideImage}
                  alt={`${texts[index].title} image`}
                  src={image}
                  width={500}
                  height={300}
                  priority={index <= 2}
                />
                {index === activeIndex && (
                  <motion.div
                    className={styles.cardDecoration}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <div className={styles.cornerTopLeft} style={{ borderColor: borderStyle.borderColor }}></div>
                    <div className={styles.cornerTopRight} style={{ borderColor: borderStyle.borderColor }}></div>
                    <div className={styles.cornerBottomLeft} style={{ borderColor: borderStyle.borderColor }}></div>
                    <div className={styles.cornerBottomRight} style={{ borderColor: borderStyle.borderColor }}></div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}

        <div className={styles.controls}>
          <button
            className={activeIndex !== 0 ? `${styles.previousContainer}` : `${styles.disabled}`}
            onClick={handlePrevious}
            disabled={activeIndex === 0}
          >
            <Image
              src={activeIndex !== 0 ? previousEnabled : previousDisabled}
              alt="previous icon"
              className={styles.previous}
            />
          </button>
          <div className={styles.pagination}>
            {images.map((_, index) => (
              <div
                key={`dot-${index}`}
                className={`${styles.paginationDot} ${index === activeIndex ? styles.activeDot : ''}`}
                style={{ backgroundColor: index === activeIndex ? borderStyles[index].borderColor : 'rgba(255,255,255,0.3)' }}
              />
            ))}
          </div>
          <button
            className={activeIndex !== 6 ? `${styles.nextContainer}` : `${styles.disabled}`}
            onClick={handleNext}
            disabled={activeIndex === 6}
          >
            <Image
              src={activeIndex !== 6 ? nextEnabled : nextDisabled}
              alt="next icon"
              className={styles.next}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
