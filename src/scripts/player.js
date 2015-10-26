'use strict';

import React from 'react';
import PlayerContainer from './components/player/PlayerContainer';

function openPlayer() {
  let mountNode = document.body.children[0];
  React.render(<PlayerContainer/>, mountNode);
}

Promise.all([
  new Promise((resolve) => {
    if (window.addEventListener) {
      window.addEventListener('DOMContentLoaded', resolve);
    } else {
      window.attachEvent('onload', resolve);
    }
  })
]).then(openPlayer);
