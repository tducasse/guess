import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import App from "./App";

const Width = styled.div`
  width: 320px;
`;

const Centered = styled.div`
  display: flex;
  justify-content: center;
`;

const Wrapper = ({ children }) => (
  <Centered>
    <Width>{children}</Width>
  </Centered>
);

ReactDOM.render(
  <React.StrictMode>
    <Wrapper>
      <App />
    </Wrapper>
  </React.StrictMode>,
  document.getElementById("root")
);
