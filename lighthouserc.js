module.exports = {
  ci: {
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'uses-text-compression': 'off',
        'redirects-http': 'off',
        'uses-http2': 'off',
      },
    },
  },
};
