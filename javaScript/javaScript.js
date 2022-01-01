const writingFormatter = new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',
	minimumFractionDigits: 2,
});

var transactions = localStorage.getItem("transactions") ? JSON.parse(localStorage.getItem("transactions")) : [];

//Início da função toClean - Limpar Dados. ---------------------------
/*function toClean(){
	let userConfirm = confirm("Deseja remover todas as transações?");
	if(userConfirm){
		localStorage.removeItem("transactions");
		transactions = [];
		AddingTransactions();
	}
}*/
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
async function AddingTransactions(){
	let total = 0;

	for(item in transactions){

		if(transactions[item].transType == "compra"){
			total -= transactions[item].transCurrency;
		}else{
			total += transactions[item].transCurrency;
		}

		document.querySelector(".tabela-corpo").innerHTML += 
		`<tr>
            <td class="tabelaMais-corpo">${transactions[item].transType == "compra" ? "-" : "+"}</td>
            <td class="tabela-mercadoria">${transactions[item].transName}</td>
            <td class="tabela-valorMercadoria">${writingFormatter.format(transactions[item].transCurrency.toString().replace(/([0-9]{2})$/g, ".$1"))}</td>
        </tr>`
	}

	if(transactions.length > 0){
		document.querySelector("#tabela-foot").innerHTML += 
		`<tr>
            <td class="tabela-total-vazio"></td>
            <td class="tabela-total">Total</td>
            <td class="tabela-valorTotal"> ${writingFormatter.format(total.toString().replace(/([0-9]{2})$/g, ".$1"))} <br> <span class="lucro">[${Math.sign(total) == 1 ? "LUCRO" : "PREJUÍZO"}]</span></td>
        </tr>
        `
	}
}

//Final da Extrato de transações. -----------------------------------------------

// Início do formulário Nova Transação. -----------------------------------------
function submitingForm(e){
	e.preventDefault();

	transactionType = document.querySelector('select[name="compra&venda"]');
	transactionName = document.querySelector('input[name="nomeMercadoria"]');
	transactionCurrency = document.querySelector('input[name="valorMoeda"]');	

	if(!transactionName.value){
		transactionName.focus();
		return;
	}

	console.log(!transactionCurrency.value && transactionCurrency.value.replace(/[^0-9]/g, "") == "")

	if(transactionCurrency.value.replace(/[^0-9]/g, "") == ""){
		transactionCurrency.focus();
		return;
	}

	currencyNumber = parseInt(transactionCurrency.value.replace(/[^0-9]/g, ""));

	transactions.push({
		transType: transactionType.value,
		transName: transactionName.value,
		transCurrency: currencyNumber  
	})

	transactionName.value = "";
	transactionCurrency.value = "";

	localStorage.setItem("transactions", JSON.stringify(transactions));

	AddingTransactions();
}

AddingTransactions();

// Final do formulário Nova Transação. ------------------------------------------