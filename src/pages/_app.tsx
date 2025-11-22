// Import polyfill first to ensure document exists before styled-jsx initializes
import "../../polyfills.js";
import React, { useEffect } from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/store/store";
import { setUser } from "@/store/authSlice";
import authStorage from "@/api/config/storage";
// Emotion CacheProvider needed for react-select (which uses Emotion internally)
// Note: react-select v5 requires @emotion/react as a dependency
import { EmotionCacheProvider } from "@/utils/emotionCache";

// Import global styles
import "@/assets/scss/nextjs-argon-dashboard-pro.scss";
// Custom sidebar styles
import "@/styles/custom-sidebar.css";
// Font Awesome icons
import "@/assets/vendor/@fortawesome/fontawesome-free/css/all.min.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-notification-alert/dist/animate.css";
import "react-quill/dist/quill.snow.css";
import "react-tagsinput/react-tagsinput.css";
import "react-datetime/css/react-datetime.css";
import "@/assets/vendor/animate.css/animate.min.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "@/assets/vendor/nucleo/css/nucleo.css";

// Component to load user on mount
const UserLoader = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Load user from localStorage on client side
    try {
      const storedUser = authStorage.getUser();
      if (storedUser) {
        dispatch(setUser(storedUser));
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
  }, [dispatch]);

  return <>{children}</>;
};

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const Layout = (Component as any).layout || (({ children }: { children: React.ReactNode }) => <>{children}</>);

  // Wrap with EmotionCacheProvider for react-select SSR compatibility
  const appContent = (
    <EmotionCacheProvider>
      <Provider store={store}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <title>Al-anam Admin Dashboard</title>
        </Head>
        <UserLoader>
          {Layout ? (
            <Layout permissionCheck={(Component as any).permissionCheck}>
              <Component {...pageProps} />
            </Layout>
          ) : (
            <Component {...pageProps} />
          )}
        </UserLoader>
      </Provider>
    </EmotionCacheProvider>
  );

  return appContent;
};

export default MyApp;
