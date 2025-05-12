import { Stack } from "expo-router";
import './globals.css'
import { AuthProvider, useAuth } from './AuthContext';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="movies/[id]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MovieTasteQuiz"
          options={{ headerShown: false, presentation: 'modal' }} // or fullScreenModal
        />
      </Stack>
      <Toast
        position='bottom'
        bottomOffset={20}
      />
    </AuthProvider>
  );
}
