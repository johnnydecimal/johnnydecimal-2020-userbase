import React from "react";
import { useMachine } from "@xstate/react";
import { useForm } from "react-hook-form";
import userbase from "userbase-js";

import { loginStateMachine } from "./machines/loginState";

import NoMachine from "./NoMachine";

const LoginForm = ({ loginStateSend }) => {
  const { register, handleSubmit } = useForm();
  const onSubmit = (form) => {
    loginStateSend({ type: "LOGIN", form });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input name="username" ref={register} />
      <input name="password" type="password" ref={register} />
      <input type="submit" />
    </form>
  );
};

const LogoutButton = ({ loginStateSend }) => {
  const handleLogout = () => {
    loginStateSend({ type: "LOGOUT" });
  };
  return <button onClick={handleLogout}>Log out</button>;
};

const App = () => {
  const [loginState, loginStateSend, loginStateService] = useMachine(
    loginStateMachine,
    {
      services: {
        userbaseLogin: (context, event) => {
          console.log("App -> useMachine -> userbaseLogin(start)");
          // debugger;
          userbase
            .signIn({
              username: event.form.username,
              password: event.form.password,
              rememberMe: "local",
            })
            .then((user) =>
              console.log(`user from userbaseLogin: ${user.username}`)
            )
            .catch((e) => console.error(e));

          console.log("App -> useMachine -> userbaseLogin(done)");
        },
      },
    }
  );

  const { user } = loginState.context;
  console.log(`loginState.value: ${loginState.value}`);

  return (
    <div>
      <NoMachine />
      {loginState.matches("loadingSession") ? <p>Pending</p> : null}
      {loginState.matches("loggedIn") ? (
        <div>
          <p>Mock: logged in</p>
          <LogoutButton loginStateSend={loginStateSend} />
        </div>
      ) : null}
      {loginState.matches("loggingOut") ? <p>Logging out...</p> : null}
      {loginState.matches("loggedOut") ? (
        <LoginForm loginStateSend={loginStateSend} />
      ) : null}
    </div>
  );
  // return <div>Hey there</div>;
};

export default App;
