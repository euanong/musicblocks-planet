// Copyright (c) 2017 Euan Ong
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the The GNU Affero General Public
// License as published by the Free Software Foundation; either
// version 3 of the License, or (at your option) any later version.
//
// You should have received a copy of the GNU Affero General Public
// License along with this library; if not, write to the Free Software
// Foundation, 51 Franklin Street, Suite 500 Boston, MA 02110-1335 USA

function GlobalPlanet(Planet) {
	this.offlineHTML = '<div class="container center-align">'+_('Feature unavailable - cannot connect to server. Reload Music Blocks to try again.')+'</div>';
	this.tags = [];
	this.specialTags = null;
	this.defaultTag = null;
	this.searchMode = null;
	this.index = 0;
	this.page = 25;
	this.sortBy = null;

	this.initTagList = function(){
		for (var i = 0; i<this.specialTags.length; i++){
			var t = new GlobalTag(Planet);
			t.init(this.specialTags[i]);
			this.tags.push(t);
			if (this.specialTags[i].defaultTag==true){
				this.defaultTag=t;
			}
		}
		var keys = Object.keys(Planet.TagsManifest);
		for (var i = 0; i<keys.length; i++){
			var t = new GlobalTag(Planet);
			t.init({"id":keys[i]});
			this.tags.push(t);
		}
		this.sortBy = document.getElementById("sort-select").value;
		this.selectSpecialTag(this.defaultTag);
	}

	this.selectSpecialTag = function(tag){
		for (var i = 0; i<this.tags.length; i++){
			this.tags[i].unselect();
		}
		tag.select();
		tag.func();
	}

	this.unselectSpecialTags = function(){
		for (var i = 0; i<this.tags.length; i++){
			if (this.tags[i].specialTag){
				this.tags[i].unselect();
			}
		}
	}

	this.refreshTagList = function(){
		var tagids = [];
		for (var i = 0; i<this.tags.length; i++){
			if (this.tags[i].specialTag==false&&this.tags[i].selected==true){
				tagids.push(this.tags[i].id);
			}
		}
		if (tagids.length==0){
			this.selectSpecialTag(this.defaultTag);
		} else {
			this.unselectSpecialTags();
			this.searchTags(tagids);
		}
	}

	this.searchAllProjects = function(){
		this.searchMode = "ALL_PROJECTS";
		this.refreshProjects();
	}

	this.searchMyProjects = function(){
		this.searchMode = "USER_PROJECTS";
		this.refreshProjects();
	}

	this.searchRecentlyViewed = function(){
		console.log("recently viewed");
	}

	this.searchTags = function(tagids){
		this.searchMode = JSON.stringify(tagids);
		this.refreshProjects();
	}

	this.refreshProjects = function(){
		this.index = 0;
		console.log(this.searchMode);
		console.log(this.sortBy);
		Planet.ServerInterface.downloadProjectList(this.searchMode,this.sortBy,this.index,this.index+this.page,this.afterRefreshProjects);
	}

	this.afterRefreshProjects = function(data){
		console.log(data);
	}

	this.init = function(){
		if (!Planet.ConnectedToServer){
			document.getElementById("globaltitle").textContent = _("Cannot connect to server");
			document.getElementById("globalcontents").innerHTML = this.offlineHTML;
		} else {
			var t = this;
			$('#sort-select').material_select(function (evt) {
				t.sortBy = document.getElementById("sort-select").value;
				t.refreshProjects();
			});
			this.specialTags = 
			[{"name":"All Projects","func":this.searchAllProjects.bind(this),"defaultTag":true},
			{"name":"My Projects","func":this.searchMyProjects.bind(this)},
			{"name":"Recently Viewed","func":this.searchRecentlyViewed.bind(this)}];
			this.initTagList();
		}
	}
}