import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
// import ProtectedRoute from "./components/auth/ProtectedRoute";
// import Login from "./pages/Login";
import SearchCams from "./pages/SearchCams";
import Events from "./pages/Events";
import Decoding from "./pages/Decoding";
import SurvResults from "./pages/SurvResults";
import Regions from "./pages/Regions";
import POIForm from "./pages/POIForm";
import POIList from "./pages/POIList";
import JobReview from "./pages/JobReview";
import POIStatus from "./pages/POIStatus";
import { VisaProvider } from "./components/visa/VisaContext"; // Update import path if necessary
import "./style.css";

function App() {
  const isLoggedIn = /* logic to check if user is logged in */ false;

  return (
    <Provider store={store}>
      <VisaProvider>
        <Router>
          <Routes>
            <Route path="/" element={<SearchCams />} />
            <Route path="/search-cameras" element={<SearchCams />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/new-event" element={<POIForm />} />
            <Route path="/jobs" element={<POIStatus />} />
            <Route path="/poi/list" element={<POIList />} />
            {/* <Route path="/jobs" element={<JobReview />} /> */}
            <Route
              path="/events/surveillance-report"
              element={<SurvResults />}
            />
            <Route path="/decoding-jobs" element={<Decoding />} />
            <Route path="/regions" element={<Regions />} />
            {/* <Route path="/camer" element={<SearchCams />} /> */}

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
