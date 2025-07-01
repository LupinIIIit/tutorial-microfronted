const {
  withNativeFederation,
  shareAll,
} = require("@angular-architects/native-federation/config");

module.exports = withNativeFederation({
  exposes: {
    "./shared-service": "./src/app/core/services/shared.service.ts",
    // Layout e tema
    "./theme-service": "./src/app/core/services/theme.service.ts",
    "./shared-layout": "./src/app/shared-layout.component.ts",
  },
  remotes: {
    products: "http://localhost:8081/remoteEntry.json",
    cart: "http://localhost:8082/remoteEntry.json",
    profile: "http://localhost:8083/remoteEntry.json",
  },
  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: "auto",
    }),
  },

  skip: [
    "rxjs/ajax",
    "rxjs/fetch",
    "rxjs/testing",
    "rxjs/webSocket",
    // Add further packages you don't need at runtime
  ],

  // Please read our FAQ about sharing libs:
  // https://shorturl.at/jmzH0

  features: {
    // New feature for more performance and avoiding
    // issues with node libs. Comment this out to
    // get the traditional behavior:
    ignoreUnusedDeps: true,
  },
});
