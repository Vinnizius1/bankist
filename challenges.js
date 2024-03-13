/* Criando um ARRAY de uma NodeList por meio do método Array.from() */
// 1º parâmetro: arrayLike
// 2º parâmetro (opcional): função Map que será chamada para cada elemento do array
const movementsUI = Array.from(
  document.querySelectorAll('.movements__value'),
  element => Number(element.textContent.replace(/[^\d-]/g, ''))
);

console.log(movementsUI); /* Saída no tipo número e sem o cifrão do Euro:
[4000, -378] 
*/
