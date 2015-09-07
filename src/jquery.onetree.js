/*
 * onetree
 * https://github.com/xuejp/onetree
 *
 * Copyright (c) 2015 xuejp
 * Licensed under the APL license.
 */

(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(["jquery"], factory);
	} else {
		factory(jQuery);
	}
}(function ($) {
	'use strict';

	$.fn.onetree = function (options) {
		var element = this,
			_instance = new $.onetree(),
			dataList = [];
		options = $.extend(true, {}, $.onetree.options, options);

		dataList = _instance.generateLinkedList(options.data);
		
		$(element)
			.append(_instance.generateHtml(dataList,
				options.wrapInnerTemplate,
				options.wrapOutTemplate,
				options.contentTemplate,
				options.bindEvent));

		return $.fn.menutree;
	};

	$.onetree = function () {};

	$.onetree.prototype = {
		generateLinkedList: function (data) {
			var result = [],
				i,
				rootNode = this.findRootNodes(data);
			for (i = 0; i < rootNode.length; i++) {
				result.push(this._generateSubTree(rootNode[i], data));
			}
			return result;
		},
		convertToDictionary: function (data) {
			var result = [],
				i;
			for (i = 0; i < data.length; i++) {
				result[data[i].ID.toString()] = data[i];
			}
			return result;
		},
		findRootNodes: function (data) {
			var result = [],
				key,
				dictionary = this.convertToDictionary(data);
			for (key in dictionary) {
				if (dictionary.hasOwnProperty(key) && dictionary[dictionary[key].PID.toString()] === undefined) {
					result.push(dictionary[key]);
				}
			}
			return result;
		},
		_generateSubTree: function (fNode, data) {
			var result = [],
				i;
			for (i = 0; i < data.length; i++) {
				if (data[i].PID === fNode.ID) {
					result.push(this._generateSubTree(data[i], data));
				}
			}
			return {
				node: fNode,
				subnode: result
			};
		},
		generateHtml: function (linkedList, wrapInnerTemplate, wrapOutTemplate, contentTemplate, bindEvent) {
			var $html,
				i;
			$html = $(wrapOutTemplate);
			for (i = 0; i < linkedList.length; i++) {
				$html.append(this._generateNodeHtml(linkedList[i], wrapInnerTemplate, wrapOutTemplate, contentTemplate, bindEvent));
			}
			return $html;
		},
		_generateNodeHtml: function (node, wrapInnerTemplate, wrapOutTemplate, contentTemplate, bindEvent) {
			var $nodeHtml,
				$nodelistHtml,
				i;
			$nodeHtml = $(wrapInnerTemplate)
				.append(this._generateContentHtml(node.node, contentTemplate, bindEvent));
			if (node.subnode.length > 0) {
				$nodelistHtml = $(wrapOutTemplate);
				for (i = 0; i < node.subnode.length; i++) {
					$nodelistHtml.append(this._generateNodeHtml(node.subnode[i], wrapInnerTemplate, wrapOutTemplate, contentTemplate, bindEvent));
				}
				$nodeHtml.append($nodelistHtml);
			}
			return $nodeHtml;
		},
		_generateContentHtml: function (node, contentTemplate, bindEvent) {
			var strHtml = contentTemplate,
				$node,
				key;
			for (key in node) {
				if (node.hasOwnProperty(key)) {
					strHtml = strHtml.replace(new RegExp('\\{' + key + '\\}', 'gi'), node[key]);
				}
			}
			$node = $(strHtml);
			if (bindEvent !== null) {
				bindEvent($node, node);
			}
			return $node;
		}
	};

	$.onetree.options = {
		data: [],
		wrapOutTemplate: '<ul></ul>',
		wrapInnerTemplate: '<li></li>',
		contentTemplate: '',
		bindEvent: null
	};
}));
