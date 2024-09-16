"use client";
import styles from "./ImageSection.module.css";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(useGSAP);

export default function ImageSection() {
  const containerRef = useRef(null);
  useGSAP(
    () => {
      const image = document.querySelector(`.${styles.image3}`);

      gsap.to(image, {
        scale: 5, // Adjust the scale as needed
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "bottom bottom",
          scrub: true,
          pin: true,
          markers: true,
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section className={styles.imageSection} ref={containerRef}>
      <div className={styles.images}>
        <div className={styles.imageContainer}>
          <Image fill src='/images/img1.jpg' alt='Image 1' className={styles.image} />
        </div>
        <div className={styles.imageContainer}>
          <Image fill src='/images/img2.jpg' alt='Image 2' className={styles.image} />
        </div>

        <div className={styles.imageContainer}>
          <Image fill src='/images/img3.jpg' alt='Image 3' className={`${styles.image} ${styles.image3}`} />
        </div>

        <div className={styles.imageContainer}>
          <Image fill src='/images/img4.jpg' alt='Image 4' className={styles.image} />
        </div>
      </div>
    </section>
  );
}
