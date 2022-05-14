const dbName = 'carsDb';
const dbVersion = '1.0';
const dbDescription = 'Cars database zadacha 3';
const dbSize = 2 * 1024 * 1024;
const db = openDatabase(dbName, dbVersion, dbDescription, dbSize);

window.onload = function(){
	initialDatabase();
	uploadData();
	uploadXml();
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

function uploadData(){
	let input = document.getElementById('input-file');
	input.addEventListener('change', function(){
		let reader = new FileReader();
		
		reader.onload = function(){
			let inputJson = reader.result;
			const data = JSON.parse(inputJson);
			insertData(data);
		}
		
		reader.readAsText(this.files[0]);
	});
}


function insertData(inputData){
	db.transaction(function(tx){
		for(let i = 0; i < inputData.length; i++){
			let current = inputData[0];
			let make = current.make;
			let model = current.model;
			let productionYear = current.productionYear;
			let serialNumber = current.serialNumber;
			let statement = `INSERT INTO cars(make, model, production_year, serial_number)values('${make}', '${model}', '${productionYear}', '${serialNumber}')`;
			tx.executeSql(statement, [], (tx, results) => {}, (transaction, error) => {console.log(error.message);});
		}
	});
}


function uploadXml(){
	let input = document.getElementById('input-file-xml');
	input.addEventListener('change', function(){
		let fileReader = new FileReader();
		
		fileReader.onload = function(){
			let inputXml = fileReader.result;
			const data = fromXML(inputXml);
			insertDataXml(data);
		}
		
		fileReader.readAsText(this.files[0]);
	});
}

function insertDataXml(data){
	db.transaction(function(tx){
		for(let i = 0; i < data.make.length; i++){
			let make = data.make[i];
			let model = data.model[i];
			let productionYear = data.productionYear[i];
			let serialNumber = data.serialNumber[i];
			
			let statement = `INSERT INTO cars(make, model, production_year, serial_number)values('${make}', '${model}', '${productionYear}', '${serialNumber}')`;
			tx.executeSql(statement, [], (tx, results) => {}, (transaction, error) => {console.log(error.message);});
		}		
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

function saveData(resultJson){
	let blob = new Blob([resultJson], {type: "text/plain;charset=utf-8"});
	let textFile = window.URL.createObjectURL(blob);
	let dLink = document.getElementById('download');
	dLink.setAttribute("download", 'resultJson.json')
	dLink.href = textFile;
	
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

function saveDataXml(data){
	let blob = new Blob([data], {type: "text/plain;charset=utf-8"});
	let textFile = window.URL.createObjectURL(blob);
	let dLink = document.getElementById('download-xml');
	dLink.setAttribute("download", 'resultXml.xml')
	dLink.href = textFile;	
}