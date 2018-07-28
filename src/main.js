import 'babel-polyfill'
import getIpfs from 'window.ipfs-fallback'
import queryString from 'query-string'

const buildError = (error) => {
  const main = document.getElementById('main')
  main.appendChild(document.createTextNode(error))
}

const buildPage = (json) => {
  const main = document.getElementById('main')

  // Add profile pic
  const img = document.createElement('div')
  img.style.backgroundImage = `url('${json.pic.url}')`
  img.className = 'pic'
  main.appendChild(img)

  // Add profile information
  const profileDiv = document.createElement('div')
  profileDiv.className = 'profile'
  // Add name
  const h1 = document.createElement('h1')
  const name = document.createTextNode(`${json.name.first} ${json.name.last}`)
  h1.appendChild(name)
  profileDiv.appendChild(h1)

  // Add job title and employer (only first)
  const work = json.work[0]
  const h2 = document.createElement('h2')
  const link = document.createElement('a')
  link.href = work.url
  link.appendChild(document.createTextNode(work.employer))
  h2.appendChild(document.createTextNode(`${work.title} at `))
  h2.appendChild(link)
  profileDiv.appendChild(h2)

  // Add bio
  const bioDiv = document.createElement('div')
  const bio = document.createTextNode(`${json.bio}`)
  bioDiv.className = 'bio'
  bioDiv.appendChild(bio)
  profileDiv.appendChild(bioDiv)

  // Add social media links
  const socialDiv = document.createElement('div')
  socialDiv.id = 'social'
  for (let item of json.social) {
    const a = document.createElement('a')
    a.className = 'social'
    a.href = item.url
    const icon = document.createElement('i')
    if (item.service === 'website') {
      icon.className = 'fas fa-globe'
    } else {
      icon.className = `fab fa-${item.service}`
    }
    a.appendChild(icon)
    socialDiv.appendChild(a)
  }
  profileDiv.appendChild(socialDiv)
  main.appendChild(profileDiv)
}

const setup = async () => {
  try {
    // Create IPFS Peer
    const ipfs = await getIpfs()
    // Grab the ID if provided, otherwise use local id
    const query = queryString.parse(location.search)
    const id = await ipfs.id()
    const ipns = query.pid ? query.pid : id.id
    // Print out id for debugging purposes
    console.log(`running ${id.agentVersion} with ID ${id.id}`)
    // Resolve IPNS hash (this is a new feature!)
    const name = await ipfs.name.resolve(`/ipns/${ipns}`)
    // Now, fetch files...
    const files = await ipfs.files.get(`${name}/json`)
    // Extract binary file contents
    const string = String.fromCharCode.apply(null, files[0].content)
    // Parse/convert to JSON
    const json = JSON.parse(string)
    // Build the page from the JSON information
    buildPage(json)
  } catch(err) {
    console.log(err)
    buildError(err)
  }
}
setup()
