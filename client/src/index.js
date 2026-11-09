import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import {
  ChakraProvider,
  createSystem,
  defaultConfig,
  defineConfig,
} from '@chakra-ui/react';

import { store } from './redux/store';

import { App } from './App';

import './index.css';

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        body: { value: '"Nunito", sans-serif' },
        heading: { value: '"Nunito", sans-serif' },
        mono: { value: 'Menlo, monospace' },
      },
      colors: {
        brand: {
          primary: 'gray.500',
          secondary: 'teal.500',
          backgroundLight: 'gray.50',
          backgroundDark: 'gray.800',
          textPrimary: 'gray.900',
          textSecondary: 'gray.700',
          textMuted: 'gray.500',
          success: 'green.500',
          warning: 'yellow.500',
          error: 'red.500',
        },
      },
    },
    styles: {
      global: {
        'html, body': {
          bg: 'brand.backgroundLight',
          color: 'brand.textPrimary',
          fontFamily: 'body',
        },
      },
    },
    components: {
      Button: {
        baseStyle: {
          fontWeight: 'bold',
          borderRadius: 'md',
        },
        variants: {
          solid: {
            bg: 'brand.primary',
            color: 'white',
            _hover: { bg: 'gray.600' },
          },
          outline: {
            borderColor: 'brand.primary',
            color: 'brand.primary',
            _hover: { bg: 'gray.50' },
          },
          ghost: {
            color: 'brand.primary',
            _hover: { bg: 'gray.50' },
          },
        },
      },
    },
  },
});

const system = createSystem(defaultConfig, config);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider value={system}>
        <App />
      </ChakraProvider>
    </Provider>
  </React.StrictMode>
);
