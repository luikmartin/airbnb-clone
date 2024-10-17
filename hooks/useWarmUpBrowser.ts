import { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";

// Warms up browser on Android, increasing the performance
export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  });
};
