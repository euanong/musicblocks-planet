function ProjectStorage(Planet){
	this.defaultProjectName = "My Project";
	this.LocalStorage = null;
	this.data = null;
	this.LocalStorageKey = "ProjectData";

	this.generateID = function(){
		var n = Date.now();
		var prefix = n.toString();
		var suffix = ""
		for (var i = 0; i<3; i++){
			suffix+=Math.floor(Math.random()*10).toString();
		}
		return prefix+suffix;
	}

	this.saveLocally = function(data, image){
		if (this.data.CurrentProject===undefined){
			this.initialiseNewProject();
		}
		var c = this.data.CurrentProject;
		this.data.Projects[c].ProjectData = data;
		this.data.Projects[c].ProjectImage = image;
		this.data.Projects[c].DateLastModified = Date.now();
		this.save();
	}

	this.initialiseNewProject = function(){
		var c = this.generateID();
		this.data.CurrentProject = c;
		this.data.Projects[c]={};
		this.data.Projects[c].ProjectName = this.defaultProjectName;
		this.data.Projects[c].ProjectData = null;
		this.data.Projects[c].ProjectImage = null;
		this.data.Projects[c].PublishedData = null;
		this.data.Projects[c].DateLastModified = null;
		this.save();
	}

	this.renameProject = function(id, name){
		this.data.Projects[id].ProjectName = name;
		this.save();
	}

	this.addPublishedData = function(id, data){
		this.data.Projects[id].PublishedData = data;
		this.save();
	}

	this.deleteProject = function(id){
		delete this.data.Projects[id];
		this.save();
		Planet.LocalPlanet.updateProjects();
	}

	this.getCurrentProjectID = function(){
		return this.data.CurrentProject;
	}

	//Ancillary Functions

	this.set = function(key, obj){
		var jsonobj = JSON.stringify(obj);
		this.LocalStorage.setItem(key,jsonobj);
	}

	this.get = function(key){
		var jsonobj = this.LocalStorage.getItem(key);
		if (jsonobj===null||jsonobj===""){
			return null;
		}
		try {
			return JSON.parse(jsonobj);
		} catch (e){
			console.log(e);
			return null;
		}
	}

	this.save = function(){
		this.set(this.LocalStorageKey,this.data);
	}

	this.restore = function(){
		this.data = this.get(this.LocalStorageKey);
	}

	this.initialiseStorage = function(){
		this.data = {};
		this.data.Projects = {};
		this.data.DefaultCreatorName = "anonymous";
		this.save();
	}

	this.getDefaultCreatorName = function(){
		return this.data.DefaultCreatorName;
	}

	this.init = function(){
		this.LocalStorage = Planet.LocalStorage;
		this.restore();
		if (this.data===null){
			this.initialiseStorage();
		}
	}
}