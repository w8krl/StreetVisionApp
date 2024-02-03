// SuggestedResults.js§
import React, { useContext } from "react";
import { VisaContext } from "../../visa/VisaContext";

const SuggestedResults = () => {
  const { visaSuggestions } = useContext(VisaContext);
  return (
    <div>
      <h1>Suggested Visas</h1>
      <ul>
        {visaSuggestions.map((visa) => (
          <li key={visa.id}>{visa.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default SuggestedResults;
