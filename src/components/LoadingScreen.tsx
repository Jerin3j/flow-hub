import { useEffect } from "react";

type LoadingScreenProps = { onComplete: () => void };

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  useEffect(() => {
    setTimeout(() => {
      onComplete();
    }, 1000);
  }, [onComplete]);

  return (
    <div className="flex h-screen w-full justify-center items-center">
      <h1 className="font-jolly text-9xl text-center bg-gradient-to-r from-blue-500 via-purple-500 to-rose-500 bg-clip-text text-transparent animate-[gradient_1s_linear] transition-none ease-out tracking-widest">
        FlowHub
      </h1>
    </div>
  );
};
