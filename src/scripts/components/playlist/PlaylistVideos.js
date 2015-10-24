'use strict';

import React from '../../../../node_modules/react/addons';
import Video from './../video/Video';

const PureRenderMixin = React.addons.PureRenderMixin;

export default React.createClass({
  propTypes: {
    videos: React.PropTypes.array.isRequired
  },

  mixins: [PureRenderMixin],

  renderVideos(video) {
    return (
      <Video key={Math.random()} video={video} />
    );
  },

  render() {
    let nodes = this.props.videos.map(this.renderVideos);
    return (
      <div className="playlist-videos">
        {nodes}
      </div>
    );
  }
});
