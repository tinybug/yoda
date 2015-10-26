'use strict';

import React from '../../../../node_modules/react/addons';
import {Navigation} from 'react-router';
import Actions from './../../actions/Actions';
import Remote from 'remote';
import Path from 'path';

const BrowserWindow = Remote.require('browser-window');
const PureRenderMixin = React.addons.PureRenderMixin;
var win = null;
var bIsFirstPlay = true;

export default React.createClass({
  mixins: [PureRenderMixin, Navigation],

  isLiveVideo(item){
    let broadcastContent = item.snippet.liveBroadcastContent;
    return (broadcastContent === 'live' || broadcastContent === 'upcoming');
  },

  handleDownload(item){
    if(Actions.verify(item.id)){
      Actions.prompt(item);
    } else {
      Actions.duplicate(item).then(group => {
        this.transitionTo('downloads', {group: group});
      });
    }
  },

  handleLive(item) {
    let id = item.id;
    Actions.live(id);
  },

  handleVideo(e) {
    e.preventDefault();
    let item = this.props.video;

    if(this.isLiveVideo(item)){
      this.handleLive(item);
    } else {
      this.handleDownload(item);
    }
  },

  handlePlay(e) {
    e.preventDefault();

    if(win == null) {
      win = new BrowserWindow({
        'width': 1080,
        'height': 720,
        'standard-window': false,
        'fullscreen': false,
        'resizable': false,
        'frame': false,
        'show': false
      });

      bIsFirstPlay = true;
    }

    if(bIsFirstPlay) {
      let loc = window.location.pathname;
      let dir = loc.substring(0, loc.lastIndexOf('/'));
      win.loadUrl(Path.normalize('file://' + Path.join(dir, 'player.html')));
      win.webContents.on('did-finish-load', function() {
        win.setTitle('Yoda');
        win.show();
        win.focus();
      });
      win.on('close', () => {
        win = null;
      }, false);
    }

    bIsFirstPlay = false;

    let item = this.props.video;
    if(this.isLiveVideo(item)) {
      this.handleLive(item);
    } else {
      Actions.fetchDownloadURL(item).then(url => {
          console.log(url);
          win.webContents.send('url', url);
        }, err => {
          console.log(err);
        }
      );
    }
  },

  render() {
    return (
      <div className="video-buttons">
        <div className="play" onClick={this.handlePlay}><span>Play</span></div>
        <div className="download" onClick={this.handleVideo}><span>Download</span></div>
      </div>
    );
  }
});
