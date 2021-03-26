import React from "react";
import styled from "styled-components";

const Card = ({ card, guess, pass, disablePass, loading, hidden, reveal }) => {
  if (!card) return null;
  return (
    <CardContainer>
      <Inline>
        {hidden ? (
          <button onClick={reveal}>Reveal</button>
        ) : (
          <>
            <GuessButton disabled={loading} onClick={guess}>
              Got it
            </GuessButton>
            <PassButton disabled={disablePass || loading} onClick={pass}>
              Pass
            </PassButton>
          </>
        )}
      </Inline>

      <CardInnerContainer>
        <Hideable hidden={hidden}>
          <h2>{card.name}</h2>
          <div>{card.description}</div>
        </Hideable>
      </CardInnerContainer>
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
  background-color: gray;
  border-radius: 6px;
  box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px,
    rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px,
    rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px;
`;

const Hideable = styled.div`
  ${({ hidden }) => (hidden ? `visibility: hidden;` : ``)}
  padding: 12px;
  display: flex;
  border-radius: 6px;
  background-color: #f2f2f2;
  align-items: center;
  flex-direction: column;
  padding: 12px;
`;

const Inline = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export default Card;
