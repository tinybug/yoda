'use strict';

import React from 'react';
import {Route, DefaultRoute} from 'react-router';
import App from './components/app/AppContainer';
import Setup from './components/setup/SetupContainer';
import Search from './components/search/SearchContainer';
import Detail from './components/detail/DetailContainer';
import Channel from './components/channel/ChannelContainer';
import Playlist from './components/playlist/PlaylistContainer';
import Downloads from './components/downloads/DownloadsContainer';

const AppRoutes = (
  <Route name="app" path="/" handler={App}>
    <Route ignoreScrollBehavior={true} name="detail" handler={Detail}>
      <Route name="channels" path="/channels/:channel" handler={Channel} />
      <Route name="playlist" path="/playlist/:playlist" handler={Playlist} />
      <Route name="search" path="/search/:query" handler={Search} />
      <Route name="downloads" path="/downloads/:group" handler={Downloads} />
    </Route>
    <DefaultRoute name="setup" handler={Setup} />
  </Route>
);

export default AppRoutes;

