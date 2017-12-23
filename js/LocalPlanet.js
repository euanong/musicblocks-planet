function LocalPlanet(Planet){
	this.UserIDCookie = "UserID";
	this.UserID = null;
	this.CookieDuration = 3650;

	this.prepareUserID = function(){
		var id = getCookie(this.UserIDCookie);
		if (id==""){
			id = Planet.ProjectStorage.generateID();
			setCookie(this.UserIDCookie,id,3650);
		}
		this.UserID = id;
	}

	this.open = function(){

	}

	this.init = function(){
		this.prepareUserID();
	}
}