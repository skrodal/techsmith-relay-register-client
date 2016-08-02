/**
 * API Consumer.
 *
 * @author Simon Skrodal
 * @since July 2016
 */

var RELAY_REGISTER = (function () {

	// Autorun
	(function () {

	})();


	// POST
	function createAccountXHR() {
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().api_endpoints.relay_register + "relay/me/create/",
			method: "POST",
			dataType: 'json'
		}).pipe(function (obj) {
			return obj.data;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.xhrAlert(jqXHR.statusText, jqXHR.responseJSON.message);
			return false;
		});
	}


	return {
		createAccountXHR: function () {
			return createAccountXHR();
		}
	}
})();






