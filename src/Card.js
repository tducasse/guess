import React from "react";
import styled from "styled-components";

const Card = ({ card, guess, pass, disablePass, loading, hidden, reveal }) => {
  if (!card) return null;
  return (
    <CardContainer>
      {hidden ? (
        <button onClick={reveal}>Reveal</button>
      ) : (
        <>
          <Inline>
            <GuessButton disabled={loading} onClick={guess}>
              Got it
            </GuessButton>
            <PassButton disabled={disablePass || loading} onClick={pass}>
              Pass
            </PassButton>
          </Inline>

          <CardInnerContainer>
            <h2>{card.name}</h2>
            <div>{card.description}</div>
          </CardInnerContainer>
        </>
      )}
    </CardContainer>
  );
};

const PassButton = styled.button`
  background: red;
  border-color: red;

  box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px,
    rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px,
    rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px;
`;

const GuessButton = styled.button`
  background: green;
  border-color: green;

  box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px,
    rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px,
    rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px;
`;
const CardContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const CardInnerContainer = styled.div`
  background-color: #f2f2f2;
  box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px,
    rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px,
    rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px;
  border-radius: 6px;
  padding: 12px;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Inline = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export default Card;
