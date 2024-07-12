import { mergeConfig } from 'vite';

import pckg from '../package.json';

export default {
  stories: ['../src/components/**/*.mdx', '../src/*.mdx', '../src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/preset-scss',
    '@storybook/addon-themes',
    'storybook-dark-mode',
    '@storybook/addon-storysource',
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
        babelOptions: {},
        sourceLoaderOptions: null,
        transcludeMarkdown: true,
      },
    },
    '@storybook/addon-viewport',
    '@storybook/addon-mdx-gfm',
  ],

  refs: {
    '@chakra-ui/react': {
      disable: true,
    },
  },

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  features: { emotionAlias: false },

  async viteFinal(config, {
    configType,
  }) {
    const resolvedConfig = {
      ...config,
    };

    if (configType === 'PRODUCTION') {
      resolvedConfig.base = './';
      resolvedConfig.build = {
        ...resolvedConfig.build,
        assetsInlineLimit: 0,
      };
    }
    const mergedConfig = mergeConfig(resolvedConfig, {
      plugins: [],
    });

    mergedConfig.plugins = mergedConfig.plugins.filter(({ name }) => name !== 'vite-plugin-eslint')
    return mergedConfig
  },

  docs: {
    autodocs: true,
    defaultName: 'Documentation',
  }
};
