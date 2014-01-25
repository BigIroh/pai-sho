/** @jsx React.DOM */
var GameContainer = React.createClass({
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
      <div>
        <h1>Sexagon: Robots vs Nelf Boobs</h1>
        <Board data={this.state.board}/>
      </div>
    );
  }
});

React.renderComponent(
  <GameContainer />,
  document.getElementById('game-container')
);