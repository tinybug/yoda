'use strict';

import React from 'react/addons';
import ipc from 'ipc';
import {Player} from '../../core/Core';

const PureRenderMixin = React.addons.PureRenderMixin;

export default React.createClass({
  mixins: [PureRenderMixin],

  componentDidMount() {
    this.setupPlayer();
  },

  setupPlayer() {
    let playerDOM = document.createElement('video');
    playerDOM.id = 'player';
    playerDOM.classList.add('video-js');
    playerDOM.classList.add('vjs-default-skin');
    this.refs.playerContainer.getDOMNode().appendChild(playerDOM);

    ipc.on('url', function (url) {
      Player.playTrack(playerDOM, url);
    });

  },

  render() {
    return (
      <div className="player-container" ref="playerContainer">
      </div>
    );
  }
});