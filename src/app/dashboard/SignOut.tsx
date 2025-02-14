"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

const SignOut = () => {
  useEffect(() => {
    signOut();
  }, []);

  return <></>;
};

export default SignOut;
