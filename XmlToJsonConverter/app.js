var resultJson = '';

window.onload = function(){
	let input = document.getElementById('input-data');
	input.addEventListener('change', function(){
		let reader = new FileReader();
		reader.onload = function(){
			let resultText = reader.result;
			var json = xmlToJson.parse(resultText);
			resultJson = JSON.stringify(json);
		};
		
		reader.readAsText(this.files[0]);
	});
}

function saveData(){
	let blob = new Blob([resultJson], {type: "text/plain;charset=utf-8"});
	let textFile = window.URL.createObjectURL(blob);
	let dLink = document.getElementById('download');
	dLink.setAttribute("download", 'resultJson.txt')
	dLink.href = textFile;
	
}