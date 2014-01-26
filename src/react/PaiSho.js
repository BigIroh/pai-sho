/** @jsx React.DOM */
var ReactTransitionGroup = React.addons.TransitionGroup;
var Page = React.createClass({
  getInitialState: function() {
    var main = <Main out={this.transitionToLogin} key="main"/>
    var login = <Login out={this.transitionToMain} key="login"/>
    return {
      pages: [login],
      login: login,
      main: main
    }
  },
  transitionToLogin: function (e) {
    e.preventDefault();
    this.setState({pages: [this.state.login]})
  },
  transitionToMain: function (e) {
    e.preventDefault();
    this.setState({pages: [this.state.main]})
  },
  render: function() {
    return (
      <div>
        <ReactTransitionGroup transitionName="page">
          {this.state.pages}
        </ReactTransitionGroup>
      </div>
    );
  }
});

var Login = React.createClass({
  render: function () {
    return (
      <div className="page">
        <div className="bubble">
          <h1>Log in or create a new account</h1>
          <form onSubmit={this.props.out}>
            <div>
              <label>Email:</label>
              <input type="text"/>
            </div>
            <div>
              <label>Password:</label>
              <input type="password"/>
            </div>
            <input type="submit"/>
          </form>
        </div>
      </div>
    );
  }
})

var Main = React.createClass({
  render: function () {
    return (
      <div className="page">
        <div className="bubble">
          Main...
        </div>
      </div>
    );
  }
})


React.renderComponent(
  <Page/>,
  document.getElementsByTagName('body')[0]
);