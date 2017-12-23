function Planet(){
	this.LocalPlanet = null;
	this.ProjectStorage = null;
	this.ServerInterface = null;
	this.LocalStorage = window.localStorage;

	this.open = function(){
		this.LocalPlanet.open();
	}

	this.saveLocally = function(data, image){
		this.ProjectStorage.saveLocally(data, image);
	}

	this.init = function(){
		this.ProjectStorage = new ProjectStorage(this);
		this.ProjectStorage.init();
		this.ServerInterface = new ServerInterface(this);
		this.ServerInterface.init();
		this.LocalPlanet = new LocalPlanet(this);
		this.LocalPlanet.init();
	}
}