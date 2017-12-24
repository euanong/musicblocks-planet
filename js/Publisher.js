function Publisher(Planet){
	this.ChipTags = null;
	this.PublisherOfflineHTML = '<div>Feature unavailable - cannot connect to server. Reload Music Blocks to try again.</div>';
	this.TitleLowerBound = 1;
	this.TitleUpperBound = 50;
	this.DescriptionLowerBound = 1;
	this.DescriptionUpperBound = 1000;
	this.ProjectTable = Planet.LocalPlanet.ProjectTable;

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

	this.initSubmit = function(){
		var t = this;
		document.getElementById("publisher-submit").addEventListener('click', this.publishProject.bind(this));
	}

	this.open = function(id){
		var name = this.ProjectTable[id].ProjectName;
		var image = this.ProjectTable[id].ProjectImage;
		var published = this.ProjectTable[id].PublishedData;
		if (published!=null){
			var description = published.ProjectDescription;
			var tags = published.ProjectTags;
			document.getElementById("publisher-ptitle").textContent="Republish Project";
		} else {
			var description = "";
			var tags = [];
			document.getElementById("publisher-ptitle").textContent="Publish Project";
		}
		if (Planet.ConnectedToServer){
			document.getElementById("publish-description").value = description;
			document.getElementById("publish-description-label").setAttribute("data-error","");
			this.setTags(tags);
			document.getElementById("publish-id").value = id;
			document.getElementById("publish-title").value = name;
			document.getElementById("publish-title-label").setAttribute("data-error","");
			document.getElementById("publish-image").src = image;
			document.getElementById("publisher-error").textContent = "";
			document.getElementById("publisher-error").style.display = "none";
			Materialize.updateTextFields();
		}
		$('#publisher').modal('open');
	}

	this.publishProject = function(){
		document.getElementById("publisher-error").textContent = "";
		document.getElementById("publisher-error").style.display = "none";
		document.getElementById("publisher-progress").style.visibility = "visible";
		var errors = false;
		var id = document.getElementById("publish-id").value;
		var title = document.getElementById("publish-title");
		var titlelabel = document.getElementById("publish-title-label");
		if (title.value.length<this.TitleLowerBound){
			errors = true;
			titlelabel.setAttribute("data-error","This field is required");
			title.classList.add("invalid");
			titlelabel.classList.add("active");
		}
		if (title.value.length>this.TitleUpperBound){
			errors = true;
			titlelabel.setAttribute("data-error","Title too long");
			title.classList.add("invalid");
			titlelabel.classList.add("active");
		}
		var description = document.getElementById("publish-description");
		var descriptionlabel = document.getElementById("publish-description-label");
		if (description.value.length<this.DescriptionLowerBound){
			errors = true;
			descriptionlabel.setAttribute("data-error","This field is required");
			description.classList.add("invalid");
			descriptionlabel.classList.add("active");
		}
		if (description.value.length>this.DescriptionUpperBound){
			errors = true;
			descriptionlabel.setAttribute("data-error","Description too long");
			description.classList.add("invalid");
			descriptionlabel.classList.add("active");
		}
		if (errors==true){
			this.hideProgressBar();
		} else {
			var submitobj = {};
			submitobj.ProjectID = id;
			submitobj.ProjectName = title.value;
			submitobj.ProjectDescription = description.value;
			//TODO: Convert these into real block names once integrated into MB
			//var obj = palettes.getProtoNameAndPalette("MIDI");
            //console.log(obj[0]);
            //console.log(obj[1]);
            //console.log(obj[2]);
			submitobj.ProjectSearchKeywords = this.parseProject(this.ProjectTable[id].ProjectData);
			submitobj.ProjectData = window.btoa(this.ProjectTable[id].ProjectData);
			submitobj.ProjectImage = this.ProjectTable[id].ProjectImage;
			submitobj.ProjectIsMusicBlocks = (Planet.IsMusicBlocks ? 1 : 0);
			submitobj.ProjectCreatorName = Planet.ProjectStorage.getDefaultCreatorName();
			submitobj.ProjectTags = this.getTags();
			var send = JSON.stringify(submitobj);
			var published = {};
			published.ProjectDescription = description.value;
			published.ProjectTags = this.getTags();
			Planet.ServerInterface.addProject(send,function(data){this.afterPublishProject(data,id,title.value,published)}.bind(this));
		}
	}

	this.parseProject = function(tb){
		try {
			tb = JSON.parse(tb);
		} catch (e){
			console.log(e);
			return "";
		}
		var words = new Set();
		for (var i = 0; i<tb.length; i++){
			var block = tb[i];
			if (typeof block[1]==='string'){
				words.add(block[1]);
			} else if (Array.isArray(block[1])){
				words.add(block[1][0]);
			} else if (typeof block[1]==='number'){
				break;
			}
		}
		var s = "";
		for (let item of words) {
			s+=item+" ";
		}
		return s.slice(0, -1);
	}

	this.hideProgressBar = function(){
		document.getElementById("publisher-progress").style.visibility = "hidden";
	}

	this.afterPublishProject = function(data,id,name,published){
		if (data.success){
			Planet.ProjectStorage.addPublishedData(id,published);
			Planet.ProjectStorage.renameProject(id,name);
			this.hideProgressBar();
			this.close();
			Planet.LocalPlanet.updateProjects();
		} else {
			this.throwError("Server Error ("+data.error+") - Try Again");
			this.hideProgressBar();
		}
	}

	this.throwError = function(error){
		document.getElementById("publisher-error").textContent = error;
		document.getElementById("publisher-error").style.display = "initial";
	}

	this.close = function(){
		$('#publisher').modal('close');
	}

	this.init = function(){
		if (!Planet.ConnectedToServer){
			var element = document.getElementById("publisher-form");
			element.parentNode.removeChild(element);
			element = document.getElementById("publisher-submit");
			element.parentNode.removeChild(element);
			var frag = document.createRange().createContextualFragment(this.PublisherOfflineHTML);
			document.getElementById("publisher-content").appendChild(frag);
		} else {
			this.addTags();
			this.initSubmit();
		}
	}
}