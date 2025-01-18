# Awesome Icon Label Writer for Figma

This Figma plugin renames text nodes containing a single Font Awesome icon to the icon's name.

![](assets/screen-recording.gif)

Text nodes will be renamed as 
`[FA{version}-{style}] {icon name} / {unicode}`.

Here are some examples:

- `[FA5-Regular] lemon / f094`
- `[FA6-Solid] credit-card / f09d`

When you run the plugin, all icons on the current page will be renamed.
If you select some nodes and then run the plugin, the icons in the selected nodes and their descendants will be renamed.

Supported Font Awesome versions are 5 and 6.
