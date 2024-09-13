"use client";
import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import stories from "./data";
import classes from "./Hero.module.css";

const Hero = () => {
  const activeStoryRef = useRef(0);
  const directionRef = useRef("next");
  const storyDuration = 4000; // Duration of each story
  const contentUpdateDelay = 0; // Delay before content updates
  const storyTimeoutRef = useRef(null);

  const containerRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorTextRef = useRef(null);
  const profileNameRef = useRef(null);
  const titleRowsRef = useRef([]);
  const imgContainerRef = useRef(null);
  const indicesRef = useRef([]);
  const profileIconRef = useRef(null);
  const linkRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;
      gsap.to(cursorRef.current, {
        x: clientX - cursorRef.current.offsetWidth / 2,
        y: clientY - cursorRef.current.offsetHeight / 2,
        ease: "power2.out",
        duration: 0.3,
      });

      cursorTextRef.current.textContent = clientX < window.innerWidth / 2 ? "Prev" : "Next";
    };

    const handleClick = (event) => {
      clearTimeout(storyTimeoutRef.current);
      directionRef.current = event.clientX < window.innerWidth / 2 ? "prev" : "next";
      changeStory(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("click", handleClick);

    animateIndexHighlight(activeStoryRef.current);
    storyTimeoutRef.current = setTimeout(() => changeStory(true), storyDuration);

    return () => {
      clearTimeout(storyTimeoutRef.current);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const resetIndexHighlight = (index, currentDirection) => {
    const highlight = indicesRef.current[index];
    if (!highlight) return;

    gsap.killTweensOf(highlight);
    gsap.to(highlight, {
      width: currentDirection === "next" ? "100%" : "0%",
      duration: 0.3,
      onStart: () => {
        gsap.to(highlight, {
          transformOrigin: "right center",
          scaleX: 0,
          duration: 0.3,
        });
      },
    });
  };

  const animateIndexHighlight = (index) => {
    const highlight = indicesRef.current[index];
    if (!highlight) return;

    gsap.set(highlight, {
      width: "0%",
      scaleX: 1,
      transformOrigin: "right center",
    });
    gsap.to(highlight, {
      width: "100%",
      duration: storyDuration / 1000,
      ease: "none",
    });
  };

  const animateNewImage = (imgContainer, currentDirection) => {
    gsap.set(imgContainer, {
      clipPath: currentDirection === "next" ? "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)" : "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
    });
    gsap.to(imgContainer, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 1,
      ease: "power4.inOut",
    });
  };

  const animateImageScale = (currentImg, upcomingImg, currentDirection) => {
    gsap.fromTo(
      currentImg,
      { scale: 1, rotate: 0 },
      {
        scale: 2,
        rotate: currentDirection === "next" ? -25 : 25,
        duration: 1,
        ease: "power4.inOut",
        onComplete: () => {
          currentImg.parentElement.remove();
        },
      }
    );
    gsap.fromTo(upcomingImg, { scale: 2, rotate: currentDirection === "next" ? 25 : -25 }, { scale: 1, rotate: 0, duration: 1, ease: "power4.inOut" });
  };

  const cleanUpElements = () => {
    while (profileNameRef.current.childElementCount > 1) {
      profileNameRef.current.removeChild(profileNameRef.current.firstChild);
    }

    titleRowsRef.current.forEach((titleRow) => {
      while (titleRow.childElementCount > 1) {
        titleRow.removeChild(titleRow.firstChild);
      }
    });
  };

  const changeStory = (isAutomatic = true) => {
    const previousStory = activeStoryRef.current;
    const currentDirection = isAutomatic ? "next" : directionRef.current;

    activeStoryRef.current = currentDirection === "next" ? (activeStoryRef.current + 1) % stories.length : (activeStoryRef.current - 1 + stories.length) % stories.length;

    const story = stories[activeStoryRef.current];

    // Animate out current titles
    gsap.to(
      titleRowsRef.current.map((row) => row.querySelector("h1")),
      {
        y: currentDirection === "next" ? -48 : 48,
        duration: 0.5,
        delay: contentUpdateDelay,
        onComplete: () => {
          // Clean up old titles
          titleRowsRef.current.forEach((titleRow) => {
            while (titleRow.firstChild) {
              titleRow.removeChild(titleRow.firstChild);
            }
          });

          // Animate in new titles
          story.title.forEach((line, index) => {
            if (titleRowsRef.current[index]) {
              const newTitle = document.createElement("h1");
              newTitle.innerText = line;
              newTitle.style.transform = currentDirection === "next" ? "translateY(48px)" : "translateY(-48px)";
              titleRowsRef.current[index].appendChild(newTitle);

              gsap.to(newTitle, {
                y: 0,
                duration: 0.5,
                delay: contentUpdateDelay,
              });
            }
          });
        },
      }
    );

    // Animate profile name out
    gsap.to(profileNameRef.current.querySelector("p"), {
      y: currentDirection === "next" ? -24 : 24,
      duration: 0.5,
      delay: contentUpdateDelay,
      onComplete: () => {
        // Animate profile name in
        const newProfileName = document.createElement("p");
        newProfileName.innerText = story.profileName;
        newProfileName.style.transform = currentDirection === "next" ? "translateY(24px)" : "translateY(-24px)";
        profileNameRef.current.appendChild(newProfileName);

        gsap.to(newProfileName, {
          y: 0,
          duration: 0.5,
          delay: contentUpdateDelay,
        });
      },
    });

    // Handle image transition
    const currentImgContainer = imgContainerRef.current.querySelector(`.${classes.img}`);
    const currentImg = currentImgContainer.querySelector("img");

    setTimeout(() => {
      const newImgContainer = document.createElement("div");
      newImgContainer.classList.add(classes.img);
      const newStoryImg = document.createElement("img");
      newStoryImg.src = story.storyImg;
      newStoryImg.alt = story.profileName;
      newImgContainer.appendChild(newStoryImg);
      imgContainerRef.current.appendChild(newImgContainer);

      animateNewImage(newImgContainer, currentDirection);
      animateImageScale(currentImg, newStoryImg, currentDirection);

      resetIndexHighlight(previousStory, currentDirection);
      animateIndexHighlight(activeStoryRef.current);

      clearTimeout(storyTimeoutRef.current);
      storyTimeoutRef.current = setTimeout(() => changeStory(true), storyDuration);
    }, 200);

    setTimeout(() => {
      profileIconRef.current.src = story.profileImg;
      linkRef.current.textContent = story.linkLabel;
      linkRef.current.href = story.linkSrc;
    }, 600);
  };

  return (
    <div className={classes.container} ref={containerRef}>
      <div className={classes.cursor} ref={cursorRef}>
        <p ref={cursorTextRef}></p>
      </div>

      <div className={classes.storyImg} ref={imgContainerRef}>
        <div className={classes.img}>
          <img src={stories[activeStoryRef.current].storyImg} alt='' />
        </div>
      </div>

      <div className={classes.storyContent}>
        <div className={classes.row}>
          <div className={classes.indices}>
            {stories.map((_, index) => (
              <div className={classes.index} key={index}>
                <div className={classes.indexHighlight} ref={(el) => (indicesRef.current[index] = el)}></div>
              </div>
            ))}
          </div>

          <div className={classes.profile}>
            <div className={classes.profileIcon}>
              <img src={stories[activeStoryRef.current].profileImg} alt='' ref={profileIconRef} />
            </div>
            <div className={classes.profileName} ref={profileNameRef}>
              <p>{stories[activeStoryRef.current].profileName}</p>
            </div>
          </div>
        </div>

        <div className={classes.row}>
          <div className={classes.title}>
            {stories[activeStoryRef.current].title.map((line, index) => (
              <div className={classes.titleRow} key={index} ref={(el) => (titleRowsRef.current[index] = el)}>
                <h1>{line}</h1>
              </div>
            ))}
          </div>

          <div className={classes.link}>
            <a href={stories[activeStoryRef.current].linkSrc} target='_blank' rel='noopener noreferrer' ref={linkRef}>
              {stories[activeStoryRef.current].linkLabel}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
