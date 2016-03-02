# Onetree

Automatic generating tree

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/xuejp/onetree/master/dist/onetree.min.js
[max]: https://raw.github.com/xuejp/onetree/master/dist/onetree.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/onetree.min.js"></script>
<script>
      require.config({
        baseUrl: '../src',
        paths: {
          'jquery': '../external/jquery/dist/jquery',
          'onetree': '../src/jquery.onetree'
        }
      });
      require(['onetree'], function() {
        $('#onetree').onetree({
          data: [{
            ID: 1,
            PID: 0,
            Value: {}
          }],
          callback: function(nodes, node) {
            $(nodes).click(function() {
              $.onetree.traverseParent($(nodes), function() {
                $(this).children().first().prop('checked', false);
              });
            });
          },
          contentTemplate: '<span>ssssss</span>',
          root: {
            append: true
          }
        });
      });
</script>
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Release History
_(Nothing yet)_
