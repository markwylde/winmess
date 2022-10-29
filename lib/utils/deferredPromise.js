export default function DeferredPromise () {
  const state = {};

  const promise = new Promise((resolve, reject) => {
    state.resolve = resolve;
    state.reject = reject;
  });
  state.promise = promise;

  return state;
}
