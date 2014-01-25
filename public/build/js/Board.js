/** @jsx React.DOM */
var Board = React.createClass({displayName: 'Board',
	render: function() {
		console.log(this.props);
		var rows = this.props.data.map(function (row, i) {
			return (
				Row( {data:row, key:i} )
			);
		})

		return React.DOM.div(null, rows);
	}
});

var Row = React.createClass({displayName: 'Row',
	render: function () {
		var cells = this.props.data.map(function (cell, i	) {
			return (
				Cell( {data:cell, key:i} )
			);
		})
		return React.DOM.div(null, cells)
	}
});

var Cell = React.createClass({displayName: 'Cell',
	render: function() {
		return (
			React.DOM.span(null, this.props.data)
		);
	}
});
