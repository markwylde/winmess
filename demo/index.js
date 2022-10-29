import windowmess from '../lib/index.js';

const { send, watch } = await windowmess(window, document.getElementById('iframe').contentWindow);

watch(async (command, value) => {
  if (command === 'convertToLowerCase') {
    return value.toLowerCase();
  }
});

const response = await send('convertToUpperCase', 'MiXeDcAsEmEsSaGe');

console.log('response', response);
