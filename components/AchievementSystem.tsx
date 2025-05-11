import { db, Timestamp, arrayUnion } from '@/FirebaseConfig';
import { collection, doc, getCountFromServer, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export const ACHIEVEMENT_TYPES = {
  firstMovie: {
    title: "First Save!",
    desc: "Saved your first movie",
    icon: "🎬",
    target: 1
  },
  movieBuff: {
    title: "Movie Buff",
    desc: "Saved 5 movies",
    icon: "🍿",
    target: 5
  },
  verified: {
    title: "Verified Critic",
    desc: "Verified your email",
    icon: "✅",
    target: 1
  }
};

  export const checkAchievements = async (userId, actionType: string) => {
    const movieRef = doc(db, "moviesappid", userId);
    const newAchievements = [];
  
    // Fetch existing data
    const docSnap = await getDoc(movieRef);
    const data = docSnap.exists() ? docSnap.data() : {};
    const currentAchievements = data.achievements || [];
    const savedMovies = data.movieid || [];
  
    // Check for movie-related achievements
    if (actionType === 'saveMovie') {
      const savedCount = savedMovies.length;
  
      if (savedCount >= 1 && !currentAchievements.some(a => a.type === 'firstMovie')) {
        newAchievements.push({
          type: 'firstMovie',
          unlockedAt: Timestamp.now()
        });
      }
  
      if (savedCount >= 5 && !currentAchievements.some(a => a.type === 'movieBuff')) {
        newAchievements.push({
          type: 'movieBuff',
          unlockedAt: Timestamp.now()
        });
      }
    }
  
    // Check for email verification achievement (if relevant)
    if (actionType === 'verifyEmail' && !currentAchievements.some(a => a.type === 'verified')) {
      newAchievements.push({
        type: 'verified',
        unlockedAt: Timestamp.now()
      });
    }
  
    // Update Firestore if new achievements found
    if (!docSnap.exists()) {
      await setDoc(movieRef, {
        achievements: newAchievements
      }, { merge: true });
    } else if (newAchievements.length > 0) {
      // If doc exists and new achievements found, update it
      await updateDoc(movieRef, {
        achievements: arrayUnion(...newAchievements)
      });
    }
  
    return newAchievements;
  };