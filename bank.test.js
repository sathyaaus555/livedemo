import test from 'node:test';
import assert from 'node:assert/strict';
import { createBank } from './bank.js';

test('transfers money and updates both balances', () => {
  const bank = createBank();
  assert.deepEqual(bank.transfer({ from: 'ACC001', to: 'PAY001', amount: 200 }).map(a => a.balance), [800, 700]);
});
test('rejects zero and negative amounts', () => {
  for (const amount of [0, -10]) assert.throws(() => createBank().transfer({ from: 'ACC001', to: 'PAY001', amount }), /greater than zero/);
});
test('rejects identical source and destination accounts', () => {
  assert.throws(() => createBank().transfer({ from: 'ACC001', to: 'ACC001', amount: 10 }), /different/);
});
test('rejects a transfer exceeding the available balance (expected demo failure)', () => {
  const bank = createBank();
  assert.throws(() => bank.transfer({ from: 'ACC001', to: 'PAY001', amount: 1500 }), /insufficient|balance/i);
});
