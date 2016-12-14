var APP = (function () {

	$(document).ready(function () {
		// Check if we're talking to an old DB (i.e. the APIs config is in test mode)
		$.when(RELAY.apiTestModeXHR().done(function (data) {
			if (data == true) {
				$('#testModeView').fadeIn();
			}
		}));
		// Get user info from Dataporten first
		$.when(DATAPORTEN.readyUser(), DATAPORTEN.readyGroups()).done(function () {
			// Now ready to check in with Relay to see if user is from a subscribing org and account status
			$.when(RELAY_USER.ready()).done(function () {
				// Check SuperAdmin status from API response as well as local info Dataporten
				// (regardless, the API would not allow API calls to Admin routes unless logged on user is an UNINETT employee)
				if (RELAY_USER.isSuperAdmin() && DATAPORTEN.user().org.id == 'uninett.no') {
					// Display view for SuperAdmins to edit subscriber table
					_showSubscribersView();
				}
				// User already has an account
				if (RELAY_USER.hasAccount()) {
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

	function _updateMainView() {
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

	function _updateHasAccountView() {
		$('.relayUserFullName').text(RELAY_USER.accountInfo().userDisplayName);
		$('.relayUserEmail').text(RELAY_USER.accountInfo().userEmail);
		$('.relayUserName').text(RELAY_USER.accountInfo().userName);
		$('.relayUserAffiliation').text(RELAY_USER.accountInfo().userAffiliation);
		$('#loadView').fadeOut();
		$('#hasAccountView').fadeIn();
	}

	/**
	 * Build a table with subscribers and controls to alter access parameters.
	 *
	 * @private
	 */
	function _showSubscribersView() {
		if (RELAY_USER.isSuperAdmin()) {
			_subscriberProcessingStart();
			$('#subscribersView').fadeIn();

			// Pull entire list of subscribers (past and present)
			$.when(SUBSCRIBERS.getSubscribersXHR()).done(function (orgs) {
				var tblBody = '';
				$.each(orgs, function (index, orgObj) {
					// `active` parameter
					var $dropDownAccess = $('#tblDropdownTemplate').clone();
					switch (orgObj.active) {
						case "1":
							$dropDownAccess.find('.currentValue').text('Aktiv');
							$dropDownAccess.find('.dropdown-menu').append('<li style="cursor: pointer;"><a class="btn-link btnDeactivateOrgAccess" data-org="' + orgObj.org + '">Steng tilgang</a></li>');
							$dropDownAccess.find('.btn').addClass('btn-success');
							break;
						case "0":
							$dropDownAccess.find('.currentValue').text('Stengt');
							$dropDownAccess.find('.dropdown-menu').append('<li style="cursor: pointer;"><a class="btn-link btnActivateOrgAccess" data-org="' + orgObj.org + '">Aktiver tilgang</a></li>');
							$dropDownAccess.find('.btn').addClass('btn-danger');
							break;
					}
					// `affiliation_access` parameter
					var $dropDownAffiliation = $('#tblDropdownTemplate').clone();
					$dropDownAffiliation.find('.currentValue').text(orgObj.affiliation_access);
					switch (orgObj.affiliation_access) {
						case "employee":
							$dropDownAffiliation.find('.btn').addClass('btn-info');
							$dropDownAffiliation.find('.dropdown-menu').append('<li style="cursor: pointer;"><a class="btn-link btnAddOrgStudentAccess" data-org="' + orgObj.org + '">Legg til studenttilgang</a></li>');
							break;
						case "member":
							$dropDownAffiliation.find('.btn').addClass('btn-primary');
							$dropDownAffiliation.find('.dropdown-menu').append('<li style="cursor: pointer;"><a class="btn-link btnRemoveOrgStudentAccess" data-org="' + orgObj.org + '">Fjern studenttilgang</a></li>');
							break;
					}

					// Add row to table
					tblBody += '<tr>' +
						'<td>' + orgObj.org + '</td>' +
						//'<td>' + orgObj.affiliation_access + '</td>' +
						'<td>' + $dropDownAffiliation.html() + '</td>' +
						//'<td>' + orgObj.active + '</td>' +
						'<td>' + $dropDownAccess.html() + '</td>' +
						'<td class="text-center"><button class="btnDeleteOrg btn-link uninett-fontColor-red" type="button" data-org="' + orgObj.org + '"><span class="glyphicon glyphicon-remove"></span></button></td>' +
						'</tr>';
				});
				$('#tblSubscribers').find('tbody').html(tblBody);
				//
				_subscriberProcessingEnd()
			});
		}
	}

	/**
	 * Spinner start
	 * @private
	 */
	function _subscriberProcessingStart() {
		$('#subscriberEditContainer').fadeOut(function () {
			$('.ajax').fadeIn();
		});
	}

	/**
	 * Spinner stop
	 * @private
	 */
	function _subscriberProcessingEnd() {
		$('.ajax').fadeOut(function () {
			$('#subscriberEditContainer').fadeIn();
		});
	}

	/**
	 * Set affiliation_access to 'member' for org
	 */
	$('#tblSubscribers').on('click', 'a.btnAddOrgStudentAccess', function () {
		_subscriberProcessingStart();
		$.when(SUBSCRIBERS.setSubscriberAffiliationAccessXHR($(this).data('org'), 'member')).always(function () {
			_showSubscribersView();
		});
	});
	/**
	 * Set affiliation_access to 'employee' for org
	 */
	$('#tblSubscribers').on('click', 'a.btnRemoveOrgStudentAccess', function () {
		_subscriberProcessingStart();
		$.when(SUBSCRIBERS.setSubscriberAffiliationAccessXHR($(this).data('org'), 'employee')).always(function () {
			_showSubscribersView();
		});
	});
	/**
	 * Set active to 1 for org
	 */
	$('#tblSubscribers').on('click', 'a.btnActivateOrgAccess', function () {
		_subscriberProcessingStart();
		$.when(SUBSCRIBERS.setSubscriberActiveStatusXHR($(this).data('org'), 1)).always(function () {
			_showSubscribersView();
		});
	});
	/**
	 * Set active to 0 for org
	 */
	$('#tblSubscribers').on('click', 'a.btnDeactivateOrgAccess', function () {
		_subscriberProcessingStart();
		$.when(SUBSCRIBERS.setSubscriberActiveStatusXHR($(this).data('org'), 0)).always(function () {
			_showSubscribersView();
		});
	});

	/**
	 * Create a new subscriber
	 */
	$('#btnCreateOrgSubmit').on('click', function () {
		var affiliation_access = $('#chkCreateOrgAffiliationAccess').is(':checked') ? 'member' : 'employee';
		var org = $('#txtCreateOrg').val().toLowerCase();
		var orgFormatText = "OBS! Orgnavnet følger ikke standard '.no' format!! \n \n";
		if (org.length === 0) {
			alert('Sukk... Du må jo skrive inn en org da...!');
		} else {
			if (org.indexOf('.') !== -1) {
				orgFormatText = '';
			}
			if (confirm(orgFormatText + "Legg til " + org + " som abonnent?")) {
				_subscriberProcessingStart();
				$.when(SUBSCRIBERS.createSubscriberXHR(org, affiliation_access))
					.always(function () {
					_showSubscribersView();
				});
			}
		}
	});

	/**
	 * Set active to 0 for org
	 */
	$('#tblSubscribers').on('click', 'button.btnDeleteOrg', function () {
		var org = $(this).data('org');
		if (confirm("Sikker på at du vil slette " + org + " fra tilgangslista? \n\nIKKE slett dersom lærestedet har brukt tjenesten (deaktiver heller).")) {
			_subscriberProcessingStart();
			$.when(SUBSCRIBERS.deleteSubscriberXHR(org))
				.always(function () {
					_showSubscribersView();
				});
		}
	});
})();