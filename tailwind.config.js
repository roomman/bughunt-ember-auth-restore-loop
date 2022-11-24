'use strict';

const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, './app', 'index.html'),
    join(__dirname, './app', '**', '*.{hbs,js}'),
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
