document.addEventListener(
	'DOMContentLoaded',
	function () {
		var checkPageButton = document.getElementById('generate');
		checkPageButton.addEventListener(
			'click',
			function () {
				chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
					// create the magic link
					const url = createMagicLink(tabs[0].url);

					// copy the url to the clipboard
					navigator.clipboard.writeText(url);

					// update the status message
					document.getElementById('generate').textContent = 'Copied!';
					// remove the status message after 2 seconds
					setTimeout(function () {
						window.close();
					}, 2000);
				});
			},
			false
		);
	},
	false
);

function createMagicLink(url) {
	// if url does not begin with https://dash.cloudflare.com/ then return error
	if (url.indexOf('https://dash.cloudflare.com/') !== 0) {
		return url;
	}

	// if url is a magic link, return it
	return 'https://dash.cloudflare.com/?to=' + parseUrlPath(url);
}

function parseUrlPath(url) {
	// remove https://dash.cloudflare.com/ from url
	let path = url.replace('https://dash.cloudflare.com/', '');

	// remove trailing slash if exists
	path = path.replace(/\/$/, '');

	// split path into array
	path = path.split('/');

	// if first item is an account id, save it
	let accountId = '';
	if (path[0].length === 32) {
		accountId = path[0];
		path.shift();
	}

	// if first item is a zone domain, save it
	let zoneDomain = '';
	if (path[0].indexOf('.') > 0) {
		zoneDomain = path[0];
		path.shift();
	}

	// if a pages path, extract the project name, save it
	let pagesName = '';
	if (path[0] === 'pages') {
		path.shift();
		path.shift();
		pagesName = path[0];
		path.shift();
	}

	// no data detected, return the path rejoined
	if (accountId === '' && zoneDomain === '' && pagesName === '') {
		return `/${path.join('/')}`;
	}

	// if pagesName is present, return the path for pages
	if (accountId !== '' && pagesName !== '') {
		return `/:account/pages/view/:pages-project/${path.join('/')}`;
	}

	// if account and zone are both present, return the path
	if (accountId !== '' && zoneDomain !== '') {
		return `/:account/:zone/${path.join('/')}`;
	}

	// if account is present but zone is not, return the path
	if (accountId !== '' && zoneDomain === '') {
		return `/:account/${path.join('/')}`;
	}

	// no match, return the path rejoined
	return `/${path.join('/')}`;
}
