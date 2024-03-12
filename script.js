'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/* Início do projeto da aula! */
// Aula: 148
// Aula: 164 implementando o método sort()
const displayMovements = function (movements, sort = false) {
  // limpar o html "antigo/anterior"
  containerMovements.innerHTML = '';

  /* sort() */
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  // escrever o html "novo/atual"
  movs.forEach(function (movement, i) {
    // qual será o tipo
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    // agora vamos criar o html como o do exemplo
    const html = `
  <div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      i + 1
    }º ${type}</div>
    <div class="movements__value">${movement}€</div>
  </div>
    `;

    // inserir no html real
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);

// Aula: 154
const calcDisplayBalance = function (acc) {
  // adicionamos nova propriedade 'balance' a cada objeto de conta, para ter acesso no momento
  // da "transferência". Por isso tb refatoramos essa função passando toda a conta (acc) como
  // argumento. Antes ela existia apenas aqui, dentro desta função!
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.textContent = `${acc.balance}€`;
};
// calcDisplayBalance(account1.movements);

// Aula: 156
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  // O segundo "filter()" é separa apenas os valores de 1 para cima
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, array) => {
      // console.log(array); por esse array, nós conseguimos ver as parada como estão!
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};
// calcDisplaySummary(account1.movements);

// Aula: 152
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    // aqui adicionamos 'username' como nova propriedade em cada objeto a partir da existente 'owner'
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

// Refatoração de 3 funções para 1 somente. Agora podemos chamá-la onde quisermos
const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);
  // Display balance
  calcDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
};

// Aula: 159
// Esta variável precisa ser definida FORA DA FUNÇÃO, porque precisaremos dessa informação
// sobre conta em OUTRAS operações, como em uma "transferência de dinheiro"
/* 'currentAccount' será uma REFERÊNCIA para o MESMO OBJETO que apontar na "memória HEAP".
Logo essa variável não será uma cópia do próprio objeto, apenas uma variável apontando pro mesmo endereço da memória heap.
Ela literalmente será um destes 4 objetos: 
const accounts = [account1, account2, account3, account4];   
*/
let currentAccount;
// Event handler
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  // "?" Optional chaining: para evitar ERRO caso não exista o "username" digitado no input
  // logo, o PIN somente será lido se primeiro existir "currentAccount"
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Mostrar UI e mensagem de boas-vindas
    labelWelcome.textContent = `Olá, ${currentAccount.owner.split(' ')[0]}!`;
    containerApp.style.opacity = 100;
    // Limpar os campos após login:
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // REFATORANDO as funções de atualização dos valores na tela
    updateUI(currentAccount);
  }
});

// Aula: 160 (transfer money) com método "find"
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    // "inputTransferTo.value" é o que fará acontecer, pois terá o username digitado, para
    // então fazer a busca pelo método find() dentro do array de contas "accounts"
    acc => acc.username === inputTransferTo.value
  );
  // Limpando os campos de input
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAcc &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Fazendo a transferência
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Mostrando o update na tela
    // Mas é uma prática RUIM! Vamos refatorar
    /*   displayMovements(currentAccount.movements);
    calcDisplayBalance(currentAccount);
    calcDisplaySummary(currentAccount); */
    updateUI(currentAccount);
  }
});

// Aula 162 (Loan) com método "some"
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);

    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

// Aula 161 (Delete) com método "findIndex"
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // Delete account
    // o método 'splice()' já muta/transforma o array, por isso não precisamos salvar o resultado em nenhum lugar
    accounts.splice(index, 1);

    // logout (hide UI)
    containerApp.style.opacity = 0;
  }

  // Limpar os campos caso o usuário erre as credencias
  inputCloseUsername.value = inputClosePin.value = '';
});

// Continuação da aula 164 com método sort()
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  // agora precisamos inverter 'sorted' para retornar ao valor 'false' novamente!
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
/////////////////////////////////////////////////
