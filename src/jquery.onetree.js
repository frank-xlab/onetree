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
	$.fn.menutree = function (setting) {
		var element = this,
			cSetting = {},
			dataList = [],
			defaultSetting = {
				data: [],
				wrapOutTemplate: '<ul></ul>',
				wrapInnerTemplate: '<li></li>',
				contentTemplate: '',
				bindEvent: null
			};
		$.extend(true, cSetting, defaultSetting, setting);

		dataList = generateLinkedList(cSetting.data);

		$(element)
			.append(generateHtml(dataList),
				cSetting.wrapInnerTemplate,
				cSetting.wrapOutTemplate,
				cSetting.contentTemplate,
				cSetting.bindEvent);

		// convert to a dictionary
		function convertToDictionary(data) {
			var result = [],
				i;
			for (i = 0; i < data.length; i++) {
				result[data[i].ID.toString()] = data[i];
			}
			return result;
		}

		// generate linked list
		function generateLinkedList(data) {
			var result = [],
				i,
				rootNode = findRootNodes(data);
			for (i = 0; i < rootNode.length; i++) {
				result.push(generateSubTree(rootNode[i], data));
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

		// generate html for menu tree
		function generateHtml(linkedList, wrapInnerTemplate, wrapOutTemplate, contentTemplate, bindEvent) {
			var $html,
				i;
			$html = $(wrapOutTemplate);
			for (i = 0; i < linkedList.length; i++) {
				$html.append(generateNodeHtml(linkedList[i]), wrapInnerTemplate, wrapOutTemplate, contentTemplate, bindEvent);
			}
			return $html;
		}

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
		return $.fn.menutree;
	};
	// Static method.
	$.onetree = function (options) {
		// Override default options with passed-in options.
		options = $.extend({}, $.onetree.options, options);
		// Return something awesome.
		return 'awesome' + options.punctuation;
	};

	// Static method default options.
	$.onetree.options = {
		punctuation: '.'
	};

	// Custom selector.
	$.expr[':'].onetree = function (elem) {
		// Is this element awesome?
		return $(elem)
			.text()
			.indexOf('awesome') !== -1;
	};
}));
