module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // Add CSS nano for production minification
    ...(process.env.NODE_ENV === 'production' ? {
      cssnano: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          normalizeWhitespace: true,
          colormin: true,
          reduceIdents: true,
          mergeRules: true,
        }]
      }
    } : {})
  }
}