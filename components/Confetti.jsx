import React from 'react';
import { Dimensions } from 'react-native';
import { MotiView } from 'moti';

const { width, height } = Dimensions.get('window');

const colors = ['#FF3C38', '#FF8C00', '#FFD700', '#3CB371', '#1E90FF', '#9370DB'];

const ConfettiPiece = ({ index }) => {
  const left = Math.random() * width;
  const delay = Math.random() * 1000;
  const rotate = `${Math.random() * 360}deg`;
  const color = colors[Math.floor(Math.random() * colors.length)];
  const size = Math.random() * 8 + 4;

  return (
    <MotiView
      from={{
        translateY: -50,
        opacity: 1,
        rotate,
      }}
      animate={{
        translateY: height + 50,
        opacity: 0,
        rotate: `${parseInt(rotate) + 720}deg`,
      }}
      transition={{
        type: 'timing',
        duration: 1200 + Math.random() * 800,
        delay,
      }}
      style={{
        width: size,
        height: size * 2,
        backgroundColor: color,
        position: 'absolute',
        left,
        borderRadius: 2,
      }}
    />
  );
};

const Confetti = ({ count = 30 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <ConfettiPiece key={index} index={index} />
      ))}
    </>
  );
};

export default Confetti;
