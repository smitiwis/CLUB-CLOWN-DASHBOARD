import React from "react";

const IconTrash = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
    >
      <style>
        {`@keyframes rotate-tr {
          0% { transform: rotate(0); }
          100% { transform: rotate(20deg); }
        }`}
      </style>
      <path
        fill="#F54180"
        d="M16.773 10.083a.75.75 0 00-1.49-.166l1.49.166zm-1.535 7.027l.745.083-.745-.083zm-6.198 0l-.745.083.745-.083zm-.045-7.193a.75.75 0 00-1.49.166l1.49-.166zm5.249 7.333h-4.21v1.5h4.21v-1.5zm1.038-7.333l-.79 7.11 1.491.166.79-7.11-1.49-.166zm-5.497 7.11l-.79-7.11-1.49.166.79 7.11 1.49-.165zm.249.223a.25.25 0 01-.249-.222l-1.49.165a1.75 1.75 0 001.739 1.557v-1.5zm4.21 1.5c.892 0 1.64-.67 1.74-1.557l-1.492-.165a.25.25 0 01-.248.222v1.5z"
      />
      <path
        fill="#F54180"
        fillRule="evenodd"
        d="M11 6a1 1 0 00-1 1v.25H7a.75.75 0 000 1.5h10a.75.75 0 000-1.5h-3V7a1 1 0 00-1-1h-2z"
        clipRule="evenodd"
        style={{
          animation: "rotate-tr 1s cubic-bezier(1,-.28,.01,1.13) infinite alternate-reverse both",
          transformOrigin: "right center",
        }}
      />
    </svg>
  );
};

export default IconTrash;