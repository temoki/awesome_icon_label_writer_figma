# Awesome Icon Label Writer for Figma

This Figma plugin renames text nodes consisting of one Font Awesome icon to the icon name.

![](assets/screen-recording.gif)

Text nodes will be renamed as 
`[FA{version}-{style}] {icon name} / {unicode}`.

The followings are examples.

- `[FA5-Regular] lemon / f094`
- `[FA6-Solid] credit-card / f09d`

You run the plugin, all the icons on the current page will be renamed.
If you select some nodes and then run the plug-in, the icons in the selected node and its descendants will be renamed.

Supported Font Awesome versions are 5 and 6.
