'use strict';

// @flow

import React, { Component } from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';
import SharedStyles from 'src/SharedStyles';

type Props = { };
type State = { };

export default class DownloadMM extends Component<Props, State> {
  render() {
    return (
      <div style={SharedStyles.container}>
        <Header />
        <p>This website requires the metamask browser extension. Visit the link below to install and then return to this page.</p>
        <a href="https://metamask.io/" target="_blank">
          <img src="/download-metamask.png" width="400" height="121" />
        </a>
        <Footer />
      </div>
    );
  }
}

const styles = {
};
