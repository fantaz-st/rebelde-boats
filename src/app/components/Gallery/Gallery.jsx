"use client";
import React, { useRef } from "react";
import Image from "next/image";
import styles from "./Gallery.module.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(useGSAP);

const Gallery = () => {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => window.innerHeight * 4,
          scrub: true,
          pin: `.${styles.grid}`,
          anticipatePin: true,
        },
      });

      timeline.to(`.${styles.gridBlock}:not(.${styles.centerBlock})`, { duration: 0.1, autoAlpha: 1 }, 0.001).from(`.${styles.gridLayer}`, {
        scale: 3.3333,
        ease: "none",
      });
    },
    { scope: containerRef }
  );

  const imagePaths = ["/images/img1.jpg", "/images/img2.jpg", "/images/img3.jpg", "/images/img4.jpg", "/images/img5.jpg", "/images/img6.jpg", "/images/img7.jpg", "/images/img8.jpg", "/images/img9.jpg"];

  return (
    <div ref={containerRef} className={styles.container}>
      <h1 className={styles.headerSection}>Scroll </h1>
      <div className={styles.gridContainer}>
        <div className={styles.grid}>
          {imagePaths.map((src, index) => (
            <div key={index} className={`${styles.gridLayer} ${index === 3 ? styles.centerPiece : ""}`}>
              <div className={`${styles.gridBlock} ${index === 3 ? styles.centerBlock : ""}`}>
                <Image src={src} alt={`Gallery image ${index + 1}`} fill style={{ objectFit: "cover" }} className={styles.image} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <h1 className={styles.headerSection} style={{ marginTop: 0 }}>
        Some additional content
      </h1>
    </div>
  );
};

export default Gallery;
