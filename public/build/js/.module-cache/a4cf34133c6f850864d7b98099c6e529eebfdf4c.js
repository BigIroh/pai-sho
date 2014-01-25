/** @jsx React.DOM */
var Board = React.createClass({displayName: 'Board',
  render: function() {
		var rows = this.props.data.map(function (row) {
			return React.DOM.div(null);
		});
		return (
			React.DOM.div(null, 
				rows
			)
		);
  }
});
