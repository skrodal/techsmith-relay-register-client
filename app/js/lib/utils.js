var UTILS = (function () {

	function xhrAlert(title, message) {
		$('#errorView').find('#errorTitle').text(title);
		$('#errorView').find('#errorMessage').html('<code style="padding: 0px;">' + message + '</code>');

		var newLine = encodeURIComponent('\r\n');
		var mailBody = "Beskrivelse av problemet: " +
			newLine + newLine + newLine + newLine + newLine +
			"### Info hentet fra tjenesten ###" +
			newLine + newLine +
			"- Feilmelding: " + message + newLine +
			"- Navn: " + DATAPORTEN.user().name.full + newLine +
			"- Epost: " + DATAPORTEN.user().email + newLine +
			"- Brukernavn: " + DATAPORTEN.user().username + newLine +
			"- Tilhørighet: " + DATAPORTEN.user().affiliation;


		$('#errorView').find('#errorEmail').html('Vennligst <a href="mailto:kontakt@uninett.no?subject=Feil med TechSmith Relay brukerregistrering&body=' + mailBody + '">rapporter tjenestefeil</a> til UNINETT.');
		$('#loadView').fadeOut();
		$('#mainView').fadeOut();
		$('#hasAccountView').fadeOut();
		$('#errorView').fadeIn();
	}

	return {
		xhrAlert: function (title, message) {
			return xhrAlert(title, message);
		},
	}
})();


