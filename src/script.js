const visor = document.getElementById("visor");
const botoes = document.querySelectorAll("button");

let expressao = "";

botoes.forEach(botao => {
  botao.addEventListener("click", () => {
    const valor = botao.textContent;

    switch (valor) {
      case "C":
        expressao = "";
        visor.value = "";
        break;

      case "⌫":
        expressao = expressao.slice(0, -1);
        visor.value = expressao;
        break;

      case "=":
        try {
          let conta = expressao.replace(/÷/g, "/");
          visor.value = eval(conta);
          expressao = visor.value;
        } catch {
          visor.value = "Erro";
          expressao = "";
        }
        break;

      case "√":
        try {
          let numero = eval(expressao);
          visor.value = Math.sqrt(numero);
          expressao = visor.value;
        } catch {
          visor.value = "Erro";
          expressao = "";
        }
        break;

      case "x²":
        try {
          let numero = eval(expressao);
          visor.value = Math.pow(numero, 2);
          expressao = visor.value;
        } catch {
          visor.value = "Erro";
          expressao = "";
        }
        break;

      default:
        expressao += valor;
        visor.value = expressao;
    }
  });
});