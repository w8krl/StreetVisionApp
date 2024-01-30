import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Header, Sidebar, GridContainer } from "./components/layout";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import MainContent from "./components/layout/MainContent";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Login from "./components/pages/Login";
import {
  VisaSearch,
  // SuggestedResults,
  Workflow,
  Test,
  SuggestedResults,
} from "./components/pages";
import { VisaProvider } from "./components/visa/VisaContext"; // Update import path if necessary

function App() {
  const isLoggedIn = /* logic to check if user is logged in */ false;

  return (
    <Provider store={store}>
      <VisaProvider>
        <Router basename="/uk">
          <Routes>
            <Route path="/" element={<VisaSearch />} />
            <Route path="/suggested-results" element={<SuggestedResults />} />

            <Route path="/test" element={<Test />} />
            <Route path="/login" element={<Login />} />
            <Route path="/workflow" element={<Workflow />} />
            {/* <Route path="/suggested-results" element={<SuggestedResults />} /> */}
            {/* Protected routes wrapped in a single GridContainer for layout */}
            <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
              <Route
                path="/"
                element={
                  <GridContainer>
                    <MainContent />
                    {/* Other protected components */}
                  </GridContainer>
                }
              />
            </Route>
          </Routes>
        </Router>
      </VisaProvider>
    </Provider>
  );
}

export default App;
