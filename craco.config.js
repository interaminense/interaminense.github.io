const Dotenv = require("dotenv-webpack");

module.exports = {
  webpack: {
    plugins: [new Dotenv()],
  },
};
