
var DATAPORTEN = (function () {
	var USER = {};
	USER.org = {};

	var XHR_USER, XHR_GROUPS;

	(function () {
		//XHR_USER = _getUserInfo();
		XHR_USER = _getUserInfoXHR();
		XHR_GROUPS = _getUserGroupsXHR();
	})();


	// ------------------- USERINFO -------------------

	function _getUserInfoXHR() {
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().dp_endpoints.userinfo,
			dataType: 'json'
		}).pipe(function (data) {
			var user = data.user;
			var username = user.userid_sec[0].split('feide:')[1];
			var org = username.split('@')[1];

			USER.id = user.userid;
			USER.username = username;
			USER.name = {
				full: user.name,
				first: user.name.split(' ')[0]
			};
			USER.email = user.email;
			USER.photo = DP_AUTH.config().dp_endpoints.photo + user.profilephoto;
			USER.org.id = org;
			USER.org.shortname = org.split('.')[0];
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.xhrAlert(jqXHR.statusText, jqXHR.responseJSON.message);
		});
	}

	// ------------------- ./USERINFO -------------------


	// ------------------- GRUPPER -------------------
	function _getUserGroupsXHR() {
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().dp_endpoints.groups + 'me/groups',
			dataType: 'json'
		}).pipe(function (groups) {
				USER.affiliation = null;
				USER.org.name = null;

				if (groups.length === 0) {
					UTILS.xhrAlert("Mangler rettigheter", "Du har dessverre ikke tilgang til tjenesten (fikk ikke tak i din tilhørighet)");
				} else {
					// Loop all groups
					$.each(groups, function (index, group) {
						// 1. Find out if user is member of a higher_education FC:ORG group
						// orgType is only present for org-type group
						if (group.orgType !== undefined && group.type !== undefined) {
							// Access only for users belonging to an Organization pertaining to higher education.
							if (group.orgType.indexOf("higher_education") >= 0 && group.type.toUpperCase() === "FC:ORG") {
								// Beware - according to docs, should return a string, not array - reported and may change
								USER.affiliation = group.membership.primaryAffiliation; // https://www.feide.no/attribute/edupersonprimaryaffiliation
								if (USER.affiliation instanceof Array) {
									USER.affiliation = USER.affiliation[0];
								}
								USER.affiliation = USER.affiliation.toLowerCase();
								USER.org.name = group.displayName;
							}
						}
					});
				}
			})
			.fail(function (jqXHR, textStatus, error) {
				UTILS.xhrAlert(jqXHR.statusText, jqXHR.responseJSON.message);
			});
	}


	// ------------------- ./ GRUPPER -------------------


	/*** Expose public functions ***/
	return {
		readyUser: function () {
			return XHR_USER;
		},
		readyGroups: function () {
			return XHR_GROUPS;
		},
		user: function () {
			return USER;
		}
	}
})();
