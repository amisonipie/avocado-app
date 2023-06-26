import CssBaseline from "@mui/material/CssBaseline";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import "../../styles/globals.css";
import LandingLayout from "../components/Layout/LandingPage";
import Loading from "../components/Loading";
import { theme } from "../lib/theme";
import { store } from "../store/store";

axios.defaults["content-type"] = "application/json";

const MyApp = ({ Component, pageProps }) => {
  const persistor = persistStore(store);

  return (
    <SessionProvider session={pageProps.session}>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={<Loading />}>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
              <DndProvider backend={HTML5Backend}>
                <CssBaseline />
                <LandingLayout>
                  <Component {...pageProps} />
                </LandingLayout>
              </DndProvider>
            </ThemeProvider>
          </StyledEngineProvider>
        </PersistGate>
      </Provider>
    </SessionProvider>
  );
};

export default MyApp;
