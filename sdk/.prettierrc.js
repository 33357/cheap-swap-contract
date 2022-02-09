module.exports = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semicolons: true,
  singleQuote: true,
  trailingComma: 'none',
  bracketSpacing: true,
  jsxBracketSameLine: true,
  proseWrap: 'never',
  endOfLine: 'lf',
  jsxSingleQuote: false,
  overrides: [
    {
      files: '.prettierrc',
      options: {
        parser: 'json'
      }
    }
  ]
};
