"use client";
const Loader = ({ data = "Summarising" }) => {
  const text = data;

  return (
    <div className="loader-wrapper">
      <div className="flex z-10">
        {text.split("").map((char, i) => (
          <span
            key={i}
            className="loader-letter"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {char}
          </span>
        ))}
      </div>

      <div className="loader-circle" />

      <style jsx>{`
        .loader-wrapper {
          position: relative;
          width: 250px;
          height: 250px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: Inter, sans-serif;
          font-size: 1.1rem;
          font-weight: 300;
          color: #e2e8f0; /* matches your page text */
          user-select: none;
        }

        .loader-circle {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          animation: rotate 2s linear infinite;
        }

        .loader-letter {
          opacity: 0.4;
          animation: pulse 2s infinite;
          text-shadow: 0 0 12px rgba(0, 229, 255, 0.5); /* cyan glow to match theme */
        }

        @keyframes rotate {
          0% {
            transform: rotate(90deg);
            box-shadow:
              0 10px 20px #00E5FF inset,   /* cyan */
              0 20px 30px #6366F1 inset,   /* indigo */
              0 60px 60px #A855F7 inset;   /* purple */
          }

          50% {
            transform: rotate(270deg);
            box-shadow:
              0 10px 20px #22D3EE inset,   /* lighter cyan */
              0 20px 10px #818CF8 inset,   /* lighter indigo */
              0 40px 60px #C084FC inset;   /* lighter purple */
          }

          100% {
            transform: rotate(450deg);
            box-shadow:
              0 10px 20px #00E5FF inset,
              0 20px 30px #6366F1 inset,
              0 60px 60px #A855F7 inset;
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.4;
            transform: translateY(0);
          }

          25% {
            opacity: 1;
            transform: scale(1.15);
            color: #00E5FF; /* pulse to cyan accent */
          }

          50% {
            opacity: 0.7;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;