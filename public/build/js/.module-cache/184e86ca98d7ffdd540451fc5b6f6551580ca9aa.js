/** @jsx React.DOM */
var Board = React.createClass({displayName: 'Board',
  render: function() {
		var rows = this.props.data.map(function (comment) {
			return Comment( {author:comment.author}, comment.text);
		});
		return (
			React.DOM.div( {className:"commentList"}, 
				commentNodes
			)
		);
  }
});
