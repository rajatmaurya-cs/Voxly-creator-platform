import React from "react";

const EditorLoader = ({ size = 100, border = 10 }) => {
  return (
    <>
      <div
        aria-live="assertive"
        role="alert"
        className="editor-loader"
        style={{
          "--size": `${size}px`,
          "--border": `${border}px`,
        }}
      />

      <style jsx>{`
        .editor-loader {
          --hue: 210;
          --speed: 1s;
          --blur: var(--border);

          width: var(--border);
          aspect-ratio: 1;
          background: white;
          border-radius: 50%;
          position: absolute;

          --y: calc(
            (var(--size) * -0.5) + (var(--border) * 0.5)
          );

          transform: rotate(0deg) translateY(var(--y));
          animation: spin var(--speed) linear infinite;
        }

        .editor-loader::before {
          content: "";
          position: absolute;
          inset: calc(var(--border) * -0.5);
          border-radius: 50%;
          background: white;
          filter: blur(var(--blur));
          z-index: -1;
        }

        .editor-loader::after {
          content: "";
          width: var(--size);
          aspect-ratio: 1;
          position: absolute;
          top: 0;
          left: 50%;
          translate: -50% 0;

          background: conic-gradient(
            white,
            hsl(var(--hue), 100%, 70%),
            hsl(var(--hue), 100%, 10%),
            transparent 65%
          );

          border-radius: 50%;

          mask: radial-gradient(
            transparent calc(
              ((var(--size) * 0.5) - var(--border)) - 1px
            ),
            white calc(
              (var(--size) * 0.5) - var(--border)
            )
          );
        }

        @keyframes spin {
          to {
            transform: rotate(-360deg) translateY(var(--y));
          }
        }
      `}</style>
    </>
  );
};

export default React.memo(EditorLoader);