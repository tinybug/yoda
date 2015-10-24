'use strict';

import React from '../../../../node_modules/react/addons';
import Join from '../../../../node_modules/react/lib/joinClasses';
import {RouteHandler, State} from 'react-router';
import Actions from './../../actions/Actions';
import AppStore from './../../stores/AppStore';
import Titlebar from './../titlebar/Titlebar';
import Sidebar from './../sidebar/Sidebar';

const PureRenderMixin = React.addons.PureRenderMixin;

export default React.createClass({
  mixins: [PureRenderMixin, State],

  getInitialState() {
    return AppStore.getState();
  },

  componentDidMount() {
    Actions.boot();
    AppStore.listen(this.onDownload);
  },

  componentWillUnmount() {
    AppStore.unlisten(this.onDownload);
  },

  onDownload() {
    this.setState(AppStore.getState());
  },

  render() {
    let name = this.getPathname();
    let loadingClass = Join('app');
    if(name == '/'){
      loadingClass = Join(loadingClass, 'app-loading');
    }

    return (
      <div className={loadingClass}>
        <Titlebar />
        <div className="content">
          <Sidebar status={this.state.status} count={this.state.count} />
          <RouteHandler key={name}
              loading={this.state.loading}
              more={this.state.more} />
        </div>
      </div>
    );
  }
});
