# windowmess
This library provides a request/response style API for the browsers `postMessage` `onmessage` functions.

## Installation
```
npm install --save winmess
```

## Usage
The `winmess` function takes two arguments. The first being `listener` and the second `sender`.

These should be `windows` from the browser, but can really be anything that has a `postMessage` and `addEventListener` on it.

See the [demo](./demo) folder for a fully working example.

`# index.js`
```javascript
import winmess from 'winmess';

const { send } = await winmess(self, document.getElementById('iframe').contentWindow);

const response = await send('convertToUpperCase', 'MiXeDcAsEmEsSaGe');

console.log('response', response);
```

`# one.js`
```javascript
import winmess from 'winmess';

const { watch } = await wrap(self.parent, self);

watch(async (command, value) => {
  if (command === 'convertToUpperCase') {
    return value.toUpperCase();
  }
});

// You can have multiple watchers
watch(async (command, value) => {
  // skip to the next watcher
  return undefined

  // stop here and respond with null
  return null
});
```