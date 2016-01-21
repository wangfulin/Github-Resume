var download = $('#download');

download.onclick = function(){
	var username = document.getElementById("theme").value;
	var theme = document.getElementById("theme").value;
	
}
download.on('click', function(){
	var username = $("#username").text();
	var theme = $("#theme").text();
	$.ajax({
		type: 'GET',
		url: 'http://127.0.0.1:8360/home/index/download/username/' + username + '/theme/' + theme,
		success: function(){
			console.log("success");
		}
	});
});