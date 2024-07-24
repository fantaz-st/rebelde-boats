"use client";
import React, { useRef, useEffect } from "react";
import classes from "./Hero.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const sliderRef = useRef(null);
  const sliderWrapperRef = useRef(null);
  const slidesRef = useRef([]);
  const containerRef = useRef([]);

  useGSAP(
    () => {
      const sliderWrapper = sliderWrapperRef.current;
      const slides = slidesRef.current;

      const updateScaleAndPosition = () => {
        slides.forEach((slide) => {
          const rect = slide.getBoundingClientRect();
          const centerPosition = (rect.left + rect.right) / 2;
          const distanceFromCenter = centerPosition - window.innerWidth / 2;

          let scale, offsetX;
          if (distanceFromCenter > 0) {
            scale = Math.min(1.75, 1 + distanceFromCenter / window.innerWidth);
            offsetX = (scale - 1) * 400;
          } else {
            scale = Math.max(0.5, 1 - Math.abs(distanceFromCenter) / window.innerWidth);
            offsetX = 0;
          }

          gsap.set(slide, { scale: scale, x: offsetX });
        });
      };

      const update = (scrollPos) => {
        gsap.set(sliderWrapper, { x: -scrollPos });
        updateScaleAndPosition();
      };

      const maxScroll = sliderWrapper.offsetWidth - window.innerWidth;

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: () => `+=${maxScroll}`,
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          update(self.scroll());
        },
      });

      // update scale and position of slides
      updateScaleAndPosition();

      // cleanup
      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: containerRef }
  );

  return (
    <div className={classes.container} ref={containerRef}>
      <div className={classes.sidebar}>
        <div className={classes.sidebarItem}>
          <h1 id='header' className={classes.title}>
            REBELDE
            <br />
            BOATS
          </h1>
          <p>
            Lorem ipsum dolor <br />
            (sit amet)
          </p>
        </div>
      </div>

      <div className={classes.slider} ref={sliderRef}>
        <div className={classes.sliderWrapper} ref={sliderWrapperRef}>
          {Array.from({ length: 14 }).map((_, index) => (
            <div className={classes.slide} ref={(el) => (slidesRef.current[index] = el)} key={index}>
              {index < 13 ? (
                // <Image src={`./images/img${index + 1}.jpg`} alt='' className={classes.img} alt="rebelde boats tours"
                <img src={`./images/img${index + 1}.jpg`} alt='rebelde boats tours' className={classes.img} />
              ) : (
                <>
                  <h1>Looking to embark on an unforgettable adventure?</h1>
                  <p>If you love our boat and want to rent it, we&apos;d be thrilled to make your dream getaway a reality. Don&apos;t hesitate to contact us for more details or to book your perfect trip on the water. Let&apos;s create amazing memories together!</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={classes.scrollDown}>Keep scrolling</div>
    </div>
  );
};

export default Hero;
