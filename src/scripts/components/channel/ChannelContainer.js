'use strict';

import React from '../../../../node_modules/react/addons';
import Join from '../../../../node_modules/react/lib/joinClasses';
import Actions from './../../actions/Actions';
import ChannelStore from './../../stores/ChannelStore';
import {RenderMixin} from './../../utils/Mixins';
import Channel from './Channel';

const PureRenderMixin = React.addons.PureRenderMixin;

export default React.createClass({
  mixins: [PureRenderMixin, RenderMixin],

  getInitialState(){
    return ChannelStore.getState();
  },

  componentDidMount() {
    ChannelStore.listen(this.onChange);
    Actions.fetchChannelPlaylists(this.props.params.channel);
  },

  componentWillUnmount() {
    ChannelStore.unlisten(this.onChange);
  },

  onChange() {
    this.setState(ChannelStore.getState());
  },

  renderChannel(title, playlists, current) {
    return (
        <Channel current={this.props.current} playlists={playlists} name={title} />
    );
  },

  render() {
    var fragment;
    var title = this.props.params.channel;
    var page = Join('channel', title);

    if(this.props.loading){
      fragment = this.renderLoader({message: 'Loading channel playlists...'});
    } else {
      fragment = this.renderChannel(title, this.state.playlists.toArray());
    }

    return this.renderFragment(page, fragment);
  }
});
