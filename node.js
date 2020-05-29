var userbase = require("userbase-js");

userbase
  .init({
    appId: "80bff789-a1b2-4f66-b931-05905ad36241",
  })
  .then((result) => console.log(result))
  .catch((error) => console.log(error));
