import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/FirebaseConfig';
import { useAuth } from './AuthContext';
import { router } from 'expo-router';
import * as Progress from 'react-native-progress';

const questions = [
  {
    id: 'genres',
    question: '🎬 Choose your favorite genres',
    options: ['Action', 'Drama', 'Comedy', 'Sci-fi', 'Romance', 'Horror', 'Thriller'],
    multi: true,
    minSelect: 3,
  },
  {
    id: 'mood',
    question: '😊 What’s your current mood?',
    options: ['Adventurous', 'Chill', 'Romantic', 'Excited', 'Spooky'],
    multi: false
  },
  {
    id: 'duration',
    question: '⏰ Preferred movie duration?',
    options: ['<90 min', '90–120 min', '>120 min'],
    multi: false
  },
  {
    id: 'frequency',
    question: '📅 How often do you watch movies?',
    options: ['Daily', 'Weekly', 'Only Weekends'],
    multi: false
  }
];

const MovieTasteQuiz = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [answers, setAnswers] = useState<Record<string, string[] | string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = questions[currentIndex];

  const handleSelect = (qId: string, value: string, multi: boolean) => {
    setAnswers(prev => {
      if (multi) {
        const prevArr = Array.isArray(prev[qId]) ? prev[qId] as string[] : [];
        const updated = prevArr.includes(value)
          ? prevArr.filter(v => v !== value)
          : [...prevArr, value];
        return { ...prev, [qId]: updated };
      } else {
        return { ...prev, [qId]: value };
      }
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleFinish = async () => {
    if (!user?.uid) return;

    const userId = user.uid;

    try {
      const movieRef = doc(db, "moviesappid", userId);
      await setDoc(movieRef, {
        ...answers,
        hasCompletedQuiz: true,
        completedAt: new Date(),
      }, { merge: true });

      router.replace("/");
    } catch (error) {
      console.error("Error saving quiz data:", error);
    }
  };

  const isNextDisabled = () => {
    const answer = answers[currentQuestion.id];
    if (currentQuestion.id === 'genres') {
      return !(Array.isArray(answer) && answer.length >= 3);
    }
    return !answer;
  };

  const progress = (currentIndex + 1) / questions.length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1e1e1e' }}>
      <View style={{ padding: 20, flex: 1 }}>
        {/* Progress Bar */}
        <Progress.Bar progress={progress} width={null} color="#6c5ce7" height={10} borderRadius={5} />

        {/* Question */}
        <Text style={styles.question}>{currentQuestion.question}</Text>

        {/* Options */}
        <ScrollView contentContainerStyle={styles.optionsContainer}>
          {currentQuestion.options.map(opt => {
            const selected = currentQuestion.multi
              ? (answers[currentQuestion.id] as string[] | undefined)?.includes(opt)
              : answers[currentQuestion.id] === opt;
            return (
              <TouchableOpacity
                key={opt}
                style={[styles.option, selected && styles.selected]}
                onPress={() => handleSelect(currentQuestion.id, opt, currentQuestion.multi)}
              >
                <Text style={styles.optionText}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Button */}
        {currentIndex === questions.length - 1 ? (
          <TouchableOpacity style={[styles.nextBtn, isNextDisabled() && styles.disabledBtn]} onPress={handleFinish} disabled={isNextDisabled()}>
            <Text style={styles.nextText}>🎉 Finish</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.nextBtn, isNextDisabled() && styles.disabledBtn]} onPress={handleNext} disabled={isNextDisabled()}>
            <Text style={styles.nextText}>Next ➡️</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default MovieTasteQuiz;

const styles = StyleSheet.create({
  question: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 20,
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    paddingBottom: 20,
  },
  option: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#888',
    margin: 5,
    backgroundColor: '#2e2e2e',
  },
  selected: {
    backgroundColor: '#00b894',
    borderColor: '#00b894',
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
  },
  nextBtn: {
    padding: 15,
    backgroundColor: '#6c5ce7',
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 'auto',
    width: '60%',
    alignItems: 'center',
  },
  disabledBtn: {
    backgroundColor: '#888',
  },
  nextText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
