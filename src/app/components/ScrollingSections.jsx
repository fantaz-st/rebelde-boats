"use client";
import { useRef, useEffect } from "react";
import classes from "./ScrollingSections.module.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollingSections() {
  const containerRef = useRef(null);
  const flexboxRef = useRef(null);
  const thirdImageRef = useRef(null);

  useEffect(() => {
    if (flexboxRef.current && thirdImageRef.current) {
      const thirdItem = thirdImageRef.current.getBoundingClientRect();
      const flexbox = flexboxRef.current.getBoundingClientRect();

      // Calculate the center position of the third item relative to the flexbox
      const originX = ((thirdItem.left - flexbox.left + thirdItem.width / 2) / flexbox.width) * 100;
      const originY = ((thirdItem.top - flexbox.top + thirdItem.height / 2) / flexbox.height) * 100;

      // Set the transform-origin of the flexbox to start scaling from the third item
      flexboxRef.current.style.transformOrigin = `${originX}% ${originY}%`;
    }
  }, []);

  useGSAP(
    () => {
      const panels = gsap.utils.toArray(`.${classes.panel}`);

      // ScrollTrigger for growing the flexbox starting from the third item
      ScrollTrigger.create({
        trigger: flexboxRef.current,
        start: "top center",
        end: "+=300", // Adjust this value based on the scroll distance needed
        scrub: true,
        onUpdate: (self) => {
          const scale = 1 + self.progress * 4; // Adjust scale factor as needed
          gsap.to(flexboxRef.current, { scale: scale, overwrite: true });
        },
      });

      panels.forEach((panel) => {
        const text = panel.querySelector("p");

        ScrollTrigger.create({
          trigger: panel,
          start: "top center",
          end: "bottom-=120 center",
          pin: text,
          pinSpacing: true,
          scrub: true,
        });

        ScrollTrigger.create({
          trigger: panel,
          start: "bottom-=240 center",
          end: "bottom-=120 center",
          scrub: true,
          onUpdate: (self) => {
            const opacity = 1 - self.progress;
            gsap.to(text, { opacity: opacity, overwrite: true });
          },
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={classes.container}>
      <div ref={flexboxRef} className={classes.flexbox}>
        <div className={classes.flexItem}>
          <Image src='/images/img3.jpg' alt='' width={200} height={200} />
        </div>
        <div className={classes.flexItem}>
          <Image src='/images/img2.jpg' alt='' width={200} height={200} />
        </div>
        <div className={classes.flexItem} ref={thirdImageRef}>
          <Image src='/images/img1.jpg' alt='' width={200} height={200} />
        </div>
        <div className={classes.flexItem}>
          <Image src='/images/img4.jpg' alt='' width={200} height={200} />
        </div>
      </div>
      <div className={classes.panels}>
        <div className={classes.panel}>
          <p>Something nice 1</p>
          <div className={classes.imageContainer}>
            <Image src='/images/img1.jpg' alt='' fill style={{ objectFit: "cover" }} />
          </div>
        </div>
        <div className={classes.panel}>
          <p>Something nice 2</p>
          <div className={classes.imageContainer}>
            <Image src='/images/img2.jpg' alt='' fill style={{ objectFit: "cover" }} />
          </div>
        </div>
        <div className={classes.panel}>
          <p>Something nice 3</p>
          <div className={classes.imageContainer}>
            <Image src='/images/img3.jpg' alt='' fill style={{ objectFit: "cover" }} />
          </div>
        </div>
        <div className={classes.panel}>
          <p>Something nice 4</p>
          <div className={classes.imageContainer}>
            <Image src='/images/img4.jpg' alt='' fill style={{ objectFit: "cover" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
