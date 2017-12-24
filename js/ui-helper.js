function toggleSearch(on){
	if (on){
		document.getElementById("searchcontainer").style.display = "block";
	} else {
		document.getElementById("searchcontainer").style.display = "none";
	}
}
function toggleText(id, a, b){
	var t = document.getElementById(id).innerHTML;
	console.log(t);
	if (t.indexOf(a)!==-1){
		document.getElementById(id).innerHTML = t.replace(a, b);
	} else {
		document.getElementById(id).innerHTML = t.replace(b, a);
	}
}
function toggleExpandable(id, c){
	var d = document.getElementById(id).className;
	if (d==c+" open"){
		document.getElementById(id).className = c;
	} else {
		document.getElementById(id).className = c+" open";
	}
}
function clearSearchBar(){
	document.getElementById("global-search").value = "";
}

function hideOnClickOutside(id, other) {
	const outsideClickListener = (event) => {
		if (event.path.indexOf(id)!=-1) {
		} else {
			document.getElementById(other).style.display = "none";
			removeClickListener();
		}
	}

	const removeClickListener = () => {
		document.removeEventListener('click', outsideClickListener);
	}
	document.addEventListener('click', outsideClickListener);
}

function updateCheckboxes(id){
    var elements = document.getElementById(id).querySelectorAll('input:checked');
    var urlel = document.getElementById(id).querySelectorAll('input[type=text]')[0];
    var url = urlel.getAttribute("data-originalurl");
    for (var i = 0; i<elements.length; i++){
        url+="&"+elements[i].name+"=True";
    }
    urlel.value = url;
}

$(document).ready(function() {
	$('#publisher').modal();
	$('#deleter').modal();
	$('#projectviewer').modal();
	$('#sort-select').material_select();
	document.getElementById("global-search").addEventListener('input', function (evt) {
			if(this.value!=""){
				document.getElementById("search-close").style.display = "initial";
			} else {
				document.getElementById("search-close").style.display = "none";
			}
	});
});