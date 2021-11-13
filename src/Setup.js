import React from "react";
import styled from "styled-components";
import Loader from "react-loader-spinner";

const Setup = ({ pickCards, setNumber, number, ready }) => {
  const submit = (e) => {
    e.preventDefault();
    pickCards(number);
  };

  return (
    <Container>
      <InnerContainer onSubmit={submit}>
        <Title>Monikers</Title>
        <label htmlFor="number">Number of cards</label>
        <input
          name="number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          type="number"
        ></input>

        <button type="submit" disabled={!ready}>
          {ready ? (
            "Start"
          ) : (
            <Loader type="ThreeDots" color="#118bee" height={18} />
          )}
        </button>
      </InnerContainer>
    </Container>
  );
};

const Title = styled.h1`
  align-self: center;
  margin-bottom: 64px;
`;

const Container = styled.div`
  height: 75vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const InnerContainer = styled.form`
  background-color: #f2f2f2;
  border-radius: 6px;
  border: none;
  box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px,
    rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px,
    rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px;
  justify-content: center;
  display: flex;
  flex-direction: column;
`;

export default Setup;
