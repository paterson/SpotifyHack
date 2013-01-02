var spotify = require('spotify-node-applescript')
var async = require('async')
var oldvolume
function init() {
	spotify.getTrack(function (err, track){
		spotify.getState(function (err,state) {
				var volume = state.volume
				if (!oldvolume)
					oldvolume = volume
				if (track.duration <= 40 && track.popularity == 0) {
					arr = new Array(volume)
					async.forEach(arr, function (i,callback) {
						spotify.volumeDown()
						callback()
					})
					init()
				}
				else {	
					arr = new Array(oldvolume)
					async.forEach(arr,function (i,callback) {
						spotify.volumeUp()
						callback()
					})
					oldvolume = volume
					check(track.duration)
				}
			})
	})
}
function check(duration) {
	spotify.getState(function (err, state){
		if (duration - parseInt(state.position) <= 2.0) {
			spotify.next(function (){
				init()
			})
		}
		else {
			check(duration)
		}
	})
}


init()