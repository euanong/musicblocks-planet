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

$(document).ready(function() {
    $('#publisher').modal();
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