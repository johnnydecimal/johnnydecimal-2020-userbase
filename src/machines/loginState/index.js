import { Machine, assign } from "xstate";
import userbase from "userbase-js";

export const loginStateMachine = Machine({
  strict: "true",

  id: "loginState",
  initial: "loadingSession",

  context: {
    user: undefined,
  },

  states: {
    loadingSession: {
      invoke: {
        id: "loadSession",
        src: () =>
          userbase.init({
            appId: process.env.REACT_APP_USERBASE_APP_ID,
          }),
        onDone: [
          {
            target: "loggedIn",
            cond: (_, event) => Boolean(event.data.user),
            actions: [assign({ user: (_, event) => event.data.user })],
          },
          {
            target: "loggedOut",
          },
        ],
        onError: {
          target: "error",
          actions: assign({ error: (_, event) => event.data }),
        },
      },
    },
    tryingLogin: {
      invoke: {
        id: "tryLogin",
        src: "userbaseLogin",
        onDone: {
          target: "loggedIn",
          actions: [
            assign({
              user: (context, event) => event.data,
              error: null,
            }),
          ],
        },
        onError: {
          target: "loginFailed",
          actions: [
            assign({
              user: null,
              error: (context, event) => event.data.message,
            }),
          ],
        },
      },
    },
    loginFailed: {},
    loggedIn: {
      on: {
        LOGOUT: {
          target: "loggingOut",
        },
      },
    },
    loggingOut: {
      invoke: {
        src: () => userbase.signOut(),
        onDone: {
          target: "loggedOut",
          actions: assign({ user: undefined }),
        },
        onError: { target: "error" },
      },
    },
    loggedOut: {
      on: {
        LOGIN: { target: "tryingLogin" },
      },
    },
    error: {}, // how would we get here, and does the user care? test!
    // aha, 'user is pending deletion' causes an error, use that
  },
});
