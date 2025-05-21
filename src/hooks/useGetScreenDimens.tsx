import { useEffect, useState } from "react";

export const useGetScreenDimens = () => {
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [screenHeight, setScreenHeight] = useState<number>(window.innerHeight);

  const getDimens = () => {
    setScreenWidth(window.innerWidth);
    setScreenHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener("resize", getDimens);

    return () => window.removeEventListener("resize", getDimens);
  }, []);

  return { screenWidth, screenHeight };
};
