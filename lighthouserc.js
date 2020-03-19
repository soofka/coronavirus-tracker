module.exports = {
  ci: {
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'redirects-http': 'off',
        'uses-http2': 'off',
      },
    },
  },
};
