import DeferredPromise from './utils/deferredPromise.js';

export default async function wrap (listener, sender) {
  window.listener = listener;
  window.sender = sender;
  if (!listener || !sender) {
    throw new Error('wrap must be given a "listener" and "sender" as arguments');
  }

  const { resolve, promise } = new DeferredPromise();

  const callbacks = {};
  let callbackIndex = 0;

  listener.addEventListener('message', event => {
    if (event.data[0] === 'hello:0') {
      sender.postMessage(['hello:1'], '*');
      return;
    }

    if (event.data[0] === 'hello:1') {
      resolve();
      return;
    }

    if (event.data[0] === 'R') {
      const callback = callbacks[event.data[1]];
      callback?.resolve?.(event.data[2]);
    }
  });

  const timer = setInterval(() => {
    sender.postMessage(['hello:0'], '*');
  }, 1);
  await promise;
  clearInterval(timer);

  const watchers = [];

  listener.addEventListener('message', async event => {
    if (event.data[0].startsWith?.('hello:')) {
      return;
    }

    const currentCallbackIndex = event.data[1];

    let found = false;
    for (const watcher of watchers) {
      const result = event.data[2] && await watcher(...event.data[2]);

      if (result || result === null) {
        found = true;
        sender.postMessage(['R', currentCallbackIndex, result]);
        break;
      }
    }

    if (!found) {
      sender.postMessage(['R', currentCallbackIndex, undefined]);
    }
  });

  return {
    watch: watchers.push.bind(watchers),
    send: (...args) => {
      callbackIndex = callbackIndex + 1;
      const currentCallbackIndex = callbackIndex;

      const deferred = new DeferredPromise();

      callbacks[currentCallbackIndex] = deferred;

      sender.postMessage(['S', currentCallbackIndex, args], '*');

      return deferred.promise;
    }
  };
}
