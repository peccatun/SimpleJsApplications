const dbName = 'carsDb';
const dbVersion = '1.0';
const dbDescription = 'Cars database zadacha 3';
const dbSize = 2 * 1024 * 1024;
const db = openDatabase(dbName, dbVersion, dbDescription, dbSize);

window.onload = function(){
	initialDatabase();
}

function initialDatabase(){
	
	
	db.transaction(function(tx){
		let statement = 'CREATE TABLE IF NOT EXISTS cars(make TEXT, model TEXT, production_year TEXT, serial_number TEXT)';
		tx.executeSql(statement, [], function(tx, results){}, function(transaction, error){console.log(error.message);});
	});
	
	insertRecords();
	
}

function insertRecords(){
	db.transaction(function(tx){
		let statement = 'SELECT count(make) as c FROM cars'
		tx.executeSql(statement, [], function(tx, results){
			let count = results.rows.item(0).c;
			if (count <= 0){
				db.transaction(function(tx){
					for(let i = 1; i <= 12; i++){
						let make = 'ExampleMake' + i;
						let model = 'ExampleModel' + i;
						let productionYear = `${i}.${i}.${1}${9}${i + 80}`;
						let serialNumber = `${i}${i}${i + 1}-${i-1}${i+10}`;
						let statement = `INSERT INTO cars(make, model, production_year, serial_number)values('${make}', '${model}', '${productionYear}', '${serialNumber}')`;
						tx.executeSql(statement, [], (tx, results) => {}, (transactionm, error) => {console.log(error.message);});
					}		
				});
			}
		}, function(transation, error){
			console.log(error.message);
		});
	});
}

function downloadData(){
	db.transaction(function(tx){
		let statement = 'SELECT * FROM cars';
		tx.executeSql(statement, [], (tx, results) => {
			let data = [];
			for(let i = 0; i < results.rows.length; i++){
				let currentRow = results.rows.item(i);
				let car = {
					make: currentRow.make,
					model: currentRow.model,
					productionYear: currentRow.production_year,
					serialNumber: currentRow.serial_number
				};
				
				data.push(car);
			}
			
			let jsonResult = JSON.stringify(data);
			saveData(jsonResult);
			
		}, (transaction, error) => {
			console.log(error.message);
		});
	});
}

function downloadDataXml(){
	db.transaction(function(tx){
		let statement = 'SELECT * FROM cars';
		tx.executeSql(statement, [], (tx, results) => {
			let data = [];
			for(let i = 0; i < results.rows.length; i++){
				let currentRow = results.rows.item(i);
				let car = {
					make: currentRow.make,
					model: currentRow.model,
					productionYear: currentRow.production_year,
					serialNumber: currentRow.serial_number
				};
				
				data.push(car);
			}
			const xml = toXML(data, null, 2);
			saveDataXml(xml);
			
		}, (transaction, error) => {
			console.log(error.message);
		});
	});
}

function saveData(resultJson){
	let blob = new Blob([resultJson], {type: "text/plain;charset=utf-8"});
	let textFile = window.URL.createObjectURL(blob);
	let dLink = document.getElementById('download');
	dLink.setAttribute("download", 'resultJson.json')
	dLink.href = textFile;
	
}

function saveDataXml(data){
	let blob = new Blob([data], {type: "text/plain;charset=utf-8"});
	let textFile = window.URL.createObjectURL(blob);
	let dLink = document.getElementById('download-xml');
	dLink.setAttribute("download", 'resultXml.xml')
	dLink.href = textFile;	
}