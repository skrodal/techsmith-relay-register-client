var APP = (function () {

	$(document).ready(function () {
		// Check if we're talking to an old DB (i.e. the APIs config is in test mode)
		$.when(RELAY.apiTestModeXHR().done(function (data) {
			if(data == true){ $('#testModeView').fadeIn(); }
		}));
		// Get user info from Dataporten first
		$.when(DATAPORTEN.readyUser(), DATAPORTEN.readyGroups()).done(function () {
			// Now ready to check in with Relay to see if user is from a subscribing org and account status
			$.when(RELAY_USER.ready()).done(function () {
				// User already has an account
				if(RELAY_USER.hasAccount()){
					_updateHasAccountView();
					return;
				}
				// All good, populate user details and show main view
				_updateMainView();
			});
		});
	});

	$('#btnCreateAccount').on('click', function () {
		// Checkbox on?
		if ($("#chkEulaAccept").is(':checked')) {
			// Yep, create account
			$("#eulaAlert").hide();
			var $btn = $(this).button('loading')
			// Create account!
			$.when(RELAY_REGISTER.createAccountXHR()).done(function (data) {
				$btn.button('reset')
				// When done, populate modal with info from API
				$('#mdAccountDetails').find('.userDisplayName').text(data.userDisplayName);
				$('#mdAccountDetails').find('.userName').text(data.userName);
				$('#mdAccountDetails').find('.userEmail').text(data.userEmail);
				$('#mdAccountDetails').find('.userAffiliation').text(data.userAffiliation);
				$('#mdAccountDetails').find('.userPassword').text(data.userPassword);
				// Show modal in a locked state
				$('#mdAccountDetails').modal({
					keyboard: false,
					backdrop: 'static'
				});
			});
		}
		// Show reminder..
		else {
			$("#eulaAlert").show();
		}

	});

	function _updateMainView(){
		$('.userFullName').text(DATAPORTEN.user().name.full);
		$('.userFirstName').text(DATAPORTEN.user().name.first);
		$('.userEmail').text(DATAPORTEN.user().email);
		$('.userName').text(DATAPORTEN.user().username);
		$('.userAffiliation').text(DATAPORTEN.user().affiliation);
		$('.userProfilePhoto').attr('src', DATAPORTEN.user().photo);
		$('#loadView').fadeOut();
		$('#mainView').fadeIn();
		// Add version to title.
		$.when(RELAY.getRelayDBVersionXHR().done(function (data) {
			$('.relayVersionNumber').text('v.' + data);
		}));

	}

	function _updateHasAccountView(){
		$('.relayUserFullName').text(RELAY_USER.accountInfo().userDisplayName);
		$('.relayUserEmail').text(RELAY_USER.accountInfo().userEmail);
		$('.relayUserName').text(RELAY_USER.accountInfo().userName);
		$('.relayUserAffiliation').text(RELAY_USER.accountInfo().userAffiliation);
		$('#loadView').fadeOut();
		$('#hasAccountView').fadeIn();
	}

})();