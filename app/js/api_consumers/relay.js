var RELAY = (function () {

	// Autorun
	(function () {

	})();

	// Check if the API is in test mode. If so, it will read/write to an old DB
	function apiTestModeXHR(){
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().api_endpoints.relay_register + "service/testmode/",
			dataType: 'json'
		}).pipe(function (obj) {
			return obj.data;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.xhrAlert(jqXHR.statusText, jqXHR.responseJSON.message);
			return false;
		});
	}

	function getRelayDBVersionXHR(){
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().api_endpoints.relay_register + "relay/version/",
			dataType: 'json'
		}).pipe(function (obj) {
			return obj.data;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.xhrAlert(jqXHR.statusText, jqXHR.responseJSON.message);
			return false;
		});
	}

	// Subscriber details for logged on user's home org (the API will talk to Kind API for us)
	function getSubscriberDetailsXHR(){
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().api_endpoints.relay_register + "relay/org/subscription/",
			dataType: 'json'
		}).pipe(function (obj) {
			return obj.data;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.xhrAlert(jqXHR.statusText, jqXHR.responseJSON.message);
			return false;
		});
	}

	return {
		getRelayDBVersionXHR: function () {
			return getRelayDBVersionXHR();
		},
		getSubscriberDetailsXHR: function () {
			return getSubscriberDetailsXHR();
		},
		apiTestModeXHR: function () {
			return apiTestModeXHR();
		}
	}
})();

