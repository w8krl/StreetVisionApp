import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
// import ProtectedRoute from "./components/auth/ProtectedRoute";
// import Login from "./pages/Login";
import SearchCams from "./pages/SearchCams";
import { VisaProvider } from "./components/visa/VisaContext"; // Update import path if necessary

function App() {
  const isLoggedIn = /* logic to check if user is logged in */ false;

  return (
    <Provider store={store}>
      <VisaProvider>
        <Router>
          <Routes>
            <Route path="/SearchCams" element={<SearchCams />} />

            {/* <Route path="/login" element={<Login />} /> */}
            {/* <Route path="/suggested-results" element={<SuggestedResults />} /> */}
            {/* Protected routes wrapped in a single GridContainer for layout */}
          </Routes>
        </Router>
      </VisaProvider>
    </Provider>
  );
}

export default App;
