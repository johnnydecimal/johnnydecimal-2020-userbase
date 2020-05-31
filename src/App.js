import React from "react";
import { useMachine } from "@xstate/react";
import { useForm } from "react-hook-form";
import userbase from "userbase-js";

import { loginStateMachine } from "./machines/loginState";

const LoginForm = ({ loginStateSend }) => {
  const { register, handleSubmit } = useForm();
  const onSubmit = (form) => {
    loginStateSend({ type: "LOGIN", form });
  };

  return (
    <div>
      <p>Username: johnny / Password: Password123</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input name="username" ref={register} />
        <input name="password" type="password" ref={register} />
        <input type="submit" />
      </form>
    </div>
  );
};

const LogoutButton = ({ loginStateSend }) => {
  const handleLogout = () => {
    loginStateSend({ type: "LOGOUT" });
  };
  return <button onClick={handleLogout}>Log out</button>;
};

const userbaseLogin = (context, event) => {
  return userbase.signIn({
    username: event.form.username,
    password: event.form.password,
    rememberMe: "local",
  });
};

const App = () => {
  const [loginState, loginStateSend, loginStateService] = useMachine(
    loginStateMachine,
    {
      services: { userbaseLogin },
    }
  );

  const { user } = loginState.context;
  console.log(`loginState.value: ${loginState.value}`);

  return (
    <div style={{ margin: "100px", fontSize: "2rem" }}>
      <div>Check the console for more information.</div>
      <div style={{ marginBottom: "20px" }}>
        Current machine state:{" "}
        <span style={{ color: "red" }}>{loginState.value}</span>.{" "}
      </div>
      {loginState.matches("loggedIn") ? (
        <LogoutButton loginStateSend={loginStateSend} />
      ) : null}
      {loginState.matches("loggedOut") ? (
        <LoginForm loginStateSend={loginStateSend} />
      ) : null}
    </div>
  );
  // return <div>Hey there</div>;
};

export default App;
