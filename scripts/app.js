class Despesa {
  constructor(ano, mes, dia, tipo, descricao, valor) {
    this.ano = ano;
    this.mes = mes;
    this.dia = dia;
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

  recuperarTodosRegistros(){
    let id = localStorage.getItem('id')
    let despesas = []
    // recuperar todas as despesas armazenadas em localStorage
    for(let i = 1; i <= id; i++){
      let despesa = JSON.parse(localStorage.getItem(i))
      if(despesa === null){
        continue
      }
      despesas.push(despesa)
    }
    return despesas
  }
}

let bd = new Bd();

function cadastrarDespesa() {
  let ano = document.getElementById("ano");
  let mes = document.getElementById("mes");
  let dia = document.getElementById("dia");
  let tipo = document.getElementById("tipo");
  let descricao = document.getElementById("descricao");
  let valor = document.getElementById("valor");

  let despesa = new Despesa(
    ano.value,
    mes.value,
    dia.value,
    tipo.value,
    descricao.value,
    valor.value,
  );
  try {
    // validar campos
    despesa.validarDados();

    // gravar campos no LocalStorage
    bd.gravar(despesa);
  } catch (error) {
    DOM.modalErro();
    $("#modalMessage").modal("show");
  }
}

function carregaListaDespesas(){
  let despesas = []
  despesas = bd.recuperarTodosRegistros()

  console.log(despesas)
}
