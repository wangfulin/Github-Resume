var themeList = document.getElementById('theme-list');
var theme = document.getElementById('theme');

themeList.onclick = function(eve){
	var e = eve || window.event;
	var target = e.srcElement || e.target;
	var themes = themeList.getElementsByTagName('li');
	var len = themes.length;
	for(var i=0; i<len; i++){
		themes[i].style.boxShadow = 'none';
	}
	target.style.boxShadow='1px 1px 0px 2px grey';
	var themeName = target.getAttribute('name');
	theme.value = themeName;
}