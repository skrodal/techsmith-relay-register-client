/**
 * API Consumer.
 *
 * @author Simon Skrodal
 * @since July 2016
 */

var RELAY_USER = (function () {

	var XHR_READY = $.Deferred();
	var XHR_USER_ACCOUNT;
	var hasAccount = false;
	var accountInfo = {};

	// Autorun
	(function () {
		$.when(DATAPORTEN.readyUser().done(function () {
			XHR_USER_ACCOUNT = _getUserAccountXHR();
			$.when(XHR_USER_ACCOUNT).done(function (userInfo) {
				hasAccount = (userInfo !== false);
				accountInfo = userInfo;
				XHR_READY.resolve();
			});
		}));
	})();

	// Endpoint will check client/user/org access
	function _getUserAccountXHR() {
		return DP_AUTH.jso().ajax({
			url: DP_AUTH.config().api_endpoints.relay_register + "relay/me/",
			dataType: 'json'
		}).pipe(function (obj) {
			return obj.data;
		}).fail(function (jqXHR, textStatus, error) {
			UTILS.xhrAlert(jqXHR.statusText, jqXHR.responseJSON.message);
			return false;
		});
	}

	return {
		ready: function () {
			return XHR_READY;
		},
		hasAccount: function(){
			return hasAccount;
		},
		accountInfo: function(){
			return accountInfo;
		}
	}
})();






