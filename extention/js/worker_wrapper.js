try {
    importScripts(
      "background.js",
      "adapter/DefaultParser.js",
      "adapter/OldCsMoneyParser.js",
      "adapter/SteamParser.js",
      "adapter/BuffParser.js",
      "adapter/CsMoneyParser.js",
    );
} catch (e) {
    console.error(e);
}