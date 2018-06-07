import 'babel-polyfill'
import getIpfs from 'window.ipfs-fallback'

const setup = async () => {
  try {
    const ipfs = await getIpfs()
    const id = await ipfs.id()
    console.log(`running ${id.agentVersion} with ID ${id.id}`)
  } catch(err) {
    console.log(err)
  }
}
setup()
