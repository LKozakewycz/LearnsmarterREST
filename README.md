# Learnsmarter REST SDK for JavaScript
A REST SDK to simplify integration with Learnsmarter Engage widgets. This SDK can heavily reduce the number of JavaScript lines required to communicate with Learnsmarter Engage widgets and generate HTML. Simply write your HTML with merge fields or tag attributes, tell the SDK your widget URL and command, and the SDK will do the rest for you.

**Please note** that the REST SDK for JavaScript exposes your REST API URL (which is not a security concern, but may not be so practical for some clients). It also does not allow your content to be search engine optimized as your content is loaded post server-side. We recommend that long-term usage should resort to using server-side languages such as Java, PHP or Node.js.

## Pre-requisites
- jQuery
- moment.js (only required for date formatting)

## How to install
- Download either development or minified version of script from `dist/` folder.
- Include JS in your page


## Version History


| Version   | Notes                    |
| --------- | ------------------------ |
| 1.0.1     | Fix for sort order on repeat / top level object access |
| 1.0       | REST SDK Release         |
