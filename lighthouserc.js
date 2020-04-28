module.exports = {
  ci: {
    collect: {
      settings: {
        chromeFlags: '--disable-gpu --no-sandbox --headless',
      },
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'redirects-http': 'off',
        'uses-http2': 'off',
        'image-alt': 'off',
      },
    },
  },
};
