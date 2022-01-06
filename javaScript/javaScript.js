const writingFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2,});

var transacoes = localStorage.getItem("transacoes") ? JSON.parse(localStorage.getItem("transacoes")) : [];
let writingPattern = /[^0-9]/;

//Início da função ToggleMenu. ---------------------------------------

function ToggleMenu(pixels) {
	document.querySelector('.conteudo-menu-hamburguer').style.right = pixels + 'px'; 
}

//Final da função ToggleMenu. ---------------------------------------

//Início da função toClean - Limpar Dados. ---------------------------
function toClean(){
	let removeConfirm = confirm("Deseja remover as transações?");
	
		if(removeConfirm){
			localStorage.removeItem("transacoes");
			transacoes = []; 
			addingTransactions();
		}
}
//Final da função toClean - Limpar Dados. ----------------------------

// Início da função focar no formulário - Cadastro de Transações.----------------------
function focusOnForm(){
	document.getElementsByName("nomeMercadoria")[0].focus();
}
// Final da função focar no formulário - Cadastro de Transações.------------------------

// Início da escrita padrão do valor moeda. --------------------------------

function currencyFormat(moeda){
	if(writingPattern.test(moeda.key)){
		moeda.preventDefault();
		return;
	}
	
	if(!moeda.target.value) return;

	valor = moeda.target.value.toString();
	valor = valor.replace(/[\D]+/g, '');
	valor = valor.replace(/([0-9]{1})$/g, ",$1");

	if(valor.length >= 6){
		while(/([0-9]{4})[,|\.]/g.test(valor)){
			valor = valor.replace(/([0-9]{1})$/g, ",$1");
			valor = valor.replace(/([0-9]{3})[,|\.]/g, ".$1");
		}
	}

	moeda.target.value = valor;
}
// Final da escrita padrão do valor moeda. --------------------------------------

// Início da Extrato de transações. ---------------------------------------------
function addingTransactions(){

	limparDados = [...document.querySelectorAll('.tr-remove')];
	limparDados.forEach((element) => {element.remove()});

	let total = 0;

	    if(transacoes.length == 0){
			document.querySelector("#tabela-foot").innerHTML = 
			`<tr class="tr-remove">
		            <td class="tabela-total-vazio"></td>
		            <td class="tabela-total"><p style="text-align:center;">Não há transações adicionadas.</p></td>
		            <td class="tabela-valorTotal"></td>
		        </tr>`
		}

	for(item in transacoes){

		if(transacoes[item].tipoTrans == "compra"){
			total -= transacoes[item].tipoMoeda;
		}else{
			total += transacoes[item].tipoMoeda;
		}

		document.querySelector(".tabela-corpo").innerHTML += 
		`<tr class="tr-remove">
            <td class="tabelaMais-corpo">${transacoes[item].tipoTrans == "compra" ? "-" : "+"}</td>
            <td class="tabela-mercadoria">${transacoes[item].nomeMerc}</td>
            <td class="tabela-valorMercadoria">${writingFormatter.format(transacoes[item].tipoMoeda.toString().replace(/([0-9]{2})$/g, ".$1"))}</td>
        </tr>`
	}

		if(transacoes.length > 0){
			document.querySelector("#tabela-foot").innerHTML += 
			`<tr class="tr-remove">
	            <td class="tabela-total-vazio"></td>
	            <td class="tabela-total">Total</td>
	            <td class="tabela-valorTotal">${writingFormatter.format(total.toString().replace(/([0-9]{2})$/g, ".$1"))} <br> <span class="lucro">[${Math.sign(total) == 1 ? "LUCRO" : "PREJUÍZO"}]</span></td>
	        </tr>
	        `
		}
}
//Final da Extrato de transações. -----------------------------------------------

// Início do formulário Nova Transação. -----------------------------------------
function submitingForm(e){
	e.preventDefault();

	tipoDeTransacao = document.querySelector('select[name="compra-venda"]');
	nomeDaMercadoria = document.querySelector('input[name="nomeMercadoria"]');
	valorDaMoeda = document.querySelector('input[name="valorMoeda"]');	

	if(!nomeDaMercadoria.value){
		nomeDaMercadoria.focus();
		return;
	}

	if(valorDaMoeda.value.replace(/[^0-9]/g, "") == ""){
		valorDaMoeda.focus();
		return;
	}

	numeroDaMoeda = parseInt(valorDaMoeda.value.replace(/[^0-9]/g, ""));

	transacoes.push({
		tipoTrans: tipoDeTransacao.value,
		nomeMerc: nomeDaMercadoria.value,
		tipoMoeda: numeroDaMoeda  
	})

	nomeDaMercadoria.value = "";
	valorDaMoeda.value = "";

	localStorage.setItem("transacoes", JSON.stringify(transacoes));

	addingTransactions();
}

addingTransactions();

// Final do formulário Nova Transação. ------------------------------------------