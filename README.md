# cloudflare-magic-linker
Chrome extension for copying magic deep links into the Cloudflare dashboard

Supports:
- `:account` - Account ID for the Dashboard and Zero Trust
- `:zone` - Zone domain name
- `:pages-project` - Pages project name
- `:pages-deployment` - Pages deployment ID

> [!TIP] 
> The Zero Trust dashboard's support for deep links is currently less mature than the regular dashboard, so some links may not work as expected. Make sure to test your links before sharing them.

## Installation
### From Chrome Webstore (*recommended*)
[Cloudflare Magic Linker on Chrome Webstore](https://chromewebstore.google.com/detail/fongdcpejhfehpdcahcjncgfhkepoico)

### From Source
1. Clone this repo
2. Open Chrome and navigate to `chrome://extensions`
3. Enable developer mode
4. Click "Load unpacked" and select the cloned repo
5. Navigate to the Cloudflare dashboard and click the extension icon in the toolbar
6. Click the "Copy" button on a page you want to link to
7. Share the magic link with your team

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change on [mackenly/cloudflare-magic-linker](https://github.com/mackenly/cloudflare-magic-linker).

## License
[GNU GPL v3](./LICENSE)

Not associated or endorsed by Cloudflare. Cloudflare™️ is a trademark of Cloudflare, Inc.
