var p;

function newProject(){
	p.ProjectStorage.initialiseNewProject();
}

function openProject(data,image){
	p.saveLocally(data,image);
	p.open();
}

$(document).ready(function(){
	p = new Planet();
	p.init();
	p.open();
});