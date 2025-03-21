import React, { FC } from "react";

const EyeOffIcon: FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <style>
        {`
          .eye-off {
            animation: eye-off 2s infinite cubic-bezier(0.99, -0.1, 0.01, 1.02) alternate;
            stroke-dashoffset: 100;
            stroke-dasharray: 100;
          }

          @keyframes eye-off {
            to {
              stroke-dashoffset: 0;
            }
          }
        `}
      </style>
      <path
        stroke="#17C964"
        strokeWidth="1.5"
        d="M19.195 11.31c.325.41.325.97 0 1.38-1.114 1.4-3.916 4.45-7.195 4.45-3.28 0-6.08-3.05-7.195-4.45a1.097 1.097 0 010-1.38C5.92 9.91 8.721 6.86 12 6.86c3.28 0 6.08 3.05 7.195 4.45z"
      />
      <circle cx="12" cy="12" r="1.972" stroke="#17C964" strokeWidth="1.5" />
      <path
        className="eye-off"
        stroke="#17C964"
        strokeLinecap="round"
        strokeWidth="1.5"
        d="M18.514 5.487L5.487 18.514"
      />
    </svg>
  );
};

export default EyeOffIcon;
