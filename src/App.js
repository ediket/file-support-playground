import React, { Component } from 'react';
import Uppy from 'uppy/lib/core';
import { Dashboard } from 'uppy/lib/react';
import GoogleDrive from 'uppy/lib/plugins/GoogleDrive';
import XHRUpload from 'uppy/lib/plugins/XHRUpload';
import Tus from 'uppy/lib/plugins/Tus';
import './App.css';

class App extends Component {
  componentWillMount() {
    this.uppy = new Uppy({
      autoProceed: false,
    })
      .use(Tus, { endpoint: 'https://master.tus.io/files/' })
      .use(GoogleDrive, { host: 'http://localhost:3020' })
      .use(XHRUpload, {
        bundle: false,
        endpoint: 'http://localhost:3020/upload',
        fieldName: 'file',
      })
      .run();
  }

  componentWillUnmount() {
    this.uppy.close();
  }

  render() {
    return (
      <div className="App">
        <h1>React Examples</h1>
        <Dashboard
          uppy={this.uppy}
          plugins={['GoogleDrive', 'XHRUpload']}
        />
      </div>
    );
  }
}

export default App;
