import React, { FC } from "react";
type Props = {
  size?: number;
  color?: string;
  className?: string;
}
const IconEye:FC<Props> = ({size, color, className}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size || 24}
      height={size || 24}
      fill="none"
      viewBox={`0 0 ${size || 24} ${size || 24}`}
      className={className}
    >
      <style>
        {`
          .eye-1 {
            animation: eye 2.4s infinite;
          }

          .eye-2 {
            animation: squeeze 2.4s infinite;
          }

          @keyframes eye {
            90% {
              transform: none;
              animation-timing-function: ease-in;
            }

            93% {
              transform: translateY(15px) scaleY(0);
            }

            100% {
              animation-timing-function: ease-out;
            }
          }

          @keyframes squeeze {
            90% {
              transform: none;
              animation-timing-function: ease-in;
            }

            93% {
              transform: translateY(3px) scaleY(0.8);
            }

            100% {
              animation-timing-function: ease-out;
            }
          }
        `}
      </style>
      <path
        className="eye-1"
        stroke={color || "#17C964"}
        strokeWidth="1.5"
        d="M19.195 11.31c.325.41.325.97 0 1.38-1.114 1.4-3.916 4.45-7.195 4.45-3.28 0-6.08-3.05-7.195-4.45a1.097 1.097 0 010-1.38C5.92 9.91 8.721 6.86 12 6.86c3.28 0 6.08 3.05 7.195 4.45z"
      />
      <circle
        className="eye-2"
        cx="12"
        cy="12"
        r="1.972"
        stroke={color || "#17C964"}
        strokeWidth="1.5"
      />
    </svg>
  );
};

export default IconEye;
