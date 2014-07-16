/**
 * @jsx React.DOM
 */
React.initializeTouchEvents(true);

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

var SetIntervalMixin = {
  componentWillMount: function() {
    this.intervals = [];
  },
  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  componentWillUnmount: function() {
    this.intervals.map(clearInterval);
  }
};

// Floaty rectangle
var Draggable = React.createClass({
  getDefaultProps: function () {
    return {
      // allow the initial position to be passed in as a prop
      initialPos: {x: 200, y: 400}
    }
  },
  getInitialState: function () {
    return {
      pos: this.props.initialPos,
      dragging: false,
      rel: null // position relative to the cursor
    }
  },
  componentDidMount: function() {
    this.setInterval(this.tick, 3000);
  },
  // we could get away with not having this (and just having the listeners on
  // our div), but then the experience would be possibly be janky. If there's
  // anything w/ a higher z-index that gets in the way, then you're toast,
  // etc.
  componentDidUpdate: function (props, state) {
    if (this.state.dragging && !state.dragging) {
      document.addEventListener('mousemove', this.onMouseMove)
      document.addEventListener('mouseup', this.onMouseUp)
    } else if (!this.state.dragging && state.dragging) {
      document.removeEventListener('mousemove', this.onMouseMove)
      document.removeEventListener('mouseup', this.onMouseUp)
    }
  },
  handleClick: function(e) {
    e.stopPropagation();
    e.preventDefault();
  },
  // calculate relative position to the mouse and set dragging=true
  onMouseDown: function (e) {
    // only left mouse button
    if (e.button !== 0) return
    var pos = $(this.getDOMNode()).offset()
    this.setState({
      dragging: true,
      rel: {
        x: e.pageX - pos.left,
        y: e.pageY - pos.top
      }
    });
    e.stopPropagation();
    e.preventDefault();
  },
  onMouseUp: function (e) {
    this.setState({dragging: false});
    e.stopPropagation();
    e.preventDefault();
  },
  onMouseMove: function (e) {
    if (!this.state.dragging) return
    this.setState({
      pos: {
        x: e.pageX - this.state.rel.x,
        y: e.pageY - this.state.rel.y
      }
    });
    e.stopPropagation();
    e.preventDefault();
  },
  render: function () {
    // transferPropsTo will merge style & other props passed into our
    // component to also be on the child DIV.
    var style = {
      left: this.state.pos.x + 'px',
      top: this.state.pos.y + 'px'
    };
    return(
    	<div
    		onMouseDown={this.onMouseDown}
    		className="floaty"
    		style={style}
    		onClick={this.handleClick}></div>
		);
  }
});

var Floaty = React.createClass({
  mixins: [SetIntervalMixin],
  getInitialState: function () {
    return {
      style: { left: 200+'px', top: 400+'px' },
      size: { w: $(window).width(), h: $(window).height() },
      className: 'floaty float',
      time: 0,
      vibrating: false
    }
  },
  tick: function() {

    this.setState({ time: this.state.time + 1 });

    if(this.state.time % 6 == 0)
      this.setState({
        style: {
          left: getRandom(this.state.size.w*0.25, this.state.size.w*0.75) + 'px',
          top: getRandom(this.state.size.h*0.25, this.state.size.h*0.75) + 'px'
        }
      });

    if(this.state.time >= 93 && this.state.time <= 212 && !this.state.vibrating)
      this.setState({
        className: 'floaty vibrate',
        vibrating: true
      });
    else if(this.state.time > 212 && this.state.time <= 257 && this.state.vibrating)
      this.setState({
        className: 'floaty pulse',
        vibrating: false
      });
    else if(this.state.time > 257 && this.state.time <= 378 && !this.state.vibrating)
      this.setState({
        className: 'floaty vibrate',
        vibrating: true
      });
    else if(this.state.time > 378 && this.state.vibrating)
      this.setState({
        className: 'floaty pulse',
        vibrating: false
      });
  },
  componentDidMount: function() {
    this.setInterval(this.tick, 1000);
  },
  render: function () {
    return(
      <div
        className={this.state.className}
        style={this.state.style}></div>
    );
  }
});

// Rdio Embed Player
var RdioEmbed = React.createClass({
  render: function () {
    return(
      <iframe width="400" height="36" src="https://rd.io/i/QVggWjfKlhY" frameborder="0" className="rdio"></iframe>
    );
  }
});

// Rdio API Player
var Rdio = React.createClass({
  componentDidMount: function() {
    // this is a valid playback token for localhost.
      // but you should go get your own for your own domain.
    $(this.refs.rdioApi.getDOMNode()).rdio('GAlNi78J_____zlyYWs5ZG02N2pkaHlhcWsyOWJtYjkyN2xvY2FsaG9zdEbwl7EHvbylWSWFWYMZwfc=');
    // Play track when ready
    $(this.refs.rdioApi.getDOMNode()).bind('ready.rdio',
      function() {
        console.log($(this));
        $(this).rdio().play('t9815127');
      });
  },
  render: function () {
    return(
      <div ref="rdioApi"></div>
    );
  }
});

// The Jamie XX React Component
var JamieXX = React.createClass({

  mixins: [SetIntervalMixin],
  getInitialState: function() {
    return {
      albums: ['far-nearer-beat-for', 'girl-sleep-sound', 'all-under-one-roof-raving', 'the-xx', 'radio-head-bloom', 'ill-take-care-of-u', 'were-new-here', 'ny-is-killing-me'],
      jamieClass: 'far-nearer-beat-for album',
    };
  },
  tick: function() {
    this.setState({jamieClass: this.getClass()});
  },
  componentDidMount: function() {
    this.setInterval(this.tick, 10000);
  },
  getClass: function () {
  	return this.state.albums[Math.floor(Math.random() * this.state.albums.length)]  + ' album';
  },
  handleClick: function(e) {
  	if(e.target)
    	this.setState({jamieClass: this.getClass()});
  },
  render: function() {
    return (
    	<div
    		onClick={this.handleClick}
    		className={this.state.jamieClass}>
    			<Floaty/>
          <Rdio/>
          <div className="rdio">
          <div className="title">Far Nearer &mdash; Jamie XX</div><div className="logo"></div>
          </div>
    	</div>
    );
  }
});


React.renderComponent(<JamieXX/>, document.body);