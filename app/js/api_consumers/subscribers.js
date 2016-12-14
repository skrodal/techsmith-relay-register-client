var SUBSCRIBERS = (function () {

	// Autorun
	(function () {

	})();

	function getSubscribersXHR(){
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().api_endpoints.relay_register + "subscribers/",
			dataType: 'json'
		}).pipe(function (obj) {
			return obj.data;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.xhrAlert(jqXHR.statusText, jqXHR.responseJSON.message);
			return false;
		});
	}

	function createSubscriberXHR(org, affiliation){
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().api_endpoints.relay_register + "subscribers/create/" + org + "/affiliation_access/" + affiliation + "/",
			method: "POST"
		}).pipe(function (obj) {
			return obj.data;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.xhrAlert(jqXHR.statusText, jqXHR.responseJSON.message);
			return false;
		});
	}

	function setSubscriberActiveStatusXHR(org, status){
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().api_endpoints.relay_register + "subscribers/update/" + org + "/active/" + status + "/",
			method: "POST"
		}).pipe(function (obj) {
			return obj.data;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.xhrAlert(jqXHR.statusText, jqXHR.responseJSON.message);
			return false;
		});
	}

	function setSubscriberAffiliationAccessXHR(org, affiliation){
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().api_endpoints.relay_register + "subscribers/update/" + org + "/affiliation_access/" + affiliation + "/",
			method: "POST"
		}).pipe(function (obj) {
			return obj.data;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.xhrAlert(jqXHR.statusText, jqXHR.responseJSON.message);
			return false;
		});
	}

	function deleteSubscriberXHR(org){
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().api_endpoints.relay_register + "subscribers/delete/" + org + "/",
			method: "DELETE"
		}).pipe(function (obj) {
			return obj.data;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.xhrAlert(jqXHR.statusText, jqXHR.responseJSON.message);
			return false;
		});
	}


	return {
		getSubscribersXHR: function () {
			return getSubscribersXHR();
		},
		createSubscriberXHR: function (org, affiliation) {
			return createSubscriberXHR(org, affiliation);
		},
		setSubscriberActiveStatusXHR: function (org, status) {
			return setSubscriberActiveStatusXHR(org, status);
		},
		setSubscriberAffiliationAccessXHR: function (org, affiliation) {
			return setSubscriberAffiliationAccessXHR(org, affiliation);
		},
		deleteSubscriberXHR: function (org) {
			return deleteSubscriberXHR(org);
		}
	}
})();

