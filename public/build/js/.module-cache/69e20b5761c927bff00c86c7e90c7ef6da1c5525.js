/** @jsx React.DOM */
var GameContainer = React.createClass({
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
      <div>
        <h1>Sexagon: Robots vs Nelf Boobs</h1>
        <Board />
      </div>
    );
  }
});

React.renderComponent(
  GameContainer({}),
  document.getElementById('game-container')
);