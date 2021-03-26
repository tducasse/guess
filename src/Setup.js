import React from "react";

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

export default Setup;
