import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import  Confetti from './Confetti';

const AchievementPopup = ({ achievement, onClose }) => {
  if (!achievement) return null;

  return (
    <AnimatePresence>
      <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: 'timing', duration: 300 }}
        style={{
          position: 'absolute',
          top: '30%',
          left: '10%',
          right: '10%',
          padding: 20,
          backgroundColor: '#222',
          borderRadius: 20,
          zIndex: 999,
          alignItems: 'center',
          overflow: 'visible',
        }}
      >
        <Confetti count={40} />

        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
          🎉 Achievement Unlocked!
        </Text>
        <Text style={{ color: 'white', marginTop: 10 }}>
          {achievement.type === 'firstMovie'
            ? 'You saved your first movie!'
            : achievement.type === 'movieBuff'
              ? 'You saved 5 movies!'
              : achievement.type === 'verified'
                ? 'Email verified!'
                : achievement.type}
        </Text>

        <TouchableOpacity onPress={onClose} style={{ marginTop: 15 }}>
          <Text style={{ color: '#0af', fontWeight: 'bold' }}>Close</Text>
        </TouchableOpacity>
      </MotiView>
    </AnimatePresence>
  );
};

export default AchievementPopup;