function LocalPlanet(Planet){
	this.UserIDCookie = "UserID";
	this.UserID = null;
	this.CookieDuration = 3650;
	this.ProjectTable = null;
	this.projects = null;
	this.DeleteModalID = null;
	this.ChipTags = null;
	this.PublisherOfflineHTML = '<div>Feature unavailable - cannot connect to server. Reload Music Blocks to try again.</div>';

	this.prepareUserID = function(){
		var id = getCookie(this.UserIDCookie);
		if (id==""){
			id = Planet.ProjectStorage.generateID();
			setCookie(this.UserIDCookie,id,3650);
		}
		this.UserID = id;
	}
	
	this.updateProjects = function(){
		this.refreshProjectArray();
		this.initCards();
		this.renderAllProjects();
	}

	this.refreshProjectArray = function(){
		this.projects = [];
		for (var project in this.ProjectTable){
			if (this.ProjectTable.hasOwnProperty(project)){
				this.projects.push([project,null]);
			}
		}
		var t = this;
		this.projects.sort(function(a,b){return t.ProjectTable[b[0]].DateLastModified-t.ProjectTable[a[0]].DateLastModified;});
	}

	this.initCards = function(){
		for (var i = 0; i<this.projects.length; i++){
			this.projects[i][1] = new LocalCard(Planet);
			this.projects[i][1].init(this.projects[i][0]);
		}
	}

	this.renderAllProjects = function(){
		document.getElementById("local-projects").innerHTML = "";
		for (var i = 0; i<this.projects.length; i++){
			this.projects[i][1].render();
		}
	}

	this.initDeleteModal = function(){
		var t = this;
		document.getElementById("deleter-button").addEventListener('click', function (evt) {
			if (t.DeleteModalID!=null){
				Planet.ProjectStorage.deleteProject(t.DeleteModalID);
			}
		});
	}

	this.openDeleteModal = function(id){
		this.DeleteModalID = id;
		var name = this.ProjectTable[id].ProjectName;
		document.getElementById("deleter-title").textContent = name;
		document.getElementById("deleter-name").textContent = name;
		$('#deleter').modal('open');
	}

	this.initPublisherModal = function(){
		if (!Planet.ConnectedToServer){
			var element = document.getElementById("publisher-form");
			element.parentNode.removeChild(element);
			element = document.getElementById("publisher-submit");
			element.parentNode.removeChild(element);
			var frag = document.createRange().createContextualFragment(this.PublisherOfflineHTML);
			document.getElementById("publisher-content").appendChild(frag);
		} else {
			this.addTags();
			this.initPublishSubmit();
		}
	}

	this.findTagWithName = function(name){
		var keys = Object.keys(Planet.TagsManifest);
		for (var i = 0; i<keys.length; i++){
			if (Planet.TagsManifest[keys[i]].TagName==name){
				return keys[i];
			}
		}
		return null;
	}

	this.addTags = function(){
		var tags = Planet.TagsManifest;
		this.ChipTags = {};
		var keys = Object.keys(tags);
		for (var i = 0; i<keys.length; i++){
			if (tags[keys[i]].IsTagUserAddable==="1"){
				this.ChipTags[tags[keys[i]].TagName]=null;
			}
		}
		$('#tagsadd').material_chip({
			autocompleteOptions: {
				data: this.ChipTags,
				limit: Infinity,
				minLength: 1
			}
		});
		var maxLength = 5;
		var t = this;
		$('#tagsadd').on('chip.add', function(e, chip){
			// you have the added chip here
			var arr = $('#tagsadd').material_chip('data');
			if (!(chip.tag in t.ChipTags)){
				arr.splice(arr.length-1, 1);
			} else {
				chip.id = t.findTagWithName(chip.tag);
			}
			if (arr.length>maxLength){
				arr=arr.slice(0,maxLength);
			}
			t.setTagInput(arr);
			$('#tagsadd :input').focus();
		});
	}

	this.setTagInput = function(arr){
		$('#tagsadd').material_chip({
			data: arr,
			autocompleteOptions: {
				data: this.ChipTags,
				limit: Infinity,
				minLength: 1
			}
		});
	}

	this.setTags = function(arr){
		var a = [];
		for (var i = 0; i<arr.length; i++){
			var o = {};
			o.tag = Planet.TagsManifest[arr[i]].TagName;
			o.id = arr[i];
			a.push(o);
		}
		this.setTagInput(a);
	}

	this.getTags = function(){
		var t = $('#tagsadd').material_chip('data');
		var a = [];
		for (var i = 0; i<t.length; i++){
			a.push(t[i].id);
		}
		return a;
	}

	this.initPublishSubmit = function(){
		var t = this;
		document.getElementById("publisher-submit").addEventListener('click', this.publishProject);
	}

	this.openPublishModal = function(id){
		var name = this.ProjectTable[id].ProjectName;
		var image = this.ProjectTable[id].ProjectImage;
		var published = this.ProjectTable[id].PublishedData;
		if (published!=null){
			var description = published.ProjectDescription;
			var tags = published.ProjectTags;
			document.getElementById("publish-description").value = description;
			this.setTags(tags);
		}
		document.getElementById("publish-id").value = id;
		document.getElementById("publish-title").value = name;
		document.getElementById("publish-image").src = image;
		Materialize.updateTextFields();
		$('#publisher').modal('open');
	}

	this.publishProject = function(){
		document.getElementById("publisher-progress").style.visibility = "visible";
		console.log("submit");
		var title = document.getElementById("publish-title");

	}

	this.afterPublishProject = function(){
		document.getElementById("publisher-progress").style.visibility = "hidden";
	}

	this.closePublisher = function(){
		$('#publisher').modal('close');
	}

	this.init = function(){
		this.prepareUserID();
		this.ProjectTable = Planet.ProjectStorage.data.Projects;
		this.refreshProjectArray();
		this.initDeleteModal();
		this.initPublisherModal();
	}
}