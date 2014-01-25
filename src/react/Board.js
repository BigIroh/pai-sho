/** @jsx React.DOM */
var Board = React.createClass({
  render: function() {
		var rows = this.props.data.map(function (row) {
			return <div></div>;
		});
		return (
			<div>
				{rows}
			</div>
		);
  }
});
