"use strict";

var chart = dc.barChart( "body" );

d3.csv( "morley.csv", function ( error, experiments ) {
	experiments.forEach( function ( x ) {
		x.Speed = +x.Speed;
	} );

	var ndx = crossfilter( experiments ),
		runDimension = ndx.dimension( function ( d ) {
			return +d.Run;
		} ),
		speedSumGroup = runDimension.group().reduce( function ( p, v ) {
			p[ v.Expt ] = ( p[ v.Expt ] || 0 ) + v.Speed;
			return p;
		}, function ( p, v ) {
			p[ v.Expt ] = ( p[ v.Expt ] || 0 ) - v.Speed;
			return p;
		}, function () {
			return {};
		} );

	function sel_stack( i ) {
		return function ( d ) {
			return d.value[ i ];
		};
	}

	chart
		.width( 768 )
		.height( 480 )
		.x( d3.scale.linear().domain( [ 1, 21 ] ) )
		.margins( {
			left: 50,
			top: 10,
			right: 10,
			bottom: 20
		} )
		.brushOn( false )
		.clipPadding( 10 )
		.title( function ( d ) {
			return d.key + '[' + this.layer + ']: ' + d.value[ this.layer ];
		} )
		.yAxisLabel( "This is the Y Axis!" )
		.dimension( runDimension )
		.group( speedSumGroup, "1", sel_stack( '1' ) )
		.renderLabel( true );

	for ( var i = 2; i < 6; ++i )
		chart.stack( speedSumGroup, '' + i, sel_stack( i ) );

	chart.render();
} );
