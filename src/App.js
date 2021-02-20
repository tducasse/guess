import { isUndefined, sampleSize, shuffle } from "lodash";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import allCards from "./cards.json";

const App = () => {
  const [currentCards, setCurrentCards] = useState([]);

  const pickCards = (number) => {
    const randomCards = sampleSize(allCards.cards, number);
    setCurrentCards(randomCards);
  };

  const finishGame = () => {
    alert("game over");
    setCurrentCards([]);
  };

  const shuffleCards = () => {
    setCurrentCards(shuffle(currentCards));
  };

  if (!currentCards.length) {
    return <Setup pickCards={pickCards} />;
  }

  return (
    <Game
      cards={currentCards}
      shuffleCards={shuffleCards}
      finishGame={finishGame}
    />
  );
};

const Setup = ({ pickCards }) => {
  const [number, setNumber] = useState(30);

  const submit = (e) => {
    e.preventDefault();
    pickCards(number);
  };

  return (
    <form onSubmit={submit}>
      <label htmlFor="number">Number of cards</label>
      <input
        name="number"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        type="number"
      ></input>
      <button type="submit">Start</button>
    </form>
  );
};

const Game = ({ cards, finishGame, shuffleCards }) => {
  const total = cards.length;
  const [round, setRound] = useState(1);
  const [guessed, setGuessed] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (round !== 1 && cards.length) {
      cards.forEach((card) => {
        card.guessed = false;
      });
    }
  }, [round, cards]);

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
    shuffleCards();
    setGuessed(0);
    setCurrentCardIndex(0);
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
    cards[currentCardIndex].guessed = true;
    setGuessed(guessed + 1);
    if (isLastCard()) {
      const nextCardIndex = findNextCard();
      if (nextCardIndex === -1) {
        return moveToNextRound();
      }
      return setCurrentCardIndex(nextCardIndex);
    }
    const nextCardIndex = findNextCard(currentCardIndex);
    if (nextCardIndex === -1) {
      return moveToNextRound();
    }
    return setCurrentCardIndex(nextCardIndex);
  };

  const pass = () => {
    setLoading(true);
    let nextCardIndex;
    if (isLastCard()) {
      nextCardIndex = findNextCard();
    } else {
      nextCardIndex = findNextCard(currentCardIndex);
    }
    return setCurrentCardIndex(nextCardIndex);
  };

  return (
    <div>
      <h3>Round {round}</h3>
      <h4>
        Cards guessed: {guessed}/{total}
      </h4>
      <Card
        card={cards[currentCardIndex]}
        guess={guess}
        pass={pass}
        loading={loading}
        disablePass={total - guessed === 1}
      />
    </div>
  );
};

const PassButton = styled.button`
  background: red;
  border-color: red;
`;

const GuessButton = styled.button`
  background: green;
  border-color: green;
`;

const Buttons = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const CardContainer = styled.div`
  border: 1px solid black;
  border-radius: 6px;
  padding: 12px;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Card = ({ card, guess, pass, disablePass, loading }) => {
  if (!card) return null;
  return (
    <CardContainer>
      <Buttons>
        <GuessButton disabled={loading} onClick={guess}>
          Got it
        </GuessButton>
        <PassButton disabled={disablePass || loading} onClick={pass}>
          Pass
        </PassButton>
      </Buttons>
      <h2>{card.name}</h2>
      <div>{card.description}</div>
    </CardContainer>
  );
};

export default App;
