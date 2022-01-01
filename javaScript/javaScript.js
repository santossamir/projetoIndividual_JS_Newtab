//Início da função toClean - Limpar Dados. ---------------------------
function toClean(){

}
//Final da função toClean - Limpar Dados. ----------------------------

// Início da função focar no formulário - Cadastro de Transações.----------------------
function focusOnForm(){
	document.getElementsByName("nomeMercadoria")[0].focus();
}
// Final da função focar no formulário - Cadastro de Transações.------------------------

// Início da escrita padrão do valor moeda. --------------------------------
let writingPattern = /[^0-9]/;

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

//Final da Extrato de transações. -----------------------------------------------

// Início do formulário Nova Transação. -----------------------------------------

// Final do formulário Nova Transação. ------------------------------------------