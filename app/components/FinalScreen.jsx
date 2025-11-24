"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function FinalScreen() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function onFinal() {
      setShow(true);
    }
    window.addEventListener("bg-gradient:final", onFinal);
    return () => {
      window.removeEventListener("bg-gradient:final", onFinal);
    };
  }, []);

  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center -translate-y-6">
      <div className="flex flex-col items-center text-center px-4">
        <Image
          src="/nemo.png"
          alt="Nemo"
          width={200}
          height={200}
          priority
          className="fade-in-1s -mt-6 mb-1"
        />
        <p className="fade-in-1s text-white/90 text-[14px] sm:text-[14px] leading-snug whitespace-pre-line text-center">
          창문에 들어나는 
          당신의 틈을 보며<br />
          휴식을 느껴보세요
        </p>
      </div>
    </div>
  );
}


