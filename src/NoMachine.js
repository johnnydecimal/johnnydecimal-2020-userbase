import React from "react";
import userbase from "userbase-js";

const NoMachine = () => {
  userbase
    .init({
      appId: process.env.REACT_APP_USERBASE_APP_ID,
    })
    .then((result) => console.log("🙅🏼‍♂️🤖 <NoMachine /> -> Result ->", result))
    .catch((error) => console.error("🙅🏼‍♂️🤖 <NoMachine /> -> Error ->", error));

  return (
    <div style={{ fontSize: "3rem", margin: "1rem" }}>
      🙅🏼‍♂️🤖 Returning! Check the console.
    </div>
  );
};

export default NoMachine;
