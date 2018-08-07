import 'babel-polyfill'
import queryString from 'query-string'
import $ from 'jQuery'
import ko from 'knockout'
import 'knockout-mapping'
import ipfsAPI from 'ipfs-api'

// Global view model variable
var viewModel
var ipfs

// Special handler for contenteditable elements
// Comes from:
// https://stackoverflow.com/questions/19370098/knockout-contenteditable-binding
// Don't worry about this for purposes of this tutorial
ko.bindingHandlers.contentEditable = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var value = ko.unwrap(valueAccessor()),
            htmlLazy = allBindingsAccessor().htmlLazy;
        $(element).on("input", function () {
            if (this.isContentEditable && ko.isWriteableObservable(htmlLazy)) {
                htmlLazy(this.innerHTML);
            }
        });
    },
    update: function (element, valueAccessor) {
        var value = ko.unwrap(valueAccessor());
        element.contentEditable = value;
        if (!element.isContentEditable) {
            $(element).trigger("input");
        }
    }
};

// Don't update view until after we've updated model
ko.bindingHandlers.htmlLazy = {
    update: function (element, valueAccessor) {
        var value = ko.unwrap(valueAccessor());
        if (!element.isContentEditable) {
            element.innerHTML = value;
        }
    }
};

// Async function to handle new json data
const handleDataUpdate = async () => {
  // If we're not editing, we can update
  if (!viewModel.editing()) {
    // Start loader to indicate long-running process
    $('#loader').css("display", "block")
    // Export viewModel to JSON
    const data = ko.toJS(viewModel)
    // Remove extra knockout-mapping lib key
    delete data.__ko_mapping__
    // Convert to (pretty) JSON string
    const json = JSON.stringify(data, null, 2)
    // IPFS add options, currently just defaults + dir wrapping
    const options = {wrapWithDirectory: true, onlyHash: false, pin: true}
    // Create binary buffer from JSON string
    const buf = Buffer.from(json)
    try {
      // Add the new file (same as on desktop)
      const res = await ipfs.files.add({path: 'json', content: buf}, options)
      // Publish new file to peer's PeerID
      const pub = await ipfs.name.publish(res[1].hash)
      console.log("published update")
    } catch(err) {
      console.log(err)
    }
    // Turn off loader now that we're done
    $('#loader').css("display", "none")
  }
}

// Async function to handle new image upload
const handleImageSelect = async (evt) => {
  // We're only allowing one image at a time
  const f = evt.target.files[0]
  const name = f.name
  // Only process image files.
  if (!f.type.match('image.*')) {
    return
  }
  // Start loader to indicate long-running process
  $('#loader').css("display", "block")
  // Create default file reader
  var reader = new FileReader()
  // Closure to capture the file information
  reader.onload = async (e) => {
    // Create binary buffer from image content
    const data = Buffer.from(e.target.result)
    // IPFS add options, currently just defaults + dir wrapping
    const options = {wrapWithDirectory: true, onlyHash: false, pin: true}
    // Add the new file (same as on desktop)
    const res = await ipfs.files.add({path: name, content: data}, options)
    // Create public gateway url for adding to data model
    const url = `https://ipfs.io/ipfs/${res[1].hash}/${res[0].path}`
    // Update view model
    viewModel.pic.url(url)
    // Turn off loader now that we're done
    $('#loader').css("display", "none")
  }
  // Read in the image file as array buffer
  reader.readAsArrayBuffer(f)
  // TODO: How/where would you call handleDataUpdate to publish this change?
}

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
    // Add an 'extra' observable for when we're editing
    viewModel.editing = ko.observable(false)
    // Apply the viewModel bindings
    ko.applyBindings(viewModel)
    // Hide the spinner/loader
    $('#loader').css("display", "none")
    // Setup some UI interactions for handling image and data updates
    $('#imageSelect').on('change', handleImageSelect)
    $('#edit').on('click', handleDataUpdate)
  } catch(err) {
    console.log(err)
  }
}
setup()
