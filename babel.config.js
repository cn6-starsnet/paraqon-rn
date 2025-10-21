module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@': './src',
          '@components': './src/components',
          '@svgs': './src/assets/svgs',
          '@images': './src/assets/images',
          '@utils': './src/utils',
          '@hooks': './src/hooks',
          '@pages': './src/pages',
          '@constants/*': './src/constants'
        },
      },
    ],
  ],
};