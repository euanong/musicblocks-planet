function Planet(isMusicBlocks){
	this.LocalPlanet = null;
	this.ProjectStorage = null;
	this.ServerInterface = null;
	this.LocalStorage = window.localStorage;
	this.ConnectedToServer = null;
	this.TagsManifest = null;
	this.IsMusicBlocks = isMusicBlocks;

	this.open = function(){
		this.LocalPlanet.updateProjects();
	}

	this.saveLocally = function(data, image){
		this.ProjectStorage.saveLocally(data, image);
	}

	this.init = function(callback){
		this.ProjectStorage = new ProjectStorage(this);
		this.ProjectStorage.init();
		this.ServerInterface = new ServerInterface(this);
		this.ServerInterface.init();
		this.ServerInterface.getTagManifest(function(data){this.initPlanets(data,callback)}.bind(this));
	}

	this.initPlanets = function(tags, callback){
		if (!tags.success){
			this.ConnectedToServer = false;
		} else {
			this.ConnectedToServer = true;
			this.TagsManifest = tags.data;
		}
		this.LocalPlanet = new LocalPlanet(this);
		this.LocalPlanet.init();
		if (callback!=undefined){
			callback();
		}
	}
}