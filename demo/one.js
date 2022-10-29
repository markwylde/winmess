import windowmess from '../lib/index.js';

const { send, watch } = await windowmess(self, self.parent);

watch(async (command, value) => {
  if (command === 'convertToUpperCase') {
    return value.toUpperCase();
  }
});

const response = await send('convertToLowerCase', 'MiXeDcAsEmEsSaGe');

console.log('response', response);
