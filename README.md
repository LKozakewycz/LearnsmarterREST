# Learnsmarter REST SDK for JavaScript
A REST SDK to simplify integration with Learnsmarter Engage widgets. This SDK can heavily reduce the number of JavaScript lines required to communicate with Learnsmarter Engage widgets and generate HTML. Simply write your HTML with merge fields or tag attributes, tell the SDK your widget URL and command, and the SDK will do the rest for you.

**Please note** that the REST SDK for JavaScript exposes your REST API URL (which is not a security concern, but may not be so practical for some clients). It also does not allow your content to be search engine optimized as your content is loaded post server-side. We recommend that long-term usage should resort to using server-side languages such as Java, PHP or Node.js.

## Dependencies
- jQuery
- moment.js (only required for date formatting)

## How to install
- Download either development or minified version of script from `dist/` folder.
- Include JS in your page

## Configuring

Using the setup guide, create `Course REST` widget that will include the course and scheduled course fields you want to retrieve.

On your HTML web page, add the following to the bottom of your body tag and adjust the JavaScript accordingly to include your widget URL and path to SDK file.

```html
<script type="text/javascript" src="js/learnsmarter.rest.js"></script>
<script>
$(function(){
    $(document).LearnsmarterREST({
        url : 'https://SUBDOMAIN.INSTANCE.force.com/public/services/apexrest/lsi/widget/WIDGET_NAME'
    });
});
</script>
```

## Retrieving courses

To retrieve a list of courses, add the following JavaScript code:

```javascript
$(document).LearnsmarterREST('getCourses');
```

Write a snippet of HTML code for which you want to repeat for each course record and add the attribute `ls-repeat` with a value of `courses` and hide the tag you are repeating.

```html
<table>
	<tr ls-repeat="courses" style="display:none;">
		<td>{!Name}</td>
		<td>{!lsc__Cost__c}</td>
	</tr>
</table>
```

The SDK will locate this tag, repeat it for each record and parse the variables automatically. It will then destroy the original tag. The above snippet will give you a list of courses in a table with the costs.


## Version History


| Version   | Notes                    |
| --------- | ------------------------ |
| 1.0.1     | Fix for sort order on repeat / top level object access |
| 1.0       | REST SDK Release         |
