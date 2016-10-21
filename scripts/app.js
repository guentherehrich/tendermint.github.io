(function() {
'use strict'

var $ = require('jquery')
var hljs = require('highlight.js')

// syntax highlighting
hljs.initHighlightingOnLoad()

// home arrow clicky
$("#home-arrow-down").click(function(event) {
  event.preventDefault()

  console.log('how-arrow clicked!')

  $('html, body').animate({
    scrollTop: $("#scroll-down-here").offset().top - 48
  }, 1000)
})

// better youtube embeds
$(".youtube").each(function() {
	// Set the BG image from the youtube ID
	$(this).css('background-image', 'url(//i.ytimg.com/vi/' + this.id + '/hqdefault.jpg)')
	// Click the video div
	$(document).delegate('#' + this.id, 'click', function() {
		// Build embed URL
		var iframe_url = "//www.youtube.com/embed/" + this.id + "?autoplay=1&autohide=1"
		// Grab extra parameters set on div
		if ($(this).data('params')) iframe_url += '&' + $(this).data('params')
		// Build iframe tag
		var iframe = $('<iframe/>', {'allowfullscreen':'allowfullscreen', 'frameborder': '0', 'src': iframe_url})
		// Replace the YouTube thumbnail with YouTube HTML5 Player
		$(this).append(iframe)
	})// /click
}) // /each video

})()
