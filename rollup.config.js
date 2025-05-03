import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';

const packageJSON = require('./package.json');

export default [{
  input: 'index.js',  // Entry file
  output: [
    // {
    //   file: packageJSON.main,  // CommonJS build for Node.js      
    //   format: 'cjs',
    //   sourcemap: true
    // },
    {
      file: packageJSON.module,
      format: 'esm',
      sourcemap: true
    }
  ],
  plugins: [
    resolve(),  // to locate node_modules dependencies
    commonjs(), // to convert CommonJS modules to ES6
    babel({
      exclude: 'node_modules/**', // Exclude node_modules
      presets: ['@babel/preset-react'], // Use React preset
    }),
  ],
  external: ["react", "react-dom"],
}
]
