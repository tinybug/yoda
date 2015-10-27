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
        'auto-hide-menu-bar': true,
        'use-content-size': true,
      });

      win.openDevTools();
      bIsFirstPlay = true;
    }

    if(bIsFirstPlay) {
      let loc = window.location.pathname;
      let dir = loc.substring(0, loc.lastIndexOf('/'));
      win.setTitle('Yoda');
      win.loadUrl(Path.normalize('file://' + Path.join(dir, 'player.html')));
      win.webContents.on('did-finish-load', function() {
        win.show();
        win.focus();
      });
      win.on('close', () => {
        win = null;
      }, false);
    } else {
      win.webContents.send('play-video');
    }

    bIsFirstPlay = false;

    let item = this.props.video;
    if(this.isLiveVideo(item)) {
      this.handleLive(item);
    } else {
      Actions.fetchWatchInfo(item).then(info => {
          console.log(info);
          win.webContents.send('info', info);
          win.setTitle(info.title + ' - Yoda');
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
