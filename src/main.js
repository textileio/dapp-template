import 'babel-polyfill'
import getIpfs from 'window.ipfs-fallback'
import queryString from 'query-string'
import $ from 'jquery'

const buildPage = (json) => {
  // Add profile image
  $('#image').css('background-image', `url('${json.pic.url}')`)
  // Add name
  $('#name').text(`${json.name.first} ${json.name.last}`)
  // Add job title and employer (only first)
  const work = json.work[0]
  const link = $('<a>', { text: work.employer, href: work.url })
  $('#title').html(`${work.title} at `).append(link)
  // Add bio
  $('#bio').text(`${json.bio}`)
  // Add social media links
  const social = $('#social')
  for (let item of json.social) {
    const isWebsite = item.service === 'website'
    social.append(
      $('<a>', { href: item.url, class: 'social' }).append(
        $('<i>', {
          class: isWebsite ? 'fas fa-globe' : `fab fa-${item.service}`
        })
      )
    )
  }
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
  }
}
setup()
