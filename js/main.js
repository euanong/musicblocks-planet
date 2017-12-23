var p = new Planet();
p.init();

function newProject(){
	p.ProjectStorage.initialiseNewProject();
}

function openProject(data,image){
	p.saveLocally(data,image);
	p.open();
}