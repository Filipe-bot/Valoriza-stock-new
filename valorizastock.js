<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <title>Valoriza Stock</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>
  <style>
    body {
      margin: 0;
      font-family: 'Times New Roman', serif;
      background-color: #cc5500;
    }
    header {
      background-color: #fff;
      text-align: center;
      padding: 20px;
      border-bottom: 2px solid #ccc;
    }
    header h1 {
      margin: 0;
      color: #cc5500;
    }
    .form-container {
      background-color: white;
      width: 400px;
      margin: 50px auto;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,0.2);
    }
    .form-container .icons {
      display: flex;
      justify-content: space-around;
      margin-bottom: 20px;
      font-size: 30px;
      color: #cc5500;
    }
    .form-container input {
      width: 100%;
      margin-bottom: 10px;
      padding: 10px;
    }
    .form-container button {
      width: 100%;
      background-color: #cc5500;
      color: white;
      padding: 10px;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
    }
    .main {
      padding: 20px;
    }
    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: white;
      padding: 10px 20px;
      border-bottom: 2px solid #ccc;
    }
    .top-bar h2 {
      color: #cc5500;
      margin: 0;
    }
    .top-bar button, .top-bar select {
      margin-left: 10px;
      padding: 5px 10px;
    }
    .tabs {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
    .tab-btn {
      flex: 1;
      padding: 15px;
      background: #fff;
      border: 1px solid #cc5500;
      color: #cc5500;
      cursor: pointer;
      transition: 0.3s;
      font-weight: bold;
    }
    .tab-btn.active {
      background: #cc5500;
      color: white;
    }
    .tab-content {
      background: white;
      padding: 20px;
      border-radius: 10px;
      margin-top: 10px;
      animation: fadein 0.3s;
    }
    .tab-content input, .tab-content select {
      display: block;
      width: 100%;
      margin-bottom: 10px;
      padding: 10px;
    }
    .tab-content button {
      background-color: #cc5500;
      color: white;
      border: none;
      padding: 10px;
      width: 100%;
      border-radius: 5px;
      cursor: pointer;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      background-color: white;
    }
    th, td {
      border: 1px solid #ccc;
      padding: 10px;
      text-align: center;
    }
    th {
      background-color: #f2f2f2;
    }
    @keyframes fadein {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .pdf-header, .csv-header {
      margin: 20px 0;
      font-size: 18px;
      font-weight: bold;
    }
  </style>
</head>
<body>

<header>
  <h1>Controlo de Stock</h1>
  <p>Organize o seu armazém com inteligência</p>
</header>

<div class="form-container">
  <div class="icons">
    <i class="fas fa-calculator" title="Calculadora"></i>
    <i class="fas fa-balance-scale" title="Balança"></i>
    <i class="fas fa-warehouse" title="Armazém"></i>
  </div>
  <h2>Registo da Empresa</h2>
  <input type="text" id="empresa" placeholder="Nome da Empresa">
  <input type="email" id="email" placeholder="Email">
  <input type="tel" id="telefone" placeholder="Número de Telefone">
  <button onclick="mostrarFicha()">Registar</button>
</div>

<div class="main" style="display:none;" id="ficha">
  <div class="top-bar">
    <h2>Ficha de Armazém</h2>
    <div>
      <select id="metodoContabil" onchange="recalcularEstoque()">
        <option value="fifo">FIFO</option>
        <option value="lifo">LIFO</option>
        <option value="cmp">CMP</option>
      </select>
      <button onclick="gerarPDF()">Gerar PDF</button>
      <button onclick="exportarCSV()">Exportar CSV</button>
      <button onclick="logout()" style="background-color:red; color:white;">Logout</button>
    </div>
  </div>

  <div class="tabs">
    <button class="tab-btn active" onclick="toggleTab('compra')">Compra</button>
    <button class="tab-btn" onclick="toggleTab('venda')">Venda</button>
    <button class="tab-btn" onclick="toggleTab('devolucao')">Devolução</button>
    <button class="tab-btn" onclick="toggleTab('existencias')">Existências</button>
  </div>

  <div id="compra" class="tab-content active">
    <h3>Compra</h3>
    <input type="number" id="compra-quantidade" placeholder="Quantidade">
    <input type="number" id="compra-preco" placeholder="Preço por Unidade (Kz)">
    <button onclick="adicionar('compra')">Adicionar Compra</button>
  </div>

  <div id="venda" class="tab-content">
    <h3>Venda</h3>
    <input type="number" id="venda-quantidade" placeholder="Quantidade">
    <input type="number" id="venda-preco" placeholder="Preço por Unidade (Kz)">
    <button onclick="adicionar('venda')">Adicionar Venda</button>
  </div>

  <div id="devolucao" class="tab-content">
    <h3>Devolução</h3>
    <select id="tipoDevolucao">
      <option value="compra">Devolução de Compra</option>
      <option value="venda">Devolução de Venda</option>
    </select>
    <input type="number" id="dev-quantidade" placeholder="Quantidade">
    <input type="number" id="dev-preco" placeholder="Preço por Unidade (Kz)">
    <button onclick="adicionar('devolucao')">Adicionar Devolução</button>
  </div>

  <div id="existencias" class="tab-content">
    <h3>Gestão de Existências</h3>
    <input type="number" id="quantidade-existencias" value="0" placeholder="Total Existências">
    <input type="number" id="preco-existencias" value="0" placeholder="Preço Médio (Kz)">
    <button onclick="atualizarExistencias()">Atualizar Existências</button>
  </div>

  <table id="tabela">
    <thead>
      <tr>
        <th>Data</th>
        <th>Descrição</th>
        <th>Entrada (Qtd * Preço = Valor)</th>
        <th>Saída (Qtd * Preço = Valor)</th>
        <th>Existências (Qtd * Preço = Valor)</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>
</div>

<script>
  let existencias = 0;
  let historico = { fifo: [], lifo: [], cmp: [] };

  function mostrarFicha() {
    document.querySelector('.form-container').style.display = 'none';
    document.getElementById('ficha').style.display = 'block';
  }

  function toggleTab(tab) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tab).classList.add('active');
    document.querySelector(`.tab-btn[onclick="toggleTab('${tab}')"]`).classList.add('active');
  }

  function adicionar(tipo) {
    let quantidade = parseInt(document.getElementById(tipo + '-quantidade').value);
    let preco = parseFloat(document.getElementById(tipo + '-preco').value);
    let data = new Date().toLocaleDateString();
    let descricao = tipo.charAt(0).toUpperCase() + tipo.slice(1);
    let entrada = '', saida = '';

    if (tipo === 'compra' || tipo === 'devolucao') {
      entrada = `${quantidade} * ${preco.toFixed(2)} = ${(quantidade * preco).toFixed(2)} Kz`;
      if (tipo === 'devolucao' && document.getElementById('tipoDevolucao').value === 'compra') {
        existencias += quantidade; // Aumenta as existências se for devolução de compra
      }
      historico.fifo.push({ tipo, quantidade, preco, data });
      historico.lifo.unshift({ tipo, quantidade, preco, data });
    } else if (tipo === 'venda') {
      if (quantidade > existencias) {
        return alert("Estoque insuficiente.");
      }
      saida = `${quantidade} * ${preco.toFixed(2)} = ${(quantidade * preco).toFixed(2)} Kz`;
      existencias -= quantidade; // Diminui as existências
      historico.fifo.pop();
      historico.lifo.shift();
    }

    const existenciaTexto = `${existencias} * ${preco.toFixed(2)} = ${(existencias * preco).toFixed(2)} Kz`;
    const linha = `<tr><td>${data}</td><td>${descricao}</td><td>${entrada}</td><td>${saida}</td><td>${existenciaTexto}</td></tr>`;
    document.querySelector('#tabela tbody').insertAdjacentHTML('beforeend', linha);
    salvarTabela();
  }

  function salvarTabela() {
    localStorage.setItem('tabela', document.querySelector('#tabela tbody').innerHTML);
    localStorage.setItem('existencias', existencias);
  }

  function carregarTabela() {
    const dados = localStorage.getItem('tabela');
    if (dados) document.querySelector('#tabela tbody').innerHTML = dados;
    const ex = localStorage.getItem('existencias');
    if (ex) existencias = parseInt(ex);
  }

  function atualizarExistencias() {
    let novaQuantidade = parseInt(document.getElementById('quantidade-existencias').value);
    let novoPreco = parseFloat(document.getElementById('preco-existencias').value);
    existencias = novaQuantidade; // Atualiza as existências

    // Recalcular a tabela com base no novo valor de existências
    salvarTabela();
  }

  async function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("Relatório de Stock", 10, 10);
    doc.text(`Existências Atuais: ${existencias}`, 10, 20);
    let y = 30;
    document.querySelectorAll('#tabela tbody tr').forEach(row => {
      const linha = [...row.children].map(td => td.innerText).join(" | ");
      doc.text(linha, 10, y);
      y += 10;
    });
    doc.save("relatorio_stock.pdf");
  }

  function exportarCSV() {
    let csv = "Data,Descrição,Entrada,Saída,Existências\n";
    document.querySelectorAll('#tabela tbody tr').forEach(row => {
      csv += [...row.children].map(td => td.innerText).join(',') + "\n";
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "exportacao.csv";
    link.click();
  }

  function logout() {
    localStorage.clear();
    location.reload();
  }

  carregarTabela();
</script>
</body>
</html>
