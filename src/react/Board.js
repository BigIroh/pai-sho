/** @jsx React.DOM */
var Board = React.createClass({
	render: function() {
		console.log(this.props);
		var rows = this.props.data.map(function (row, i) {
			return (
				<Row data={row} key={i} />
			);
		})

		return <div>{rows}</div>;
	}
});

var Row = React.createClass({
	render: function () {
		var cells = this.props.data.map(function (cell, i	) {
			return (
				<Cell data={cell} key={i} />
			);
		})
		return <div>{cells}</div>
	}
});

var Cell = React.createClass({
	render: function() {
		return (
			<span>{this.props.data}</span>
		);
	}
});
