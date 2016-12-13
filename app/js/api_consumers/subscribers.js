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
		console.log(affiliation);
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().api_endpoints.relay_register + "subscribers/create/" + org + "/affiliation/" + affiliation + "/",
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
			url: DP_AUTH.config().api_endpoints.relay_register + "subscribers/update/" + org + "/affiliation/" + affiliation + "/",
			method: "POST"
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
		}

	}
})();
