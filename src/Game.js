import React, { useState, useEffect } from "react";
import { isUndefined } from "lodash";
import styled, { keyframes } from "styled-components";
import Card from "./Card";

const Game = ({
  cards,
  finishGame,
  shuffleCards,
  setCurrentCards,
  round,
  setRound,
  guessed,
  setGuessed,
  currentCardIndex,
  setCurrentCardIndex,
  reset,
  repick,
}) => {
  const total = cards.length;
  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
  }, [loading]);

  const moveToNextRound = () => {
    const newRound = round + 1;
    if (newRound > 3) {
      return finishGame();
    }
    alert(`Moving to round ${newRound}`);
    setRound(newRound);
    setGuessed(0);
    setCurrentCardIndex(0);
    setCurrentCards(
      shuffleCards(cards).map((card) => ({ ...card, guessed: false }))
    );
  };

  const findNextCard = (from) => {
    let findAnother = false;
    if (!isUndefined(from)) {
      const nextIndex = cards
        .slice(from + 1)
        .findIndex((card) => !card.guessed);
      if (nextIndex === -1) {
        findAnother = true;
      } else {
        return nextIndex + from + 1;
      }
    }
    if (isUndefined(from) || findAnother) {
      return cards.findIndex((card) => !card.guessed);
    }
  };

  const isLastCard = () => currentCardIndex + 1 === total;

  const guess = () => {
    setLoading(true);
    const newCards = [...cards];
    newCards[currentCardIndex].guessed = true;
    setCurrentCards(newCards);
    setGuessed(guessed + 1);
    if (isLastCard()) {
      const nextCardIndex = findNextCard();
      if (nextCardIndex === -1) {
        return moveToNextRound();
      }
      setHidden(true);
      return setCurrentCardIndex(nextCardIndex);
    }
    const nextCardIndex = findNextCard(currentCardIndex);
    if (nextCardIndex === -1) {
      return moveToNextRound();
    }
    setHidden(true);
    return setCurrentCardIndex(nextCardIndex);
  };

  const pass = () => {
    setLoading(true);
    let nextCardIndex;
    if (isLastCard()) {
      nextCardIndex = findNextCard();
      setHidden(true);
    } else {
      nextCardIndex = findNextCard(currentCardIndex);
      setHidden(true);
    }
    return setCurrentCardIndex(nextCardIndex);
  };

  return (
    <div>
      <Inline>
        <h3>Round {round}</h3>
        <h4>
          Cards guessed: {guessed}/{total}
        </h4>
      </Inline>
      <Card
        card={cards[currentCardIndex]}
        guess={guess}
        pass={pass}
        loading={loading}
        disablePass={total - guessed === 1}
        hidden={hidden}
        reveal={() => setHidden(false)}
      />
      <Row>
        <Reset reset={reset} />
        {round <= 1 && !hidden && (
          <RepickButton disabled={loading} onClick={repick}>
            Repick
          </RepickButton>
        )}
      </Row>
    </div>
  );
};

const Row = styled.div`
  flex-direction: row;
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  margin-bottom: 12px;
`;

const Inline = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 12px;
`;
const ResetButton = styled.button`
  box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px,
    rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px,
    rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px;
`;

const Reset = ({ reset }) => {
  return <ResetButton onClick={() => reset()}>Reset Game</ResetButton>;
};

const scaleUpCenter = keyframes` 
  0% {
    -webkit-transform: scale(0.5);
            transform: scale(0.5);
  }
  100% {
    -webkit-transform: scale(1);
            transform: scale(1);
  }
}
@keyframes scale-up-center {
  0% {
    -webkit-transform: scale(0.5);
            transform: scale(0.5);
  }
  100% {
    -webkit-transform: scale(1);
            transform: scale(1);
  }
`;

const RepickButton = styled.button`
  background: gray;
  border-color: gray;

  box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px,
    rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px,
    rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px;

  :active {
    animation: ${scaleUpCenter} 0.4s cubic-bezier(0.39, 0.575, 0.565, 1) both;
  }
`;

export default Game;
