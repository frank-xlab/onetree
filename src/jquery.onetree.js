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
			dataList = [];
		options = $.extend(true, {}, $.onetree.options, options);

		dataList = $.onetree.generateLinkedList(options.data);

		$(element)
			.append($.onetree.generateHtml(dataList),
				options.wrapInnerTemplate,
				options.wrapOutTemplate,
				options.contentTemplate,
				options.bindEvent);

		return $.fn.menutree;
	};

	// Static method.
	$.onetree = function (options) {
		// Override default options with passed-in options.
		options = $.extend({}, $.onetree.options, options);
		// Return something awesome.
		return 'awesome' + options.punctuation;
	};

	// generate linked data
	$.onetree.generateLinkedList = function (data) {

		// convert to dictionary
		function convertToDictionary(data) {
			var result = [],
				i;
			for (i = 0; i < data.length; i++) {
				result[data[i].ID.toString()] = data[i];
			}
			return result;
		}

		// find root node
		function findRootNodes(data) {
			var result = [],
				key,
				dictionary = convertToDictionary(data);
			for (key in dictionary) {
				if (dictionary.hasOwnProperty(key) && dictionary[dictionary[key].PID.toString()] === undefined) {
					result.push(dictionary[key]);
				}
			}
			return result;
		}

		// generate subnode tree
		function generateSubTree(fNode, data) {
			var result = [],
				i;
			for (i = 0; i < data.length; i++) {
				if (data[i].PID === fNode.ID) {
					result.push(generateSubTree(data[i], data));
				}
			}
			return {
				node: fNode,
				subnode: result
			};
		}

		var result = [],
			i,
			rootNode = findRootNodes(data);
		for (i = 0; i < rootNode.length; i++) {
			result.push(generateSubTree(rootNode[i], data));
		}
		return result;
	};

	// generate html for menu tree
	$.onetree.generateHtml = function (linkedList, wrapInnerTemplate, wrapOutTemplate, contentTemplate, bindEvent) {

		// generate html for node
		function generateNodeHtml(node, wrapInnerTemplate, wrapOutTemplate, contentTemplate, bindEvent) {
			var $nodeHtml,
				$nodelistHtml,
				i;
			$nodeHtml = $(wrapInnerTemplate)
				.append(generateContentHtml(node.node, contentTemplate, bindEvent));
			if (node.subnode.length > 0) {
				$nodelistHtml = $(wrapOutTemplate);
				for (i = 0; i < node.subnode.length; i++) {
					$nodelistHtml.append(generateNodeHtml(node.subnode[i], wrapInnerTemplate, wrapOutTemplate, contentTemplate, bindEvent));
				}
				$nodeHtml.append($nodelistHtml);
			}
			return $nodeHtml;
		}

		// generate content html for node
		function generateContentHtml(node, contentTemplate, bindEvent) {
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

		var $html,
			i;
		$html = $(wrapOutTemplate);
		for (i = 0; i < linkedList.length; i++) {
			$html.append(generateNodeHtml(linkedList[i]), wrapInnerTemplate, wrapOutTemplate, contentTemplate, bindEvent);
		}
		return $html;
	};

	// Static method default options.
	$.onetree.options = {
		data: [],
		wrapOutTemplate: '<ul></ul>',
		wrapInnerTemplate: '<li></li>',
		contentTemplate: '',
		bindEvent: null
	};
}));
