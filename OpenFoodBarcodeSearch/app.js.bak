const db = openDatabase('mydb', '1.0', 'my first database', 2 * 1024 * 1024);

db.transaction(function (tx){
	tx.executeSql('CREATE TABLE IF NOT EXISTS Products(code TEXT, product_name TEXT, ingredients_text TEXT)');	
});

/*

db.transaction(function(tx){
	let insert = 'INSERT INTO Products(code, product_name, ingredients_text)VALUES(\'asd\', \'asd\', \'asd\')';
	tx.executeSql(insert);
});

db.transaction(function(tx){
	tx.executeSql('SELECT * FROM Products', [], function(tx, results){
		var len = results.rows.length;
		for(let i = 0; i < len; i++){
			alert(results.rows.item(i).code)
		}
	});
});
*/

function search(){
	let barcode = document.getElementById('barcode').value;
	
	if (barcode.trim() == ''){
		alert('Please enter barcode!');
		return;
	}
	
	hasProductInfo(barcode)
}

function hasProductInfo(barcode){
	let len = 0;
	db.transaction(function(tx){
		let selectStatement = `select count(*) as c from Products where code = '${barcode}'`;
		tx.executeSql(selectStatement, [], function(tx, results){
			len = results.rows.item(0).c;
			
			if (len > 0){
				getProductInfo(barcode)
			}
			else {
				getDataFromApi(barcode);
			}
		});
	});
	
	return len > 0;
}

function getProductInfo(barcode){
	
	let result = {
		code: "",
		productName: "",
		ingredientsText: ""
	};
	
	db.transaction(function(tx){
		let selectStatement = `SELECT * FROM Products WHERE code = '${barcode}'`;
		tx.executeSql(selectStatement, [], function(tx, results){
			result.code = results.rows.item(0).code;
			result.productName = results.rows.item(0).product_name;
			result.ingredientsText = results.rows.item(0).ingredients_text;
			addProductList(result);
		});
	});
	
	return result;
}

function addProductList(result){
	let itemCode = document.createElement('li');
	itemCode.innerHTML = result.code;
	let itemName = document.createElement('li');
	itemName.innerHTML = result.productName;
	let itemIngredients = document.createElement('li');
	itemIngredients.innerHTML = result.ingredientsText;
	
	let list = document.getElementById('result');
	list.innerHTML = '';
	list.appendChild(itemCode);
	list.appendChild(itemName);
	list.appendChild(itemIngredients);
}

function getDataFromApi(barcode){
	let requestUrl = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
	fetch(requestUrl)
	.then(function(response) {
		return response.json();
	})
	.then(function(myJson) {
		
		if(myJson.status == 0){
			alert('No persistent product with the specified code!');
			document.getElementById('result').innerHTML = '';
			return;
		}
		
		
		let code = myJson.code;
		let productName = myJson.product.product_name;
		let ingredients = myJson.product.ingredients_text_en;
		insertRow(code, productName, ingredients);
		let result = {
			code: code,
			productName: productName,
			ingredientsText: ingredients
		};
		
		addProductList(result);
	});
}

function insertRow(code, productName, ingredients){
	db.transaction(function(tx) {
		let insert = `INSERT INTO Products(code, product_name, ingredients_text)VALUES('${code}', '${productName}', '${ingredients}')`;
		tx.executeSql(insert);
	});
}