document.addEventListener(
	'DOMContentLoaded',
	function () {
		var checkPageButton = document.getElementById('generate');
		checkPageButton.addEventListener(
			'click',
			function () {
				// determine if chrome or other browser
				const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

				if (isChrome) {
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
				} else {
					browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
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
				}
			},
			false
		);
	},
	false
);

function createMagicLink(url) {
	// if url does not begin with https://dash.cloudflare.com/ or one.dash.cloudflare.com/, return it
	if (url.indexOf('https://dash.cloudflare.com/') !== 0 && url.indexOf('https://one.dash.cloudflare.com/') !== 0) {
		return url;
	}

	// if for one.dash.cloudflare.com
	if (url.indexOf('https://one.dash.cloudflare.com/') === 0) {
		return 'https://one.dash.cloudflare.com/?to=' + parseUrlPath(url);
	} else {
		// for dash.cloudflare.com
		return 'https://dash.cloudflare.com/?to=' + parseUrlPath(url);
	}
}

function parseUrlPath(url) {
	// remove https://dash.cloudflare.com/ and https://one.dash.cloudflare.com/ from the url
	let path = url.replace('https://dash.cloudflare.com/', '').replace('https://one.dash.cloudflare.com/', '');

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

	// if a pages path with a deployment id, save it
	let pagesDeploymentId = '';
	if (pagesName !== '' && path[0].length === 36) {
		pagesDeploymentId = path[0];
		path.shift();
	}

	// if a workers path, get the worker name
	let workerName = '';
	if (path[0] === 'workers') {
		path.shift(); // /workers
		path.shift(); // /services
		path.shift(); // /view
		workerName = path[0];
		path.shift();
	}

	// no data detected, return the path rejoined
	if (accountId === '' && zoneDomain === '' && pagesName === '' && pagesDeploymentId === '' && workerName === '') {
		return `/${path.join('/')}`;
	}

	if (accountId !== '' && workerName !== '') {
		return `/:account/workers/services/view/:worker/${path.join('/')}`;
	}

	// if pagesName and pagesDeploymentId are both present, return the path for pages
	if (accountId !== '' && pagesName !== '' && pagesDeploymentId !== '') {
		return `/:account/pages/view/:pages-project/:pages-deployment/${path.join('/')}`;
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
