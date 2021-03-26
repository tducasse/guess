import { differenceBy, sample, sampleSize, shuffle, isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import Setup from "./Setup";
import Game from "./Game";
import Tabletop from "tabletop";

const SPREADSHEET_KEY = "1U_pW_Zc4q0ZSlx4i_0q6pObRY_4KFEeu41V92gt-iGk";

const App = () => {
  const [allCards, setAllCards] = useState([]);

  useEffect(() => {
    Tabletop.init({
      key: SPREADSHEET_KEY,
      callback: (data) => {
        setAllCards(data);
      },
      simpleSheet: true,
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

export default App;
