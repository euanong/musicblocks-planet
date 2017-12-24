function LocalPlanet(Planet){
	this.UserIDCookie = "UserID";
	this.UserID = null;
	this.CookieDuration = 3650;
	this.ProjectTable = null;
	this.projects = null;
	this.DeleteModalID = null;
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
		Planet.ServerInterface.getTagManifest(this.afterTagManifest.bind(this));
	}

	this.afterTagManifest = function(data){
		console.log(data);
		if (!data.success){
			Planet.ConnectedToServer = false;
			var element = document.getElementById("publisher-form");
			element.parentNode.removeChild(element);
			element = document.getElementById("publisher-submit");
			element.parentNode.removeChild(element);
			var frag = document.createRange().createContextualFragment(this.PublisherOfflineHTML);
			document.getElementById("publisher-content").appendChild(frag);
		} else {
			this.addTags(data.data);
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

	this.addTags = function(tags){
		Planet.TagsManifest = tags;
		var chiptags = {};
		var keys = Object.keys(tags);
		for (var i = 0; i<keys.length; i++){
			if (tags[keys[i]].IsTagUserAddable==="1"){
				chiptags[tags[keys[i]].TagName]=null;
			}
		}
		$('#tagsadd').material_chip({
			autocompleteOptions: {
				data: chiptags,
				limit: Infinity,
				minLength: 1
			}
		});
		var maxLength = 5;
		var t = this;
		$('#tagsadd').on('chip.add', function(e, chip){
			// you have the added chip here
			var arr = $('#tagsadd').material_chip('data');
			if (!(chip.tag in chiptags)){
				arr.splice(arr.length-1, 1);
			} else {
				chip.id = t.findTagWithName(chip.tag);
			}
			if (arr.length>maxLength){
				arr=arr.slice(0,maxLength);
			}
			$('#tagsadd').material_chip({
				data: arr,
				autocompleteOptions: {
					data: chiptags,
					limit: Infinity,
					minLength: 1
				}
			});
			$('#tagsadd :input').focus();
		});
	}

	this.init = function(){
		this.prepareUserID();
		this.ProjectTable = Planet.ProjectStorage.data.Projects;
		this.refreshProjectArray();
		this.initDeleteModal();
		this.initPublisherModal();
	}
}