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
        // 'uses-text-compression': 'off',
        'redirects-http': 'off',
        'uses-http2': 'off',
        'image-alt': 'off',
      },
    },
  },
};
