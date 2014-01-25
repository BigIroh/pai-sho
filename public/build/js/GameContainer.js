/** @jsx React.DOM */
var GameContainer = React.createClass({displayName: 'GameContainer',
  getInitialState: function() {
    return TicTacToe.game.state;
  },
  componentWillMount: function() {
    function update () {
      window.requestAnimationFrame(update.bind(this));
      if(TicTacToe.game.stateHasChanged) {
        TicTacToe.game.stateHasChanged = false;
        this.setState(TicTacToe.game.state);
      } 
    }
    update.call(this);
  },
  render: function() {
    return (
      React.DOM.div(null, 
        React.DOM.h1(null, "Sexagon: Robots vs Nelf Boobs"),
        Board( {data:this.state.board})
      )
    );
  }
});

React.renderComponent(
  GameContainer(null ),
  document.getElementById('game-container')
);