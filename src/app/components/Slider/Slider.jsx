"use client";
import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import stories from "./data";
import classes from "./Slider.module.css";

const Slider = () => {
  const activeStoryRef = useRef(0); // Using ref for the active story index
  const directionRef = useRef("next"); // Using ref for the direction
  const storyTimeoutRef = useRef(null);

  const cursorRef = useRef(null);
  const cursorTextRef = useRef(null);

  const storyDuration = 4000;

  const resetIndexHighlight = (index, currentDirection) => {
    const highlight = document.querySelectorAll(`.${classes.index} .${classes.indexHighlight}`)[index];
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
    const highlight = document.querySelectorAll(`.${classes.index} .${classes.indexHighlight}`)[index];
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
    const profileNameDiv = document.querySelector(`.${classes.profileName}`);
    const titleRows = document.querySelectorAll(`.${classes.titleRow}`);

    while (profileNameDiv.childElementCount > 2) {
      profileNameDiv.removeChild(profileNameDiv.firstChild);
    }

    titleRows.forEach((titleRow) => {
      while (titleRow.childElementCount > 2) {
        titleRow.removeChild(titleRow.firstChild);
      }
    });
  };

  const changeStory = (isAutomatic = true) => {
    const previousStory = activeStoryRef.current;
    const currentDirection = isAutomatic ? "next" : directionRef.current;

    // Calculate the new active story index
    let newActiveStory = currentDirection === "next" ? (previousStory + 1) % stories.length : (previousStory - 1 + stories.length) % stories.length;

    activeStoryRef.current = newActiveStory; // Update the ref

    const story = stories[newActiveStory];

    gsap.to(`.${classes.profileName} p`, {
      y: currentDirection === "next" ? -24 : 24,
      duration: 0.5,
      delay: 0.4,
    });
    gsap.to(`.${classes.titleRow} h1`, {
      y: currentDirection === "next" ? -48 : 48,
      duration: 0.5,
      delay: 0.4,
    });

    const currentImgContainer = document.querySelector(`.${classes.storyImg} .${classes.img}`);
    const currentImg = currentImgContainer.querySelector("img");

    setTimeout(() => {
      const newProfileName = document.createElement("p");
      newProfileName.innerText = story.profileName;
      newProfileName.style.transform = currentDirection === "next" ? "translateY(24px)" : "translateY(-24px)";

      const profileNameDiv = document.querySelector(`.${classes.profileName}`);
      profileNameDiv.appendChild(newProfileName);

      gsap.to(newProfileName, {
        y: 0,
        duration: 0.5,
        delay: 0.4,
      });

      const titleRows = document.querySelectorAll(`.${classes.titleRow}`);
      story.title.forEach((line, index) => {
        if (titleRows[index]) {
          const newTitle = document.createElement("h1");
          newTitle.innerText = line;
          newTitle.style.transform = currentDirection === "next" ? "translateY(48px)" : "translateY(-48px)";
          titleRows[index].appendChild(newTitle);

          gsap.to(newTitle, {
            y: 0,
            duration: 0.5,
            delay: 0.4,
          });
        }
      });

      const newImgContainer = document.createElement("div");
      newImgContainer.classList.add(classes.img);
      const newStoryImg = document.createElement("img");
      newStoryImg.src = story.storyImg;
      newStoryImg.alt = story.profileName;
      newImgContainer.appendChild(newStoryImg);

      const storyImgDiv = document.querySelector(`.${classes.storyImg}`);
      storyImgDiv.appendChild(newImgContainer);

      animateNewImage(newImgContainer, currentDirection);

      const upcomingImg = newStoryImg;
      animateImageScale(currentImg, upcomingImg, currentDirection);

      resetIndexHighlight(previousStory, currentDirection);
      animateIndexHighlight(newActiveStory);

      cleanUpElements();

      clearTimeout(storyTimeoutRef.current);
      storyTimeoutRef.current = setTimeout(() => changeStory(true), storyDuration);
    }, 200);

    setTimeout(() => {
      const profileImg = document.querySelector(`.${classes.profileIcon} img`);
      profileImg.src = story.profileImg;

      const link = document.querySelector(`.${classes.link} a`);
      link.textContent = story.linkLabel;
      link.href = story.linkSrc;
    }, 600);
  };

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    gsap.to(cursorRef.current, {
      x: clientX - cursorRef.current.offsetWidth / 2,
      y: clientY - cursorRef.current.offsetHeight / 2,
      ease: "power2.out",
      duration: 0.3,
    });

    const viewportWidth = window.innerWidth;
    if (clientX < viewportWidth / 2) {
      cursorTextRef.current.textContent = "Prev";
      directionRef.current = "prev";
    } else {
      cursorTextRef.current.textContent = "Next";
      directionRef.current = "next";
    }
  };

  const handleMouseClick = () => {
    clearTimeout(storyTimeoutRef.current);
    resetIndexHighlight(activeStoryRef.current, directionRef.current);
    changeStory(false); // User-initiated change, not automatic
  };

  useEffect(() => {
    const startStoryLoop = () => {
      animateIndexHighlight(activeStoryRef.current);
      storyTimeoutRef.current = setTimeout(() => changeStory(true), storyDuration);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("click", handleMouseClick);

    startStoryLoop();

    return () => {
      clearTimeout(storyTimeoutRef.current);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("click", handleMouseClick);
    };
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.cursor} ref={cursorRef}>
        <p ref={cursorTextRef}></p>
      </div>

      <div className={classes.storyImg}>
        <div className={classes.img}>
          <img src={stories[0].storyImg} alt={stories[0].profileName} />
        </div>
      </div>

      <div className={classes.storyContent}>
        <div className={classes.row}>
          <div className={classes.indices}>
            {stories.map((_, index) => (
              <div key={index} className={classes.index}>
                <div className={classes.indexHighlight}></div>
              </div>
            ))}
          </div>

          <div className={classes.profile}>
            <div className={classes.profileIcon}>
              <img src={stories[0].profileImg} alt={stories[0].profileName} />
            </div>

            <div className={classes.profileName}>
              <p>{stories[0].profileName}</p>
            </div>
          </div>
        </div>
        <div className={classes.row}>
          <div className={classes.title}>
            {stories[0].title.map((line, index) => (
              <div className={classes.titleRow} key={index}>
                <h1>{line}</h1>
              </div>
            ))}
          </div>
          <div className={classes.link}>
            <a href={stories[0].linkSrc} target='_blank' rel='noopener noreferrer'>
              {stories[0].linkLabel}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slider;
