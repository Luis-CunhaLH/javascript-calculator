const visor = document.getElementById("visor");
const botoes = document.querySelectorAll("button");

let expressao = "";

// --- funções auxiliares ---
function erro() {
  visor.value = "Erro";
  expressao = "";
}

function limpar() {
  expressao = "";
  visor.value = "";
}

function apagar() {
  if (expressao === "") return;
  expressao = expressao.slice(0, -1);
  visor.value = expressao;
}

function adicionar(valor) {
  expressao += valor;
  visor.value = expressao;
}

// --- parser matemático (sem eval) ---
function calcularExpressao(expr) {
  // troca símbolos visuais
  expr = expr.replace(/×/g, "*").replace(/÷/g, "/");

  // suporta número negativo no início
  if (expr[0] === "-") {
    expr = "0" + expr;
  }

  const tokens = expr.match(/(\d+\.?\d*|\+|\-|\*|\/)/g);
  if (!tokens) throw new Error("Expressão inválida");

  const valores = [];
  const operadores = [];

  function precedencia(op) {
    return (op === "+" || op === "-") ? 1 : 2;
  }

  function aplicarOperador() {
    const b = valores.pop();
    const a = valores.pop();
    const op = operadores.pop();

    if (a === undefined || b === undefined) throw new Error("Erro de cálculo");

    switch (op) {
      case "+": valores.push(a + b); break;
      case "-": valores.push(a - b); break;
      case "*": valores.push(a * b); break;
      case "/": 
        if (b === 0) throw new Error("Divisão por zero");
        valores.push(a / b); 
        break;
    }
  }

  tokens.forEach(token => {
    if (!isNaN(token)) {
      valores.push(Number(token));
    } else {
      while (
        operadores.length &&
        precedencia(operadores[operadores.length - 1]) >= precedencia(token)
      ) {
        aplicarOperador();
      }
      operadores.push(token);
    }
  });

  while (operadores.length) {
    aplicarOperador();
  }

  return valores[0];
}

// --- operações ---
function calcular() {
  if (expressao === "") return;
  try {
    const resultado = calcularExpressao(expressao);
    visor.value = resultado;
    expressao = resultado.toString();
  } catch {
    erro();
  }
}

function raiz() {
  if (expressao === "") return;
  try {
    const numero = calcularExpressao(expressao);
    if (numero < 0) throw new Error();
    const resultado = Math.sqrt(numero);
    visor.value = resultado;
    expressao = resultado.toString();
  } catch {
    erro();
  }
}

function quadrado() {
  if (expressao === "") return;
  try {
    const numero = calcularExpressao(expressao);
    const resultado = Math.pow(numero, 2);
    visor.value = resultado;
    expressao = resultado.toString();
  } catch {
    erro();
  }
}

// --- mapa de ações (melhor que switch) ---
const acoes = {
  "C": limpar,
  "⌫": apagar,
  "=": calcular,
  "√": raiz,
  "x²": quadrado
};

// --- eventos ---
botoes.forEach(botao => {
  botao.addEventListener("click", () => {
    const valor = botao.textContent.trim();

    const acao = acoes[valor];
    if (acao) {
      acao();
    } else {
      adicionar(valor);
    }
  });
});

document.addEventListener("keydown", (e) => {
  const tecla = e.key;

  // Números e ponto
  if (!isNaN(tecla) || tecla === ".") {
    adicionar(tecla);
    return;
  }

  // Operadores
  if (["+", "-", "*", "/"].includes(tecla)) {
    adicionar(tecla);
    return;
  }

  // Enter = calcular
  if (tecla === "Enter") {
    e.preventDefault(); // evita comportamento padrão
    calcular();
    return;
  }

  // Delete = apagar
  if (tecla === "Backspace") {
    apagar();
    return;
  }

  // Esc = limpar
  if (tecla === "Escape") {
    limpar();
    return;
  }

  // R = raiz
  if (tecla === "r") { // raiz
    raiz();
    return;
  }

  // Q = quadrado 
  if (tecla === "q") { // quadrado
    quadrado();
    return;
  }
});