/**
 * @jsx React.DOM
 */
var apiswf = null;
var Rdio = React.createClass({

  getInitialState: function() {
    return {
      flashvars: {
        'playbackToken': 'GAlTxC4J_____2R2cHlzNHd5ZXg3Z2M0OXdoaDY3aHdrbmxvY2FsaG9zdEpMX42vPIM0hnye3f97ll0=',
        'domain': 'localhost',
        'listener': 'callback_object' // the global name of the object that will receive callbacks from the SWF
      },
      params: { 'allowScriptAccess': 'always' },
      attributes: {}
    };
  },

  componentDidMount: function() {
    swfobject.embedSWF('http://www.rdio.com/api/swf/',
      // the location of the Rdio Playback API SWF
      'apiswf', // the ID of the element that will be replaced with the SWF
      1, 1,
      '9.0.0',
      'expressInstall.swf',
      this.state.flashvars,
      this.state.params,
      this.state.attributes);
    // Play song
    apiswf.rdio_play('sr9815127');
  },

  render: function () {
    return(
      <div className="apiswf"></div>
    );
  }
});

// the global callback object
var callback_object = {};

callback_object.ready = function ready(user) {
  // Called once the API SWF has loaded and is ready to accept method calls.
  // find the embed/object element
  apiswf = $('.apiswf').get(0);
}

React.renderComponent(<Rdio/>, document.body);