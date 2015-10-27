'use strict';

import videojs from 'video.js';

export default {
  _getDefaultVideoJSConfig() {
    return {
      width: '1080px',
      height: '720px',
      autoplay: false,
      bigPlayButton: false,
      controls: true,
      controlBar: {
        playToggle: true,
        fullscreenToggle: true,
        muteToggle: true
      }
    };
  },

  ready() {
    if (! this._playerDOM) {
      return Promise.reject('playerDOM is not ready');
    }
    else if (this._player) {
      return Promise.resolve(this._player);
    }
    else {
      var self = this;
      var promise = new Promise((resolve) => {
        videojs(
          this._playerDOM,
          this._getDefaultVideoJSConfig()
        ).ready(function() {
            self._player = this;
            // return real videojs-ed player out
            resolve(self._player);
          });
      });
      return promise;
    }
  },

  stopCurTrack() {
    this._player.pause();
    this._player.src('');
    this._player.play();
    this._errDisplayDom = document.getElementsByClassName('vjs-error-display')[0];
    if(this._errDisplayDom) {
      this._errDisplayDom.style.visibility = "hidden";
    }
  },

  playTrack(playerDOM, track) {
    if(! this._playerDOM) {
      this._playerDOM = playerDOM;
    }

    if(this._errDisplayDom) {
      this._errDisplayDom.style.visibility = "visible";
    }

    this.ready().then(()=>{
      this._player.pause();
      this._player.src(track);
      this._player.play();
    });
  }
};