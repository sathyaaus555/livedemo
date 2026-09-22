# ABC Bank fund transfer demo

Requires Node.js 18 or newer. No install step or database is needed.

```bash
npm start
```

Open http://localhost:3000 and enter any demo username and password. The login is a screen for the conference demo, not authentication. Account balances are held in memory and reset when the server restarts.

```bash
npm test
```

Three tests pass and one test intentionally fails: v1 permits a $1,500 transfer from an account with $1,000. The failing test exposes the missing balance validation for the keynote demonstration.

In Windows PowerShell, if `npm.ps1` is blocked, use `npm.cmd start` and `npm.cmd test`.
