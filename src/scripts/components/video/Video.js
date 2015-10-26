'use strict';

import React from '../../../../node_modules/react/addons';
import {Navigation} from 'react-router';
import {RenderMixin} from './../../utils/Mixins';
import VideoImage from './VideoImage';
import VideoTitle from './VideoTitle';
import VideoMeta from './VideoMeta';
import VideoDuration from './VideoDuration';
import VideoButtons from './VideoButtons';

const PureRenderMixin = React.addons.PureRenderMixin;

export default React.createClass({
  mixins: [PureRenderMixin, RenderMixin],

  renderDelete() {
    return (
      <div className="video-detail">
        <p>Deleted video</p>
      </div>
    );
  },

  renderVideo(item) {
    return (
      <div className="video-detail">
        <div className="video-image">
          <VideoImage title={item.snippet.title} src={item.snippet.thumbnails.medium.url} />
          <VideoButtons video={item} />
          <VideoDuration duration={item.contentDetails.duration} />
      </div>

        <div className="video-content">
          <VideoTitle title={item.snippet.title} />
          <VideoMeta channel={item.snippet.channelTitle} views={item.statistics.viewCount} published={item.snippet.publishedAt} />
        </div>
      </div>
    );
  },

  render() {
    let video = this.props.video;
    let fragment = this.renderVideo(video);

    return this.renderFragment('video', fragment);
  }
});
