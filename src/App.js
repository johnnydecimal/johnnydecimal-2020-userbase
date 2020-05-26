import React from "react";
import { useMachine } from "@xstate/react";

import { loginStateMachine } from "./machines/loginState";

const App = () => {
  const [loginState, loginStateSend, loginStateService] = useMachine(
    loginStateMachine
  );

  const { user } = loginState.context;
  console.log("App -> user", user);

  return null;
};

export default App;
