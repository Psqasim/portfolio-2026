/** @type {import('@lhci/cli').Config} */
module.exports = {
  ci: {
    collect: {
      url: [process.env.LHCI_URL || "http://localhost:3000"],
      numberOfRuns: 1,
      settings: {
        preset: "desktop",
        emulatedFormFactor: "mobile",
        throttlingMethod: "simulate",
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["error", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 0.9 }],
        "first-contentful-paint": ["error", { maxNumericValue: 1500 }],
      },
    },
    upload: { target: "temporary-public-storage" },
  },
};
