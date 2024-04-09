import React, { createContext, useState } from "react";

export const VisaContext = createContext(null);

const mockVisaSuggestions = [
    { id: 1, name: "Tourist Visa" },
    { id: 2, name: "Student Visa" },
    { id: 3, name: "Work Visa" },
    { id: 4, name: "Business Visa" },
    { id: 5, name: "Family Visa" },
];

export const VisaProvider = ({ children }) => {
    const [visaSuggestions, setVisaSuggestions] = useState(mockVisaSuggestions);
    const [showVisaSuggestions, setShowVisaSuggestions] = useState(false);

    const fetchVisaSuggestions = () => {
        setVisaSuggestions(mockVisaSuggestions);
        setShowVisaSuggestions(true);
    };

    return (
        <VisaContext.Provider value={{ visaSuggestions, showVisaSuggestions, fetchVisaSuggestions }}>
            {children}
        </VisaContext.Provider>
    );
};
