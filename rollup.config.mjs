import nodejs from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'mxml.mjs',
  output: {
    file: 'mxml.js',
    format: 'iife'
  },
  plugins: [nodejs(), commonjs(), skip('jzz', 'jzz-midi-smf')]
};

function skip(...args) {
  return {
    name: 'skip',
    resolveId(x) {
      for (var a of args) if (a == x) return x;
      return null;
    },
    load(x) {
      for (var a of args) if (a == x) return 'export default {}';
      return null;
    }
  };
}