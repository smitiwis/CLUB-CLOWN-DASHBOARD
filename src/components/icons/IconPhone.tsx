import React from "react";

const IconPhone = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
    >
      <style>
        {`@keyframes phone {
          0%, 100% { transform: rotate(0deg); transform-origin: 0 100%; }
          10%, 90% { transform: rotate(2deg); }
          20%, 40%, 60% { transform: rotate(-4deg); }
          30%, 50%, 70% { transform: rotate(4deg); }
          80% { transform: rotate(-2deg); }
        }`}
      </style>
      <path
        fill="#006FEE"
        d="M15.758 19a10.761 10.761 0 01-7.603-3.162A10.805 10.805 0 015 8.22c0-.854.339-1.673.941-2.277A3.21 3.21 0 018.214 5c.18-.001.36.015.537.05.172.024.34.067.503.125a.699.699 0 01.455.525l.957 4.2a.7.7 0 01-.182.644c-.09.098-.098.105-.957.553a6.93 6.93 0 003.402 3.423c.454-.868.461-.875.559-.966a.699.699 0 01.643-.182l4.191.959a.699.699 0 01.503.455A3.046 3.046 0 0119 15.829a3.223 3.223 0 01-.968 2.255 3.21 3.21 0 01-2.274.916zM8.215 6.4a1.822 1.822 0 00-1.817 1.82 9.396 9.396 0 002.744 6.63 9.36 9.36 0 006.617 2.75 1.821 1.821 0 001.817-1.82v-.231l-3.242-.75-.202.386c-.315.609-.545 1.05-1.132.812a8.276 8.276 0 01-5.016-5.047c-.251-.546.224-.798.824-1.113l.385-.189L8.444 6.4h-.23z"
        style={{
          animation: "phone 1.5s cubic-bezier(1,.01,.75,2.17) both infinite",
        }}
      />
    </svg>
  );
};

export default IconPhone;
