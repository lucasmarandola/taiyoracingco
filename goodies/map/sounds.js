map.on('popupopen', function (e) {
  // Select buttons within the opened popup and add hover sound effect
  $(e.popup._contentNode).find('.popup-button').mouseenter(function () {
    playHoverSound();
  });
  
  // Play sound when popup opens
  playInstagramClickSound();
});
map.on('popupclose', function() {
  playPopupCloseSound();
});

function playListButtonClickSound() {
  var listButtonClickSound = document.getElementById('listButtonClickSound');
  listButtonClickSound.currentTime = 0; // Reset playback position to start
  listButtonClickSound.play();
}
function playHoverSound() {
  var hoverSound = document.getElementById('hoverSound');
  hoverSound.currentTime = 0; // Reset playback position to start
  hoverSound.play();
}
function playInstagramClickSound() {
  var instagramClickSound = document.getElementById('instagramClickSound');
  instagramClickSound.currentTime = 0; // Reset playback position to start
  instagramClickSound.play();
}
function playPopupCloseSound() {
  var popupCloseSound = document.getElementById('popupCloseSound');
  popupCloseSound.currentTime = 0; // Reset playback position to start
  popupCloseSound.play();
}