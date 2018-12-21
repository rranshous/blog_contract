var IPFS;
(() => {
	const log = (msg) => {
		console.log(msg)
	}
	const getIpfs = () => new Promise((resolve, reject) => {
    console.log("getIpfs");
		if (window.ipfs) {
			log('window.ipfs is available!')
			return resolve(window.ipfs)
		}
		log('window.ipfs is not available, downloading from CDN...')
		const script = document.createElement('script')
		script.src = 'https://unpkg.com/ipfs/dist/index.min.js'
		script.onload = () => {
			log('starting IPFS node')
			const ipfs = new window.Ipfs()
			ipfs.once('ready', () => resolve(ipfs))
		}
		script.onerror = reject
		document.body.appendChild(script)
	})
	getIpfs()
		.then(
      (ipfs) => {
        IPFS = ipfs;
        console.log("ipfs init:", IPFS);
        ipfs.id()
        .then(id => log(`running ${id.agentVersion} with ID ${id.id}`))
      }
    )
		.catch(log)
})();
