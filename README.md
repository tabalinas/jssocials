# jsSocials - Simple Social Sharing

[![Build Status](https://travis-ci.org/tabalinas/js-socials.svg?branch=master)](https://travis-ci.org/tabalinas/js-socials)

Project site [js-socials.com](http://js-socials.com/)

**jsSocials** is a simple social network sharing jQuery plugin. It's flexible and easily extensible. 
Configure visual appearance. Choose one of several themes provided. Add any yet unsupported social network if needed.


## Demos

Find demos on the [project site](http://js-socials.com/demos/).


## Getting Started

1. Download the package
2. Add links to `jssocials.css` and chosen theme, e.g. `jssocials-theme-flat.css`
3. Add link to `font-awesome.css` (used for social network logos by default, since you can replace it with image logo or other font if necessary)
4. Add link to `jquery.js` and plugin script `jssocials.min.js`
5. Apply jsSocials to the element on the page `$("#share").jsSocials({ shares: ["twitter"] })`

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


### Configuration

The config object may contain following options:
 
```javascript
{
    shares: ["twitter", "facebook", "googleplus", "linkedin", "pinterest"],
    url: "http://url.to.share",
    text: "text to share",
    showLabel: true,
    showCount: true
}
```

#### shares

An array of shares. 

Each share can be

* string - name of share from regustry `jsSocials.shares` (e.g. `"twitter"`)
* config - plain object with `share` as name and custom parameters specific for each share. Read more about share config in [Shares section](#shares).

For instance for twitter the config may look like:

```javascript
{
    share: "twitter",           // name of share
    label: "Tweet",             // share button text (optional)
    via: "artem_tabalin",       // custom twitter sharing param 'via' (optional)
    hashtags: "jquery,plugin"   // custom twitter sharing param 'hashtags' (optional)
}
```

#### url

A string specifying url to share. **window.location.href** used by default.

#### text

A string specifying text to share. The content of **&lt;meta name="description"&gt;** or **&lt;title&gt;** used by default.

#### showLabel

A boolean specifying whether to show the text on the share button.

#### showCount

A boolean or "inside" specifying whether and how to show share count. 


## License

MIT © Artem Tabalin
