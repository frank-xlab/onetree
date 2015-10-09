/*
 * onetree
 * https://github.com/xuejp/onetree
 *
 * Copyright (c) 2015 xuejp
 * Licensed under the APL license.
 */

( function ( factory ) {
	if ( typeof define === 'function' && define.amd ) {
		define( 'onetree', [ 'jquery' ], factory );
	} else {
		factory( jQuery );
	}
}( function ( $ ) {
	'use strict';

	$.fn.extend( {
		onetree: function ( options ) {
			var element = this,
				dataList = [];
			options = $.extend( true, {}, $.onetree.options, options );
			dataList = $.onetree.generateLinkedList( options.data, function ( result ) {
				result.sort( options.sortCallback );
			} );
			if ( options.root.append ) {
				dataList = [ {
					node: options.root.node,
					subnode: dataList
				} ];
			}
			$( element )
				.empty()
				.append( $.onetree.generateHtml( dataList,
					options.wrapOutTag,
					options.wrapInnerTag,
					options.contentTemplate,
					options.callback ) );

			return $.fn.menutree;
		}
	} );

	$.extend( {
		onetree: {
			options: {
				data: [],
				root: {
					append: false,
					node: {
						ID: 0,
						PID: -1
					}
				},
				sortCallback: null,
				wrapOutTag: 'ul',
				wrapInnerTag: 'li',
				contentTemplate: '',
				callback: null
			},
			generateLinkedList: function ( data, callback ) {
				var result = [],
					i,
					rootNode = this.findRootNodes( data );
				for ( i = 0; i < rootNode.length; i++ ) {
					result.push( this._generateSubTree( rootNode[ i ], data, callback ) );
				}
				if ( 'function' === typeof callback ) {
					callback( result );
				}
				return result;
			},
			convertToDictionary: function ( data ) {
				var result = [],
					i;
				for ( i = 0; i < data.length; i++ ) {
					result[ data[ i ].ID.toString() ] = data[ i ];
				}
				return result;
			},
			findRootNodes: function ( data ) {
				var result = [],
					key,
					dictionary = this.convertToDictionary( data );
				for ( key in dictionary ) {
					if ( dictionary.hasOwnProperty( key ) && dictionary[ dictionary[ key ].PID.toString() ] === undefined ) {
						result.push( dictionary[ key ] );
					}
				}
				return result;
			},
			_generateSubTree: function ( fNode, data, callback ) {
				var result = [],
					i;
				for ( i = 0; i < data.length; i++ ) {
					if ( data[ i ].PID === fNode.ID ) {
						result.push( this._generateSubTree( data[ i ], data ) );
					}
				}
				if ( 'function' === typeof callback ) {
					callback( result );
				}
				return {
					node: fNode,
					subnode: result
				};
			},
			generateHtml: function ( linkedList, wrapOutTag, wrapInnerTag, contentTemplate, callback ) {
				var $html,
					i;
				$html = $( document.createElement( wrapOutTag ) );
				for ( i = 0; i < linkedList.length; i++ ) {
					$html.append( this._generateNodeHtml( linkedList[ i ], wrapOutTag, wrapInnerTag, contentTemplate, callback ) );
				}
				return $html;
			},
			_generateNodeHtml: function ( node, wrapOutTag, wrapInnerTag, contentTemplate, callback ) {
				var $nodeHtml,
					$nodelistHtml,
					i;
				$nodeHtml = $( document.createElement( wrapInnerTag ) )
					.append( this._generateContentHtml( node.node, contentTemplate, callback ) );
				if ( callback !== null ) {
					callback( $nodeHtml, node.node );
				}
				if ( node.subnode.length > 0 ) {
					$nodelistHtml = $( document.createElement( wrapOutTag ) );
					for ( i = 0; i < node.subnode.length; i++ ) {
						$nodelistHtml.append( this._generateNodeHtml( node.subnode[ i ], wrapOutTag, wrapInnerTag, contentTemplate, callback ) );
					}
					$nodeHtml.append( $nodelistHtml );
				}
				return $nodeHtml;
			},
			_generateContentHtml: function ( node, contentTemplate ) {
				var strHtml = contentTemplate,
					key;
				for ( key in node ) {
					if ( node.hasOwnProperty( key ) ) {
						strHtml = strHtml.replace( new RegExp( '\\{' + key + '\\}', 'gi' ), node[ key ] );
					}
				}
				return $( strHtml );
			},
			traverseParent: function ( node, callback ) {
				var parentNode = node.parent()
					.parent( this.options.wrapInnerTag );
				if ( parentNode.html() === undefined ) {
					return;
				}
				callback.apply( parentNode );
				this.traverseParent( parentNode, callback );
			},
			traverseChildren: function ( node, callback ) {
				var childNodes = $( node )
					.children( this.options.wrapOutTag )
					.children(),
					i;
				if ( childNodes.html() === undefined ) {
					return;
				}
				for ( i = 0; i < childNodes.length; i++ ) {
					callback.apply( childNodes[ i ] );
					this.traverseChildren( childNodes[ i ], callback );
				}
			},
			traverseBrother: function ( node, callback ) {
				var brotherNodes = $( node )
					.parent()
					.children( this.options.wrapInnerTag ),
					i;
				for ( i = 0; i < brotherNodes.length; i++ ) {
					if ( brotherNodes[ i ] === node ) {
						continue;
					}
					callback.apply( brotherNodes[ i ] );
				}
			}
		}
	} );
} ) );
