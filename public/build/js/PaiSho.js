/** @jsx React.DOM */
var ReactTransitionGroup = React.addons.TransitionGroup;
var Page = React.createClass({displayName: 'Page',
  getInitialState: function() {
    var main = Main( {out:this.transitionToLogin, key:"main"})
    var login = Login( {out:this.transitionToMain, key:"login"})
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
      React.DOM.div(null, 
        ReactTransitionGroup( {transitionName:"page"}, 
          this.state.pages
        )
      )
    );
  }
});

var Login = React.createClass({displayName: 'Login',
  render: function () {
    return (
      React.DOM.div( {className:"page"}, 
        React.DOM.div( {className:"bubble"}, 
          React.DOM.h1(null, "Log in or create a new account"),
          React.DOM.form( {onSubmit:this.props.out}, 
            React.DOM.div(null, 
              React.DOM.label(null, "Email:"),
              React.DOM.input( {type:"text"})
            ),
            React.DOM.div(null, 
              React.DOM.label(null, "Password:"),
              React.DOM.input( {type:"password"})
            ),
            React.DOM.input( {type:"submit"})
          )
        )
      )
    );
  }
})

var Main = React.createClass({displayName: 'Main',
  render: function () {
    return (
      React.DOM.div( {className:"page"}, 
        React.DOM.div( {className:"bubble"}, 
          " Main... "
        )
      )
    );
  }
})


React.renderComponent(
  Page(null),
  document.getElementsByTagName('body')[0]
);