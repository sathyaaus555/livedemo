const $ = (selector) => document.querySelector(selector);
const money = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
const login = $('#login');
const dashboard = $('#dashboard');

async function refresh() {
  const response = await fetch('/api/accounts');
  render(await response.json());
}
function render(accounts) {
  $('#accounts').replaceChildren(...accounts.map((account) => {
    const card = document.createElement('article');
    card.className = 'account';
    const id = document.createElement('div'); id.className = 'muted'; id.textContent = account.id;
    const name = document.createElement('h3'); name.textContent = account.name;
    const label = document.createElement('div'); label.className = 'muted'; label.textContent = 'Available balance';
    const balance = document.createElement('div'); balance.className = 'balance'; balance.textContent = money(account.balance);
    card.append(id, name, label, balance); return card;
  }));
}
$('#login-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  $('#greeting').textContent = $('#username').value.trim() || 'there';
  await refresh(); login.hidden = true; dashboard.hidden = false;
});
$('#logout').addEventListener('click', () => { dashboard.hidden = true; login.hidden = false; $('#password').value = ''; $('#message').textContent = ''; });
$('#transfer-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const message = $('#message'); message.textContent = ''; message.classList.remove('error');
  try {
    const response = await fetch('/api/transfer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ from: $('#from').value, to: $('#to').value, amount: $('#amount').value }) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    render(result.accounts); message.textContent = result.message; $('#amount').value = '';
  } catch (error) { message.classList.add('error'); message.textContent = error.message || 'Transfer failed.'; }
});
