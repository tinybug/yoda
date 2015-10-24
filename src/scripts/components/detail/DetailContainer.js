'use strict';

import React from '../../../../node_modules/react/addons';
import {RouteHandler} from 'react-router';

const PureRenderMixin = React.addons.PureRenderMixin;

export default React.createClass({
  mixins: [PureRenderMixin],

  render() {
    var name = this.props.params.channel;
    return (
      <div className="detail">
        <div className="detail-container">
          <div className="detail-content">
            <RouteHandler key={name}
              loading={this.props.loading}
              more={this.props.more} />
          </div>
        </div>
      </div>
    );
  }
});