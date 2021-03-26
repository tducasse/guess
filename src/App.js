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

export default App;
