/* Cria um ARRAY de uma NodeList por meio do método Array.from() */
// 1º parâmetro: arrayLike
// 2º parâmetro (opcional): função Map que será chamada para cada elemento do array
const movementsUI = Array.from(
  document.querySelectorAll('.movements__value'),
  element => Number(element.textContent.replace(/[^\d-]/g, ''))
);

// console.log(movementsUI);
/* Saída no tipo número e sem o cifrão do Euro:
[4000, -378] 
*/

// ------------------

/* PROBLEM
  The task is: "Given an array of temperatures of one day, calculate the temperature amplitude. Keep in mind that sometimes there might be a sensor error."

  1) Understanding the problem
  - What is temp amplitude? Answer: difference between highest and lowest temp
  - How to compute max and min temperatures?
  - What´s a sensor error? And what to do?

  2) Breaking up into sub-problems
  - How to ignore errors?
  - Find max value in temp array
  - Find min value in temp array
  - Subtract min from max (amplitude) and return it
*/
const temperatures = [3, -2, -6, -1, 'error', 9, 13, 17, 9, 'er', -1000];

// Início da resolução
const calcTempAmplitude = function (temps) {
  // 1º) assumiremos que o primeiro valor já é o máximo
  let max = temps[0];
  let min = temps[0];

  for (let i = 0; i < temps.length; i++) {
    // 2º) REFATORANDO pra parar esta repetição de "temps[i]":
    const curTemp = temps[i];

    // 3º) por último, implementaremos a lógica pra apenas aceitar "números"
    if (typeof curTemp !== 'number') continue;

    if (curTemp > max) max = curTemp;
    if (curTemp < min) min = curTemp;

    // se o valor atual no array for maior que o máximo, então esse valor deve agora ser o máximo
    // if (temps[i] > max) max = temps[i];
    // if (temps[i] < min) min = temps[i];
  }
  console.log(max, min);

  // retornaremos a amplitude
  return max - Math.abs(min);
};

const amplitude = calcTempAmplitude(temperatures);
console.log(amplitude);

// ------------------

/* PROBLEMA
  Capitalizar a primeira letra de cada palavra de uma frase, com algumas exceções
*/
const convertTitleCase = function (title) {
  const exceptions = ['a', 'e', 'o', 'mas', 'pois', 'em', 'com', 'ao'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ');

  return titleCase;
};

console.log(
  convertTitleCase(
    'Com vontade e trabalho a sua vida melhora mas atente-se ao equilíbrio pois pode ser prejudicial!'
  )
);
