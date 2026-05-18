import React from "react";
import styled from "styled-components";

const Button = () => {
  return (
    <StyledWrapper>
      <button className="pb-ai-button">
        <span className="pb-ai-text">Summarise AI</span>

        <span className="pb-ai-sparkle">
          <span className="spark sparkle-1">✦</span>
          <span className="spark sparkle-2">✧</span>
          <span className="spark sparkle-3">✦</span>
        </span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .pb-ai-button,
  .pb-ai-button * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Outfit", sans-serif;
  }

  .pb-ai-button {
    position: relative;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 12px;

    border: none;
    outline: none;
    cursor: pointer;

    padding: 18px 72px;
    border-radius: 999px;

    color: #fff;
    font-size: 20px;
    font-weight: 500;
    letter-spacing: -0.4px;

    background: linear-gradient(
      180deg,
      #a67dff 0%,
      #7a45ff 45%,
      #5d24ff 100%
    );

    box-shadow:
      0 0 0 6px rgba(125, 71, 255, 0.12),
      0 10px 30px rgba(98, 43, 255, 0.35),
      inset 0 2px 10px rgba(255, 255, 255, 0.22);

    overflow: hidden;
    isolation: isolate;

    transform: translate3d(0, 0, 0);
    will-change: transform, box-shadow;

    transition:
      transform 650ms cubic-bezier(0.22, 1, 0.36, 1),
      box-shadow 650ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  /* glossy top layer */
  .pb-ai-button::before {
    content: "";
    position: absolute;
    inset: 2px;
    border-radius: inherit;

    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.22),
      rgba(255, 255, 255, 0.05) 45%,
      rgba(255, 255, 255, 0)
    );

    z-index: 1;
    pointer-events: none;
  }

  /* grain + glow */
  .pb-ai-button::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;

    background-image:
      radial-gradient(
        circle at bottom center,
        rgba(255, 255, 255, 0.42) 0%,
        rgba(255, 255, 255, 0.18) 18%,
        rgba(255, 255, 255, 0.06) 35%,
        transparent 65%
      ),
      radial-gradient(rgba(255, 255, 255, 0.14) 0.8px, transparent 0.8px),
      radial-gradient(rgba(255, 255, 255, 0.08) 0.5px, transparent 0.5px),
      radial-gradient(rgba(0, 0, 0, 0.08) 0.7px, transparent 0.7px);

    background-size:
      100% 100%,
      4px 4px,
      7px 7px,
      5px 5px;

    background-position:
      center,
      0 0,
      2px 2px,
      1px 3px;

    opacity: 0.55;
    mix-blend-mode: overlay;

    z-index: 2;
    pointer-events: none;
  }

  .pb-ai-text {
    position: relative;
    z-index: 3;
  }

  /* sparkle wrapper */
  .pb-ai-sparkle {
    position: relative;

    width: 26px;
    height: 26px;

    display: flex;
    align-items: center;
    justify-content: center;

    z-index: 3;
  }

  .spark {
    position: absolute;

    color: rgba(255, 255, 255, 0.95);

    text-shadow:
      0 0 8px rgba(255, 255, 255, 0.9),
      0 0 18px rgba(196, 181, 253, 0.8),
      0 0 30px rgba(167, 139, 250, 0.65);

    animation: sparkleFloat 3s ease-in-out infinite;

    will-change: transform, opacity;
  }

  /* main star */
  .sparkle-1 {
    font-size: 18px;
    animation-delay: 0s;
  }

  /* top right */
  .sparkle-2 {
    font-size: 11px;

    top: -2px;
    right: -4px;

    opacity: 0.85;

    animation-delay: 0.8s;
  }

  /* bottom left */
  .sparkle-3 {
    font-size: 10px;

    bottom: -3px;
    left: -4px;

    opacity: 0.75;

    animation-delay: 1.5s;
  }

  .pb-ai-button:hover {
    transform: translate3d(0, -2px, 0) scale(1.035);

    box-shadow:
      0 0 0 10px rgba(125, 71, 255, 0.16),
      0 18px 48px rgba(98, 43, 255, 0.42),
      inset 0 2px 10px rgba(255, 255, 255, 0.28);
  }

  .pb-ai-button:hover .sparkle-1 {
    transform: scale(1.18) rotate(12deg);
  }

  .pb-ai-button:hover .sparkle-2 {
    transform: translate(2px, -2px) scale(1.15);
  }

  .pb-ai-button:hover .sparkle-3 {
    transform: translate(-2px, 2px) scale(1.12);
  }

  .pb-ai-button:active {
    transition-duration: 120ms;
    transform: scale(0.985);
  }

  @keyframes sparkleFloat {
    0% {
      transform: translateY(0px) scale(1);
      opacity: 0.75;
    }

    25% {
      transform: translateY(-2px) scale(1.08);
      opacity: 1;
    }

    50% {
      transform: translateY(1px) scale(0.96);
      opacity: 0.82;
    }

    75% {
      transform: translateY(-1px) scale(1.04);
      opacity: 1;
    }

    100% {
      transform: translateY(0px) scale(1);
      opacity: 0.75;
    }
  }
`;

export default Button;