/** @jsx React.DOM */
var GameContainer = React.createClass({displayName: 'GameContainer',
  getInitialState: function() {
    return TicTacToe.game.state;
  },
  componentWillMount: function() {
    function update () {
      window.requestAnimationFrame(update);
      if(TicTacToe.game.state.hasChanged) {
        TicTacToe.game.state.hasChanged = false;
        this.setState(TicTacToe.game.state);
      } 
    }
  },
  render: function() {
    return (
      React.DOM.div(null, 
        React.DOM.h1(null, "Sexagon: Robots vs Nelf Boobs"),
        Board(null )
      )
    );
  }
});