import { Machine, assign } from "xstate";
import userbase from "userbase-js";

function testPromise() {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log("testPromise -> about to resolve");
      resolve();
    }, 1000);
  });
}

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

        // src: (context, event) => testPromise, // works
        src: "userbaseLogin", // doesn't work

        onDone: {
          target: "loggedIn",
          actions: assign({ user: (context, event) => event.data }),
        },
        onError: {
          target: "loggedOut",
          actions: assign({ error: (context, event) => event.data }),
        },
      },
      /*
      invoke: {
        id: "tryLogin",
        // src: testPromise,
        // src: "userbaseLogin",

        src: (context, event) => {
          // console.log("App -> useMachine -> userbaseLogin(start)");
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

          // console.log("App -> useMachine -> userbaseLogin(done)");
        },

        onDone: [
          {
            target: "loggedIn",
          },
          {
            target: "loggedIn",
            actions: [
              () => console.log("-> tryingLogin:invoke:onDone"),
              assign({ user: (_, event) => event.data.user }),
            ],
          },
        ],
        onError: {
          target: "loginFailed",
          actions: () => console.log("-> tryingLogin:invoke:onError"),
        },
      },
      */
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
