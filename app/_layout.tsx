import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import "react-native-reanimated";
import * as SecureStore from "expo-secure-store";

import { AppStateStatus, TouchableOpacity, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import useAppStateCheck from "@/hooks/useAppStateCheck";
import AppStateStatusContext from "./AppStateStatusContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ModalHeaderText from "@/components/ModalHeaderText";
import { Colors } from "react-native/Libraries/NewAppScreen";

const CLERK_PUBLISHABLE_KEY = process.env.CLERK_PUBLISHABLE_KEY;

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    mon: require("../assets/fonts/Montserrat-Regular.ttf"),
    "mon-sb": require("../assets/fonts/Montserrat-SemiBold.ttf"),
    "mon-b": require("../assets/fonts/Montserrat-Bold.ttf"),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const [appStateStatus, setAppStateStatus] =
    useState<AppStateStatus>("unknown");
  useAppStateCheck({ setAppStateStatus });

  const onAppStateChange = useCallback(() => {
    switch (appStateStatus) {
      case "active":
        // Perform actions when the app is in the active state
        break;
      case "background":
        // Perform actions when the app is in the background state
        break;
      case "inactive":
        // Perform actions when the app is in the inactive state
        break;
      default:
        // Handle other app state scenarios
        break;
    }
  }, [appStateStatus]);

  useEffect(() => {
    onAppStateChange();
  }, [onAppStateChange]);

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <AppStateStatusContext.Provider
        value={{ appStateStatus, setAppStateStatus }}
      >
        <RootLayoutNav />
      </AppStateStatusContext.Provider>
    </ClerkProvider>
  );
}

function RootLayoutNav() {
  const rounter = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/(modals)/login");
    }
  }, [isLoaded]);

  return (
    <GestureHandlerRootView>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(modals)/login"
            options={{
              title: "Log in or sign up",
              headerTitleStyle: {
                fontFamily: "mon-sb",
              },
              presentation: "modal",
              headerLeft: () => (
                <TouchableOpacity onPress={() => rounter.back()}>
                  <Ionicons name="close-outline" size={28} />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="listing/[id]"
            options={{
              headerTitle: "",
              headerTransparent: true,
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="(modals)/booking"
            options={{
              presentation: "transparentModal",
              animation: "fade",
              headerTransparent: true,
              headerTitle: () => <ModalHeaderText />,
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => rounter.back()}
                  style={{
                    backgroundColor: "#fff",
                    borderColor: Colors.gray,
                    borderRadius: 20,
                    borderWidth: 1,
                    padding: 4,
                  }}
                >
                  <Ionicons name="close-outline" size={22} />
                </TouchableOpacity>
              ),
            }}
          />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
