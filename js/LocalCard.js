function LocalCard(Planet){
	this.placeholderImage = "images/planetgraphic.png";
	this.id = null;
	this.ProjectData = null;
	this.renderData = '\
<div class="col no-margin-left s12 m6 l4"> \
	<div class="card"> \
		<div class="card-image"> \
			<img class="project-image" id="local-project-image-{ID}"> \
			<a class="btn-floating halfway-fab waves-effect waves-light orange modal-trigger tooltipped" data-position="top" data-delay="50" data-tooltip="Publish project" href="#publisher"><i class="material-icons">cloud_upload</i></a> \
		</div> \
		<div class="card-content"> \
			<input class="card-title grey-text text-darken-4" id="local-project-input-{ID}" /> \
		</div> \
		<div class="card-action"> \
			<div class="flexcontainer"> \
				<a class="project-icon tooltipped" data-position="bottom" data-delay="50" data-tooltip="Edit project" href="#"><i class="material-icons">edit</i></a> \
				<a class="project-icon tooltipped" data-position="bottom" data-delay="50" data-tooltip="Delete project" id="local-project-delete-{ID}"><i class="material-icons">delete</i></a> \
				<div> \
					<a class="project-icon tooltipped" data-position="bottom" data-delay="50" data-tooltip="Share project" href="#"><i class="material-icons">share</i></a> \
					<div class="card share-card" style="display:none;"> \
						<div class="card-content shareurltext"> \
							<div class="shareurltitle">Share</div> \
							<input type="text" name="shareurl" class="shareurlinput" value="https://walterbender.github.io/musicblocks/index.html?file=MusicBlocks_My_Project.tb"> \
							<div class="shareurl-advanced" id="s1"> \
								<div class="shareurltitle">Flags</div> \
								<div><input type="checkbox" name="run" id="checkbox1run"><label for="checkbox1run">Run project on startup.</label></div> \
								<div><input type="checkbox" name="show" id="checkbox1show"><label for="checkbox1show">Show code blocks on startup.</label></div> \
								<div><input type="checkbox" name="collapse" id="checkbox1collapse"><label for="checkbox1collapse">Collapse code blocks on startup.</label></div> \
							</div> \
						</div> \
						<div class="card-action"> \
							<a onclick="toggleExpandable(\'s1\',\'shareurl-advanced\');">Advanced Options</a> \
						</div> \
					</div> \
				</div> \
				<a class="project-icon tooltipped" data-position="bottom" data-delay="50" data-tooltip="Download project" href="#"><i class="material-icons">file_download</i></a> \
				<a class="project-icon tooltipped" data-position="bottom" data-delay="50" data-tooltip="Merge with current project" href="#"><i class="material-icons">merge_type</i></a> \
			</div> \
		</div> \
	</div>  \
</div>';

	this.render = function(){
		//TODO: Have a TB placeholder image specific to TB projects
		var html = this.renderData.replace(new RegExp('\{ID\}', 'g'), this.id);
		var frag = document.createRange().createContextualFragment(html);
		//set image
		if (this.ProjectData.ProjectImage!=null){
			frag.getElementById("local-project-image-"+this.id).src = this.ProjectData.ProjectImage;
		} else {
			frag.getElementById("local-project-image-"+this.id).src = this.placeholderImage;
		}
		//set input text
		frag.getElementById("local-project-input-"+this.id).value = this.ProjectData.ProjectName;
		//set input modify listener
		var t = this;
		frag.getElementById("local-project-input-"+this.id).addEventListener('input', function (evt) {
			Planet.ProjectStorage.renameProject(t.id,this.value);
		});

		//set delete button listener
		var t = this;
		frag.getElementById("local-project-delete-"+this.id).addEventListener('click', function (evt) {
			Planet.LocalPlanet.openDeleteModal(t.id);
		});
		document.getElementById("local-projects").appendChild(frag);
	}

	this.init = function(id){
		this.id = id;
		this.ProjectData = Planet.LocalPlanet.ProjectTable[this.id];
	}
}