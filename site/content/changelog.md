---
title: "Changelog"
date: 2020-05-15T18:47:00-05:00
menu: learn
weight: 2
---

Changes to this project will be documented here.

### [0.3.5] - Unreleased
  
  * Lots of code refactoring
  * Maybe slight performance improvement
  * Add babel to not break IE11 with ES6 features
  * Better minifier
  * Drawing name validates on input instead of output
  * Removed tooltip and snap options from export/import file
    * although old imports still work
  * Save options across sessions with local storage
  * Added clear button to erase everything
  * Save drawing across sessions with local storage
  * Fix some small display glitches
    * with unstyled fonts showing
    * with options dialog position
    * when saving image

### [0.3.4] - 2020-05-15

  * Add option for color theme with blueprint and dark mode
  * Change line colors to better shades

### [0.3.3] - 2020-05-08

  * Add display options for tooltip measurements

### [0.3.2] - 2020-05-02

  * Fix PNG and JSON not downloading in IE and Edge
  * Add tool to place text
  * Add help button
  * Add website footer links to documentation and analytics

### [0.3.1] - 2020-02-22

  * Updates to enable Progressive Web App
  * Add a bunch of homescreen icons
  * Add service worker to work offline

### [0.3.0] - 2019-05-26

  * split javascript into modules, bundle with rollup.js
  * use hugo to build site from markdown and theme
  * added node.js dev dependencies
  * reorganize directories
  * reformated changelog
  * update readme
  * deploy with netlify

### [0.2.4] - 2017-09-12

  * Add webhook deploy on push
  * Add line color and width selection
  * Fixed offsets in saved images

### [0.2.3] - 2017-09-04

  * uploaded to github
  * added license and readme
  * enabled ssl
  * added landing pages
  * fixed contact link in Chrome
  * fixed options close button in Chrome

### [0.2.2] - 2016-11-22

  * changed zero length lines into tiny circles
  * added points array to drawing
  * populating with endpoints of lines and endpoints and centerpoint of arcs
  * added endpoint snap

### [0.2.1] - 2016-11-05

  * added keyboard shortcuts
  * added shortcuts menu item and styles
  * added project name input for file name
  * included project name in import/export file
  * updated about text
  * added svg dropdown arrows and dialog X button
  * refactored resetting tool for ESC to work cleanly

### [0.2.0] - 2016-10-07

  * updated options menu
  * fixing several issues with the dialog
  * really all the html and css was redone
  * kinda messy now
  * moved about into options
  * fine tuned color scheme
  * removed tracking code from version in versions dir
  * set default divisions back to 8 again

### [0.1.9] - 2016-09-30

  * added option for length snap
  * reworked snap function to allow any combo of grid, length, angle
  * made the snap function really messy
  * changed facebook image to thumbnail.png
  * added robots.txt and sitemap.txt
  * updated domain name in tracking
  * added back endcap style so points work
  * changed default angle snap to 15
  * added lengthsnap default on import for older saves
  * added canonical and hreflang meta

### [0.1.8] - 2016-08-30

  * created initial snap function
  * added angle snap for line and circle
  * eraser no longer snaps
  * moved versions to dir
  * renamed current to index.html and adjusted htaccess cause issues
  * added 404 page

### [0.1.7] - 2016-08-29

  * added second canvas for background
  * fixed eraser erasing grid
  * fixed export showing alpha for erased areas

### [0.1.6] - 2016-08-28

  * added favicon
  * added facebook image
  * added meta description
  * readded tracking code
  * verified with google search console
  * fixed eraser breaking with no snap
  * added high res icon and app manifest

### [0.1.5] - 2016-08-28

  * added eraser
  * fixed tooltip still showing after save before move
  * hid clear button can't decide what to do with it
  * updated styles
  * switch arc to counter clockwise
  * fixed starting new line without moving
  * moved option buttons to top and renamed
  * hid dpi table
  * renamed info to about and cleaned up

### [0.1.4] - 2016-08-27

  * brought back coordinates as tooltip
  * add length and angle to tooltip
  * fixed 360 arc
  * switched back to 3 point circle
  * tooltip now hides on canvas mouseout
  * added touchscreen detection to info
  * added suggestions, and donate links
  * reset browser button glow
  * bring back touchevents
  * correct z-indexing

### [0.1.3] - 2016-08-26

  * back to vertical nav
  * move help text to footer
  * bunch of styles
  * readded grid with working unit options
  * readded cursor indicator
  * png export
  * selectable grid snap
  * import export bugfixes
  * hiding angle snap for now
  * failed to get anything meaningful out of dpi, just added to info

### [0.1.2] - 2016-08-25

  * added seperate options dialog
  * moved some buttons into options
  * more buttons so added button click handling function
  * added info dialog
  * added some css spacing to UI stuff
  * readded viewport scale
  * moved notes from comment to readme.txt
  * added changelog.txt
  * changed domain to reallysketch.com
  * renamed clear to eraser as placeholder

### [0.1.1] - 2016-08-24

  * got rid of angle tool
  * import/export working

### [0.1.0] - 2016-08-24

  * started over from scratch
  * lost grid
  * lost coordinates
  * lost cursor indicator
  * lost touch events
  * lost viewport scale
  * lost all styles and icons
  * added help text
  * now a four click arc
  * implemented angle tool
  * export sort of there

### [0.0.3] - 2016-08-23

  * cleaned up placeholder buttons
  * new icons
  * new button colors

### [0.0.2] - 2016-08-23

  * changed from drag to click interaction
  * added additional placeholder buttons
  * coordinates in fractions

### [0.0.1] - 2016-08-22

  * added cursor indicator
  * shifted cursor up on mobile
  * tuned touch vs mouse interaction
  * changed circle to arc
  * new button styles
  * new icons
  * new font

### [0.0.0] - 2016-08-21

  * upload to graphruled.com
  * drag to draw lines and circles
  * undo/clear buttons
  * in/cm grids
  * snap to half grid
  * live coordinates
  * resizeable
  * mobile freindly