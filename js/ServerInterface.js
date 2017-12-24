function ServerInterface(Planet){
	this.ServerURL = "http://127.0.0.1/planet-server/index.php";
	this.ConnectionFailureData = {"success":false,"error":"ERROR_CONNECTION_FAILURE"};
	this.APIKey = "3f2d3a4c-c7a4-4c3c-892e-ac43784f7381";

	this.request = function(data, callback){
		var t = this;
		data["api-key"]=this.APIKey;
		var req = $.ajax({
			type: "POST",
			url: this.ServerURL,
			data: data
		})
		.done(function(data){callback(data)})
		.fail(function(){callback(t.ConnectionFailureData)});
	}

	this.checkIfPublished = function(ProjectIDs, callback){
		var arr = [];
		for (var i = 0; i<ProjectIDs.length; i++){
			arr.push(parseInt(ProjectIDs[i]));
		}
		var obj = {"action":"checkIfPublished","ProjectIDs":JSON.stringify(arr)};
		this.request(obj,callback);
	}

	this.getTagManifest = function(callback){
		var obj = {"action":"getTagManifest"};
		this.request(obj,callback);
	}

	this.init = function(){

	}
}