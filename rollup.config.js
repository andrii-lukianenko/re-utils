import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete'

// External dependencies that should not be bundled
const external = ['react', 'react-dom'];

export default [
  // Helpers subpath
  {
    input: 'src/helpers/index.ts',
    external,
    output: [{
      file: 'lib/helpers.cjs',
      format: 'cjs',
    }, {
      file: 'lib/helpers.js',
      format: 'esm',
    }],
    plugins: [
      del({ targets: 'lib/*' }),
      typescript({
        tsconfig: './tsconfig.json'
      }),
    ]
  },
  // Hooks subpath
  {
    input: 'src/hooks/index.ts',
    external,
    output: [{
      file: 'lib/hooks.cjs',
      format: 'cjs',
    }, {
      file: 'lib/hooks.js',
      format: 'esm',
    }],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json'
      }),
    ]
  }
]