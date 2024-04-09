import React, { useContext } from 'react';
import { VisaContext } from './VisaContext';
import VisaSuggestions from './VisaSuggestions';

const VisaSuggestionHandler = () => {
  const { visaSuggestions, showVisaSuggestions, fetchVisaSuggestions } = useContext(VisaContext);

  const applyForVisa = (visaType) => {
    // will add later
  };

  return (
    <div>
      <button onClick={fetchVisaSuggestions}>Let's go!</button>
      {showVisaSuggestions && <VisaSuggestions visas={visaSuggestions} applyForVisa={applyForVisa} />}
    </div>
  );
};

export default VisaSuggestionHandler;
