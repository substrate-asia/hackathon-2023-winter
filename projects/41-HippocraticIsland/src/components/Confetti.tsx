import { useMemo, useState } from 'react';
import Confetti from 'react-confetti';
import React, { useRef, useEffect } from 'react'

function useMouse() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX + window.pageXOffset, y: e.clientY + window.pageYOffset });
    };

    window.addEventListener('mousemove', updatePosition);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
    };
  }, []);

  return position;
}

export const EmojiFountain = ({snow}) => {
  const snowOpacity = useMemo(() => {
    if (snow) return 1
    else return 0
  }, [snow])

  return (
    <>
      <Confetti
        run={snow}
        style={{ pointerEvents: 'none' }}
        numberOfPieces={100}
        initialVelocityX={2}
        initialVelocityY={5}
        // ref={ref}
        tweenDuration={5000}
        recycle={false}
        gravity={0.5}
        // {...activeProps}
      />
    </>
  )
}