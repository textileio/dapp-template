import 'babel-polyfill'
import queryString from 'query-string'
import $ from 'jQuery'
import ko from 'knockout'
import 'knockout-mapping'
import ipfsAPI from 'ipfs-api'

// Global view model variable
var viewModel
var ipfs

const setup = async () => {
  try {
    $('#loader').css("display", "block")
    ipfs = ipfsAPI()
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
    // Setup a viewModel based on our JSON structure
    viewModel = ko.mapping.fromJS(json)
    // Apply the viewModel bindings
    ko.applyBindings(viewModel)
    // Hide the spinner/loader
    $('#loader').css("display", "none")
  } catch(err) {
    console.log(err)
  }
}
setup()
