'use strict';

import React from '../../../../node_modules/react/addons';
import Join from '../../../../node_modules/react/lib/joinClasses';
import {State} from 'react-router';
import Actions from './../../actions/Actions';
import PlaylistStore from './../../stores/PlaylistStore';
import {RenderMixin} from './../../utils/Mixins';
import Playlist from './Playlist';
import Paginator from './../common/Paginator';

const PureRenderMixin = React.addons.PureRenderMixin;

export default React.createClass({
  mixins: [PureRenderMixin, RenderMixin, State],

  getInitialState() {
    return PlaylistStore.getState();
  },

  componentDidMount() {
    PlaylistStore.listen(this._change);
    Actions.fetchPlaylist(this.getParams().playlist);
  },

  componentWillUnmount() {
    PlaylistStore.unlisten(this._change);
  },

  handleLoadMore(playlist) {
    let id = playlist[0].get('id');
    let next = playlist !== undefined ? playlist[0].get('next') : '';
    Actions.paginatePlaylistVideos(id, next);
  },

  _change() {
    this.setState(PlaylistStore.getState());
  },

  renderPlaylist(playlist) {
    return (
      <div className="playlist">
        <Playlist playlist={playlist} />
        <Paginator loading={this.props.more} handler={this.handleLoadMore.bind(null, playlist)} />
      </div>
    );
  },

  render() {
    let fragment;
    let page = Join('playlist-container');
    if(this.props.loading){
      fragment = this.renderLoader({message: 'Loading playlist videos...'});
    } else {
      fragment = this.renderPlaylist(this.state.playlistVideos.toArray());
    }

    return this.renderFragment(page, fragment);
  }
});