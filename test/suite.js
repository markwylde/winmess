import createTestSuite from 'just-tap';
import wrap from '../lib/index.js';

const { test, run } = createTestSuite();

const resetIframes = () => {
  document.body.innerHTML = `
    <iframe id="frame1" src="./one.html"></iframe>
    <iframe id="frame2" src="./one.html"></iframe>
  `;

  return {
    frame1: document.getElementById('frame1'),
    frame2: document.getElementById('frame2')
  };
};

test('simple two way communication', async t => {
  const { frame1, frame2 } = resetIframes();

  const [{ send }, { watch }] = await Promise.all([
    wrap(frame2.contentWindow, frame1.contentWindow),
    wrap(frame1.contentWindow, frame2.contentWindow)
  ]);

  watch(async (command, value) => {
    if (command === 'convertToUpperCase') {
      return value.toUpperCase();
    }
  });

  const response = await send('convertToUpperCase', 'MiXeDcAsEmEsSaGe');

  t.equal(response, 'MIXEDCASEMESSAGE');
});

test('no watcher responds', async t => {
  const { frame1, frame2 } = resetIframes();

  const [{ send }] = await Promise.all([
    wrap(frame2.contentWindow, frame1.contentWindow),
    wrap(frame1.contentWindow, frame2.contentWindow)
  ]);

  const response = await send('notFound', 'MiXeDcAsEmEsSaGe');

  t.equal(response, undefined);
});

test('only first watcher responds', async t => {
  const { frame1, frame2 } = resetIframes();

  const [{ send }, { watch }] = await Promise.all([
    wrap(frame2.contentWindow, frame1.contentWindow),
    wrap(frame1.contentWindow, frame2.contentWindow)
  ]);

  watch(async (command, value) => {
    if (command === 'convertToUpperCase') {
      return value.toUpperCase();
    }
  });

  watch(async () => {
    t.fail('expected watcher to not be called');
  });

  const response = await send('convertToUpperCase', 'MiXeDcAsEmEsSaGe');

  t.equal(response, 'MIXEDCASEMESSAGE');
});

test('only second watcher responds', async t => {
  const { frame1, frame2 } = resetIframes();

  const [{ send }, { watch }] = await Promise.all([
    wrap(frame2.contentWindow, frame1.contentWindow),
    wrap(frame1.contentWindow, frame2.contentWindow)
  ]);

  watch(async () => {
    t.pass('expected watcher to not be called');
  });

  watch(async (command, value) => {
    if (command === 'convertToUpperCase') {
      return value.toUpperCase();
    }
  });

  const response = await send('convertToUpperCase', 'MiXeDcAsEmEsSaGe');

  t.equal(response, 'MIXEDCASEMESSAGE');
});

test('first watcher returns null', async t => {
  const { frame1, frame2 } = resetIframes();

  const [{ send }, { watch }] = await Promise.all([
    wrap(frame2.contentWindow, frame1.contentWindow),
    wrap(frame1.contentWindow, frame2.contentWindow)
  ]);

  watch(async () => {
    t.pass('expected watcher to be called');
    return null;
  });

  watch(async (command, value) => {
    t.fail('expected watcher not be called');
  });

  const response = await send('convertToUpperCase', 'MiXeDcAsEmEsSaGe');

  t.equal(response, null);
});

run({ concurrency: 1 }).then(stats => {
  console.log('$$TEST_BROWSER_CLOSE$$:' + JSON.stringify(stats));
});
