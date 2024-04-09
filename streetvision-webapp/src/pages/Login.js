import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";

// Keyframes
const TextAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(1em);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const CenterTextAnimation = keyframes`
  from {
    opacity: 0.99;
  }
  to {
    opacity: 1;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const GradientColumn = styled.div`
  background: linear-gradient(45deg, #6a11cb, #2575fc);
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Poppins", sans-serif;
  font-size: 3rem;
  color: white;
`;

const AnimatedChar = styled.span`
  display: inline-block;
  opacity: 0;
  font-size: 10rem;
  transform: translateY(1em);
  animation: ${TextAnimation} 0.1s forwards;
  animation-delay: ${(props) => props.$delay}s;
  animation-fill-mode: forwards;
`;

const FormColumn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const FormBox = styled.div`
  width: 50%;
  height: 50%;
  background-color: white;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Input = styled.input`
  font-size: 1.5rem;
  margin: 10px;
  width: 76%;
`;

const TabButton = styled.button`
  background: none;
  border: none;
  padding: 10px;
  cursor: pointer;
  font-size: 2rem;
  font-weight: ${(props) => (props.$active ? "bold" : "normal")};
`;

const AnimatedTextContainer = styled.div`
  display: inline-block;
  text-align: center; // Center text
  animation: ${CenterTextAnimation} 0.01s forwards;
  animation-delay: ${(props) => props.delay}s;
  animation-fill-mode: forwards;
  animation-iteration-count: 1;
`;

const AnimatedWord = styled.div`
  display: inline-block;
  margin-right: 1rem;
`;

const GradientButton = styled.button`
  background: linear-gradient(45deg, #6a11cb, #2575fc);
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1.5rem;
  cursor: pointer;
  margin: 10px;
  width: 76%;
  transition: background 0.3s;

  &:hover {
    background: linear-gradient(45deg, #2575fc, #6a11cb);
  }
`;

const AnimatedText = ({ text }) => {
  const [isCentered, setIsCentered] = useState(false);
  const words = text.split(" ");

  // Calculate total animation time
  const totalAnimationTime = Math.min(
    1,
    words.reduce((acc, word) => acc + word.length * 0.1, 0) + words.length * 2
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCentered(true);
    }, totalAnimationTime * 1000);

    return () => clearTimeout(timer);
  }, [totalAnimationTime]);

  return (
    <AnimatedTextContainer
      delay={0.1}
      className={isCentered ? "text-centered" : ""}
    >
      {words.map((word, wordIndex) => (
        <AnimatedWord key={wordIndex}>
          {Array.from(word).map((char, charIndex) => (
            <AnimatedChar key={charIndex} $delay={wordIndex + charIndex * 0.1}>
              {char}
            </AnimatedChar>
          ))}
        </AnimatedWord>
      ))}
    </AnimatedTextContainer>
  );
};

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [activeTab, setActiveTab] = useState("login");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "register") {
      localStorage.removeItem("jwtToken");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiEndpoint = "/api/users/login";

    try {
      const response = await axios.post(apiEndpoint, formData);

      if (response.data.token) {
        localStorage.setItem("jwtToken", response.data.token);
        window.location = "/";
      } else {
        // error resp. Need to add.
      }
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  };

  return (
    <Container>
      <GradientColumn>
        <AnimatedText text="Visa Application Portal!" />
      </GradientColumn>

      <FormColumn>
        <FormBox>
          <div>
            <TabButton
              $active={activeTab === "login"}
              onClick={() => handleTabChange("login")}
            >
              Login
            </TabButton>
            <TabButton
              $active={activeTab === "register"}
              onClick={() => handleTabChange("register")}
            >
              Register
            </TabButton>
          </div>
          {activeTab === "login" && (
            <FormWrapper onSubmit={handleSubmit}>
              <Input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <GradientButton type="submit">Let's Go!</GradientButton>
            </FormWrapper>
          )}
          {activeTab === "register" && (
            <FormWrapper>
              <p>Registration form</p>
            </FormWrapper>
          )}
        </FormBox>
      </FormColumn>
    </Container>
  );
};

export default Login;
