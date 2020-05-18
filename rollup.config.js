import babel from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser";

export default {
  input: 'src/index.js',
  output: {
    file: 'site/assets/js/bundle.min.js',
    banner: `/**
 * The readable version of this code is at:
 * https://github.com/chrispalmeri/really-sketch
 * 
 * MIT License
 * Copyright (c) 2017 Chris Palmeri
 *
 * @preserve
 */
`
  },
  plugins: [
    babel({
      babelHelpers: 'bundled'
    }),
    terser({
      output: {
        max_line_len: 140
      }
    })
  ]
};