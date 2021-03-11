class Despesa {
  constructor(date, tipo, descricao, valor) {
    this.date = date;
    this.tipo = tipo;
    this.descricao = descricao;
    this.valor = valor;
  }

  validarDados() {
    for (let i in this) {
      if (this[i] == undefined || this[i] == "" || this[i] == null) {
        throw new Error();
      }
    }
    DOM.modalSucesso();
    $("#modalMessage").modal("show");
  }
}

const DOM = {
  modalSucesso() {
    let divContainer = document.getElementById("modalMessage");
    divContainer.innerHTML = `
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header text-success">
                    <h5 class="modal-title" id="tituloModal"><i class="fas fa-check-circle"></i> Registro inserido com sucesso!</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div id="messageModal" class="modal-body">
                Despesa cadastrada com sucesso
                </div>
                <div class="modal-footer">
                    <button id="btnModal" type="button" class="btn btn-success" data-dismiss="modal">Fechar</button>
                </div>
            </div>
        </div>
        `;
  },

  modalErro() {
    let divContainer = document.getElementById("modalMessage");
    divContainer.innerHTML = `
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header text-danger">
                <h5 class="modal-title" id="exampleModalLabel"><i class="fas fa-exclamation-circle"></i> Erro na gravação</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>
                <div class="modal-body">
                Por favor preencha todos os campos
                </div>
                  <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-dismiss="modal">Voltar</button>
                </div>
            </div>
        </div>
    `;
  },
};

// setando um id para cada despesa
class Bd {
  constructor() {
    let id = localStorage.getItem("id");
    if (id === null) {
      localStorage.setItem("id", 0);
    }
  }

  getProximoId() {
    let proximoId = localStorage.getItem("id");

    return parseInt(proximoId) + 1;
  }

  gravar(despesa) {
    let id = this.getProximoId();
    localStorage.setItem(id, JSON.stringify(despesa));
    localStorage.setItem("id", id);
  }

  recuperarTodosRegistros() {
    let id = localStorage.getItem("id");
    let despesas = [];
    // recuperar todas as despesas armazenadas em localStorage
    for (let i = 1; i <= id; i++) {
      let despesa = JSON.parse(localStorage.getItem(i));
      if (despesa === null) {
        continue;
      }
      despesa.id = i
      despesas.push(despesa);
    }
    return despesas;
  }

  pesquisar(despesa) {
    let despesasFiltradas = []
    despesasFiltradas = this.recuperarTodosRegistros()

    // date
    if(despesa.date != ''){
      despesasFiltradas = despesasFiltradas.filter( d => d.date == despesa.date)
    }
    // tipo
    if(despesa.tipo != ''){
      despesasFiltradas = despesasFiltradas.filter( d => d.tipo == despesa.tipo)
    }
    //descricao
    if(despesa.descricao != ''){
      despesasFiltradas = despesasFiltradas.filter( d => d.descricao == despesa.descricao)
    }
    //valor
    if(despesa.valor != ''){
      despesasFiltradas = despesasFiltradas.filter( d => d.valor == despesa.valor)
    }
    return despesasFiltradas
  }

  remover(id){
    id = id.replace('idDespesa-', '')
    localStorage.removeItem(id)
    window.location.reload()
  }
}

let bd = new Bd();

const Form = {
  descricao: document.getElementById("descricao"),
  tipo: document.getElementById("tipo"),
  date: document.getElementById("date"),
  valor: document.getElementById("valor"),

  getValues() {
    return {
      descricao: this.descricao.value,
      tipo: this.tipo.value,
      date: this.date.value,
      valor: this.valor.value,
    };
  },

  /* formatValues() {
    let { descricao, tipo, date, valor } = this.getValues();

    //date = Formatting.formatDate(date);

    //valor = Formatting.formatValue(valor)
    return {
      descricao,
      tipo,
      date,
      valor,
    };
  }, */

  validarDados() {
    for (let i in this) {
      if (this[i] == undefined || this[i] == "" || this[i] == null) {
        throw new Error();
      }
    }
    DOM.modalSucesso();
    $("#modalMessage").modal("show");
  },

  clearFields() {
    this.descricao.value = "";
    this.tipo.value = "";
    this.date.value = "";
    this.valor.value = "";
  },

  submit() {
    try {
      // verificar campos
      this.validarDados();

      // formatar os dados
      const despesa = this.getValues();

      // apagar os dados do formulário
      this.clearFields();

      // salvar no localStorage
      bd.gravar(despesa);
    } catch (error) {
      DOM.modalErro();
      $("#modalMessage").modal("show");
    }
  },
};

const Formatting = {
  formatDate(date) {
    const dateFormated = date.split("-");
    return `${dateFormated[2]}/${dateFormated[1]}/${dateFormated[0]}`;
  },

  formatCurrency(value) {
    value = value.replace(/[^\d]+/g, ".");
    value = Number(value); /// 100
    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    return value;
  },
};

const App = {};

// mostrar despesas na consulta
function carregaListaDespesas(despesas = [], filtro = false) {
  if(despesas.length == 0 && filtro == false){
    despesas = bd.recuperarTodosRegistros();
  }


  // selecionado o elemento tbody na tabela
  var listaDespesas = document.getElementById("listaDespesas");
  listaDespesas.innerHTML = ''


  despesas.forEach((despesa) => {
    // criar a linha tr
    let linha = listaDespesas.insertRow();

    // criar as colunas td
    linha.insertCell(0).innerHTML = despesa.descricao;
    linha.insertCell(1).innerHTML = despesa.tipo;
    linha.insertCell(2).innerHTML = Formatting.formatDate(despesa.date);
    linha.insertCell(3).innerHTML = Formatting.formatCurrency(despesa.valor);

    // criar o botão de delete despesa
    let btn = document.createElement('button')
    btn.className = 'btn btn-danger'
    btn.innerHTML = '<i class = "fas fa-times"></i>'
    btn.id = `idDespesa-${despesa.id}`
    btn.onclick = function(){
      bd.remover(this.id)
    }
    linha.insertCell(4).append(btn)
    console.log(despesa)
  });
}

function pesquisarDespesa() {
  let date = document.getElementById("date").value;
  let tipo = document.getElementById("tipo").value;
  let descricao = document.getElementById("descricao").value;
  let valor = document.getElementById("valor").value;

  let despesa = new Despesa(date, tipo, descricao, valor);
  let despesas = bd.pesquisar(despesa);
  carregaListaDespesas(despesas, true)
}
