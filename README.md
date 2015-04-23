# jsSocials - Simple Social Sharing

[![Build Status](https://travis-ci.org/tabalinas/js-socials.svg?branch=master)](https://travis-ci.org/tabalinas/js-socials)

Project site [js-socials.com](http://js-socials.com/)

**jsSocials** is a simple social sharing jQuery plugin. It's flexible and easily extensible. 
Configure visual appearance. Choose one of several themes provided. Add any yet unsupported social network.


## Demos

Find [Demos](http://js-socials.com/demos/) on project site.


## Getting Started

1. Download the package
2. Add links to `jssocials.css` and chosen theme, e.g. `jssocials-theme-flat.css`
3. Add link to `font-awesome.css` (used for social network logos by default, since you can replace it with image logo or other font if necessary)
4. Add link to `jquery.js` and plugin script `jssocials.min.js`
5. Apply jsSocials plugin to the element on the page `$("#share").jsSocials({ shares: ["twitter"] })`

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" type="text/css" href="font-awesome.css" />
    <link rel="stylesheet" type="text/css" href="jssocials.css" />
    <link rel="stylesheet" type="text/css" href="jssocials-theme-flat.css" />
</head>
<body>
    <div id="share"></div>

    <script src="jquery.js"></script>
    <script src="jssocials.min.js"></script>
    <script>
        $("#share").jsSocials({
            shares: ["twitter", "facebook", "googleplus", "linkedin", "pinterest"]
        });
    </script>
</body>
</html>
```

## Documentation

* [Configuration](#configuration)
* [Methods](#methods)
* [Themes](#themes)
* [Shares](#shares)
* [Custom Share](#custom-share)
* [Adaptiveness](#adaptiveness)


## License

MIT © Artem Tabalin
