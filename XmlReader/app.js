window.onload = function(){
	let input = document.getElementById('input-file');
	input.addEventListener('change', function(){
		let reader = new FileReader();
		let resultText = '';
		reader.onload = function(){
			resultText = reader.result;
			console.log(resultText);
			while(resultText.includes('<')){
				resultText = resultText.replace('<', '&lt;');
			}
			
			while(resultText.includes('>')){
				resultText = resultText.replace('>', '&gt;');	
			}
			
			let result = document.getElementById('result');
			result.innerHTML = resultText;	
		};
		
		reader.readAsText(this.files[0]);
	});
}
