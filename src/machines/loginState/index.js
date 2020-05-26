import { Machine, assign } from "xstate";
import userbase from "userbase-js";

export const loginStateMachine = Machine({
  id: "loginState",
  initial: "loadingSession",

  context: {
    user: undefined,
  },

  states: {
    loadingSession: {
      invoke: {
        id: "loadSession",
        src: () => {
          userbase.init({
            appId: process.env.REACT_APP_USERBASE_ID,
          });
        },
        onDone: [
          {
            cond: (_, event) => Boolean(event.data.user),
            target: "loggedIn",
            actions: assign({ user: (_, event) => event.data.user }),
          },
          {
            target: "loggedOut",
          },
        ],
        onError: {
          target: "loginFailed",
          actions: assign({ error: (_, event) => event.data }),
        },
      },
    },
    tryingLogin: {},
    loginFailed: {},
    loggedIn: {},
    loggedOut: {},
  },
});
