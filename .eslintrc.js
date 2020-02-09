module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/adjacent-overload-signatures': 'warn',
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/ban-types': 'warn',
    '@typescript-eslint/class-name-casing': 'warn',
    '@typescript-eslint/consistent-type-assertions': 'warn',
    '@typescript-eslint/consistent-type-definitions': 'warn',
    '@typescript-eslint/explicit-member-accessibility': [
      'off',
      {
        accessibility: 'explicit'
      }
    ],
    '@typescript-eslint/interface-name-prefix': 'warn',
    '@typescript-eslint/member-delimiter-style': [
      'off',
      {
        multiline: {
          delimiter: 'none',
          requireLast: true
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false
        }
      }
    ],
    '@typescript-eslint/member-ordering': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-empty-interface': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-misused-new': 'warn',
    '@typescript-eslint/no-namespace': 'warn',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/prefer-for-of': 'warn',
    '@typescript-eslint/prefer-function-type': 'warn',
    '@typescript-eslint/prefer-namespace-keyword': 'warn',
    '@typescript-eslint/quotes': 'off',
    '@typescript-eslint/semi': ['off', null],
    '@typescript-eslint/triple-slash-reference': 'warn',
    '@typescript-eslint/type-annotation-spacing': 'warn',
    '@typescript-eslint/unified-signatures': 'warn',
    'arrow-body-style': 'warn',
    'arrow-parens': ['warn', 'as-needed'],
    camelcase: 'warn',
    'comma-dangle': 'off',
    complexity: 'off',
    'constructor-super': 'warn',
    curly: 'warn',
    'dot-notation': 'warn',
    'eol-last': 'warn',
    eqeqeq: ['warn', 'smart'],
    'guard-for-in': 'warn',
    'id-blacklist': [
      'warn',
      'any',
      'Number',
      'number',
      'String',
      'string',
      'Boolean',
      'boolean',
      'Undefined',
      'undefined'
    ],
    'id-match': 'warn',
    'import/order': 'off',
    'max-classes-per-file': ['warn', 1],
    'max-len': 'off',
    'new-parens': 'warn',
    'no-bitwise': 'warn',
    'no-caller': 'warn',
    'no-cond-assign': 'warn',
    'no-console': 'warn',
    'no-debugger': 'warn',
    'no-empty': 'off',
    'no-eval': 'warn',
    'no-fallthrough': 'off',
    'no-invalid-this': 'off',
    'no-multiple-empty-lines': 'warn',
    'no-new-wrappers': 'warn',
    'no-shadow': [
      'warn',
      {
        hoist: 'all'
      }
    ],
    'no-throw-literal': 'warn',
    'no-trailing-spaces': 'warn',
    'no-undef-init': 'warn',
    'no-underscore-dangle': 'warn',
    'no-unsafe-finally': 'warn',
    'no-unused-expressions': 'warn',
    'no-unused-labels': 'warn',
    'no-var': 'warn',
    'object-shorthand': 'warn',
    'one-var': ['warn', 'never'],
    'prefer-arrow/prefer-arrow-functions': 'off',
    'prefer-const': 'warn',
    'quote-props': ['warn', 'as-needed'],
    radix: 'warn',
    'space-before-function-paren': [
      'warn',
      {
        anonymous: 'never',
        asyncArrow: 'always',
        named: 'never'
      }
    ],
    'spaced-comment': 'warn',
    'use-isnan': 'warn',
    'valid-typeof': 'off'
  }
};
