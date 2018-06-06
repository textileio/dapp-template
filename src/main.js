import 'babel-polyfill'
import getIpfs from 'window.ipfs-fallback'
import { Gallery } from 'natural-gallery-js';

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

var gallery = document.getElementById('gallery')
var photoswipe = document.getElementById('photoswipe')

// Create your gallery options
var options = {
  format: 'natural',
  // Max row height. Works for both natural and square format. Prefer this option for a "responsive" approach
  rowHeight: 350,
  margin: 3, // Gap between thumbnails
  // Number of rows, activate pagination (disables infinite scroll)
  // limit: 0,
  // Initial number of rows. If null, gallery tries to define the number of required rows to fill the viewport.
  minRowsAtStart: null,
  showLabels: 'always', // When to show the labels in thumbnails (use 'hover')
  // Open a lightbox with a bigger image -> activate a zoom effect on hover on thumbnails
  lightbox: true,
  zoomRotation: false,
  // Number of pixels to offset the infinite scroll autoload
  // If negative, next rows will load before the bottom of gallery container is visible
  // If 0 the next rows will load when the bottom of the gallery will be visible
  // If positive, the next rows will load when the bottom of the gallery will be this amount above the end of the viewport.
  // If positive be sure to always have this number of pixels as margin, padding or more content after the gallery.
  infiniteScrollOffset: -50,
  // Header / Search options.
  showCount: false,
  searchFilter: false,
  categoriesFilter: false,
  showNone: false,
  showOthers: false,
  labelCategories: 'Category',
  labelNone: 'None',
  labelOthers: 'Others',
  labelSearch: 'Search',
  labelImages: 'Images',
}

// Create a gallery
var gallery = new Gallery(gallery, photoswipe, options)
