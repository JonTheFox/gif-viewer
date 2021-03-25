import React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@material-ui/styles";
import View from "./components/layout/View.jsx";
import EntireView from "./components/layout/EntireView.jsx";
import ErrorBoundary from "./pages/ErrorPage/ErrorPage.jsx";
import { AppContextProvider } from "./store/AppContext.js";
import { DeviceContextProvider } from "./store/DeviceContext.js";
import theme from "./constants/theme.js";
import Routes from "./routes.js";
import { RecoilRoot } from "recoil";
import Appbar from "./components/layout/AppBar.jsx";
import "./index.css";
import "./index.scss";

const App = (props) => {
  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <AppContextProvider>
          <DeviceContextProvider>
            <Router>
              <Route
                render={(route) => {
                  return (
                    <EntireView animate="false">
                      <ErrorBoundary>
                        <View
                          responsive={true}
                          animateChildren={false}
                          key="innerView"
                        >
                          <Appbar />
                          <Routes
                            style={{
                              overflow: "auto",
                            }}
                            route={route}
                          />
                        </View>
                      </ErrorBoundary>
                    </EntireView>
                  );
                }}
              ></Route>
            </Router>
          </DeviceContextProvider>
        </AppContextProvider>
      </ThemeProvider>
    </RecoilRoot>
  );
};

export default App;
