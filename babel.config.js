module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    ['env', { modules: false }]
  ],
  plugins: [
    ['import', {
      libraryName: 'ant-design-vue',
      libraryDirectory: 'es',
      style: 'css'
    }],
    '@vue/babel-plugin-jsx'
  ],
  env: {
    test: {
      presets: [['env', { targets: { node: 'current' } }]]
    }
  }
};
