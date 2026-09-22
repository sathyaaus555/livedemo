export function createBank() {
  const accounts = {
    ACC001: { id: 'ACC001', name: 'Everyday Account', cents: 100000 },
    PAY001: { id: 'PAY001', name: 'Beneficiary Account', cents: 50000 }
  };

  return {
    accounts() { return Object.values(accounts).map(({ id, name, cents }) => ({ id, name, balance: cents / 100 })); },
    transfer({ from, to, amount }) {
      const cents = Math.round(Number(amount) * 100);
      if (!Number.isFinite(Number(amount)) || !Number.isSafeInteger(cents) || cents <= 0 || Math.abs(Number(amount) * 100 - cents) > 1e-7) throw new Error('Enter an amount greater than zero with at most two decimal places.');
      if (from === to) throw new Error('Choose different source and destination accounts.');
      if (from !== 'ACC001' || to !== 'PAY001') throw new Error('Choose ACC001 as the source and PAY001 as the beneficiary.');
      // Conference demo v1: intentionally no available-balance validation.
      accounts[from].cents -= cents;
      accounts[to].cents += cents;
      return this.accounts();
    }
  };
}
