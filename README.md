# Texile's IPFS ĐApp Template

> Basic template for building simple IPFS-based browser ĐApps

## Install

1. This app works best with `window.ipfs`. Install the IPFS Companion web extension:

    <a href="https://addons.mozilla.org/en-US/firefox/addon/ipfs-companion/" title="Get the add-on"><img width="86" src="https://blog.mozilla.org/addons/files/2015/11/AMO-button_1.png" /></a> <a href="https://chrome.google.com/webstore/detail/ipfs-companion/nibjojkomfdiaoajekhjakgkdhaomnch" title="Get the extension"><img width="103" src="https://developer.chrome.com/webstore/images/ChromeWebStore_BadgeWBorder_v2_206x58.png" /></a>

2. Install dependencies `yarn install`
3. Build the app `yarn build`
4. Start the app `yarn start`

### Develop

Instead of steps 3 & 4: `yarn watch`

### Deploy

Add to ipfs via `ipfs add -r dist/`

### Thanks

Based on the excellent [`ipfs-peer-map-example`](https://github.com/tableflip/ipfs-peer-map-example) from [tableflip.io](https://tableflip.io).
