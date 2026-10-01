import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createBankServer } from './server.js';

test('bank API serves the app, transfers funds, and preserves balances on invalid requests', async (t) => {
  const server = createBankServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  const accounts = async () => (await fetch(`${base}/api/accounts`)).json();
  const transfer = body => fetch(`${base}/api/transfer`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  });
  const page = await fetch(base);
  assert.equal(page.status, 200);
  assert.match(await page.text(), /login-form/);
  for (const asset of ['/app.js', '/style.css']) assert.equal((await fetch(base + asset)).status, 200);
  assert.deepEqual((await accounts()).map(a => a.balance), [1000, 500]);
  const response = await transfer({ from: 'ACC001', to: 'PAY001', amount: 200.25 });
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.message, 'Transfer Successful');
  assert.deepEqual(result.accounts.map(a => a.balance), [799.75, 700.25]);
  for (const body of [
    { from: 'ACC001', to: 'PAY001', amount: 0 },
    { from: 'ACC001', to: 'PAY001', amount: -10 },
    { from: 'ACC001', to: 'ACC001', amount: 10 },
    { from: 'PAY001', to: 'ACC001', amount: 10 },
    { from: 'ACC001', to: 'PAY001', amount: 'invalid' }
  ]) assert.equal((await transfer(body)).status, 400);
  assert.deepEqual(await accounts(), result.accounts);
  const malformed = await fetch(`${base}/api/transfer`, { method: 'POST', body: '{' });
  assert.equal(malformed.status, 400);
  assert.equal((await malformed.json()).error, 'Invalid request.');
  assert.equal((await fetch(`${base}/missing`)).status, 404);
});
