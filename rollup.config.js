import copy from 'rollup-plugin-copy';

export default {
  input: 'src/svg-editable-text.js',
  output: {
    name: 'SvgEditableText',
    file: 'dist/svg-editable-text.min.js',
    format: 'iife'
  },
  plugins: [
    copy({
      'src/svg-editable-text.css': 'dist/svg-editable-text.min.css'
    })
  ]
};
