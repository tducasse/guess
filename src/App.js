import { differenceBy, sample, sampleSize, shuffle, isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import Setup from "./Setup";
import Game from "./Game";
import { parse } from "papaparse";

const spreadsheet =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRiXIIDQ5PPS8Lca5N2F_JzkcInFKvnp1lZl_z_cPuOO9qg88XO05mQvcIsA0xhngytA0Q6j4YVTQ6o/pub?output=csv";

const App = () => {
  const [allCards, setAllCards] = useState([]);

  useEffect(() => {
    parse(spreadsheet, {
      download: true,
      header: true,
      skipEmptyLines: "greedy",
      complete: (results) => setAllCards(results.data),
    });
  }, []);

  const [currentCards, setCurrentCards] = useLocalStorageState(
    "currentCards",
    []
  );
  const [number, setNumber] = useLocalStorageState("number", 30);
  const [round, setRound] = useLocalStorageState("round", 1);
  const [guessed, setGuessed] = useLocalStorageState("guessed", 0);
  const [currentCardIndex, setCurrentCardIndex] = useLocalStorageState(
    "currentCardIndex",
    0
  );

  const pickCards = (number) => {
    const randomCards = sampleSize(allCards, number);
    setCurrentCards(randomCards);
  };

  const finishGame = () => {
    alert("game over");
    reset(true);
  };

  const shuffleCards = () => shuffle(currentCards);

  const repick = () => {
    const newCards = currentCards.slice();
    newCards[currentCardIndex] = sample(
      differenceBy(allCards, currentCards, "name")
    );
    setCurrentCards(newCards);
  };

  const reset = (force) => {
    const confirmed = force ? true : window.confirm("Are you sure?");
    if (confirmed) {
      [
        setNumber,
        setCurrentCardIndex,
        setCurrentCards,
        setRound,
        setGuessed,
      ].forEach((callback) => callback.reset());
    }
  };

  if (!currentCards.length) {
    return (
      <Setup
        pickCards={pickCards}
        setNumber={setNumber}
        number={number}
        ready={!isEmpty(allCards)}
      />
    );
  }

  return (
    <Game
      repick={repick}
      cards={currentCards}
      shuffleCards={shuffleCards}
      finishGame={finishGame}
      setCurrentCards={setCurrentCards}
      setNumber={setNumber}
      round={round}
      setRound={setRound}
      currentCardIndex={currentCardIndex}
      setCurrentCardIndex={setCurrentCardIndex}
      guessed={guessed}
      setGuessed={setGuessed}
      reset={reset}
    />
  );
};

const Setup = ({ pickCards, setNumber, number }) => {
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
      <Reset reset={reset} />
    </div>
  );
};

const Reset = ({ reset }) => {
  return <button onClick={() => reset()}>Reset Game</button>;
};

const PassButton = styled.button`
  background: red;
  border-color: red;
`;

const GuessButton = styled.button`
  background: green;
  border-color: green;
`;

const Inline = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const CardContainer = styled.div`
  color: black;
  border: 1px solid black;
  border-radius: 6px;
  padding: 12px;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

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
          <h2>{card.name}</h2>
          <div>{card.description}</div>
        </>
      )}
    </CardContainer>
  );
};

export default App;
