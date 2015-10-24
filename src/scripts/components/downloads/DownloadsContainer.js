'use strict';

import React from '../../../../node_modules/react/addons';
import Join from '../../../../node_modules/react/lib/joinClasses';
import {RouteHandler} from 'react-router';
import Actions from './../../actions/Actions';
import DownloadsStore from './../../stores/DownloadsStore';
import {RenderMixin} from './../../utils/Mixins';
import Downloads from './Downloads';

const PureRenderMixin = React.addons.PureRenderMixin;

export default React.createClass({
  mixins: [PureRenderMixin, RenderMixin],

  getInitialState() {
    return DownloadsStore.getState();
  },

  componentDidMount() {
    DownloadsStore.listen(this.onProgress);
  },

  componentWillUnmount() {
    DownloadsStore.unlisten(this.onProgress);
  },

  onProgress() {
    this.setState(DownloadsStore.getState());
  },

  renderDownloads(group, downloads) {
    return (<Downloads title="Downloads" group={group} downloads={downloads} />);
  },

  render() {
    let fragment, downloads;
    let page = Join('downloads-container');
    let group = this.props.params.group;
    if(group === 'active'){
      downloads = this.state.downloads.filter(item => {
        return item.get('done') === false;
      });
      fragment = this.renderDownloads(group, downloads.toArray());
    } else {
      downloads = this.state.downloads.filter(item => {
        return item.get('done') === true;
      });
      fragment = this.renderDownloads(group, downloads.toArray());
    }

    return this.renderFragment(page, fragment);
  }
});