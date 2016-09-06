# Learnsmarter REST SDK for JavaScript
A REST SDK to simplify integration with Learnsmarter Engage widgets. This SDK can heavily reduce the number of JavaScript lines required to communicate with Learnsmarter Engage widgets and generate HTML. Simply write your HTML with merge fields or tag attributes, tell the SDK your widget URL and command, and the SDK will do the rest for you.

**Please note** that the REST SDK for JavaScript exposes your REST API URL (which is not a security concern, but may not be so practical for some clients). It also does not allow your content to be search engine optimized as your content is loaded post server-side. We recommend that long-term usage should resort to using server-side languages such as Java, PHP or Node.js.

## Table of Contents
* [Dependencies](#dependencies)
* [How to install](#how-to-install)
* [Configuring](#configuring)
* [Retrieving courses](#retrieving-courses)
* [Retrieving scheduled courses](#retrieving-scheduled-courses)
* [Basic field references](#basic-field-references)
* [Attribute field references](#attribute-field-references)
* [Version History](#version-history)

<a name="dependencies"/>
## Dependencies
- jQuery
- moment.js (only required for date formatting)

<a name="how-to-install"/>
## How to install
- Download either development or minified version of script from `dist/` folder.
- Include JS in your page

<a name="configuring" />
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

<a name="retrieving-courses" />
## Retrieving courses

To retrieve a list of courses, add the following JavaScript code. A second optional paramater can be used to specify options.

```javascript
// Get all courses
$(document).LearnsmarterREST('getCourses');

// Get courses from specified subject area
$(document).LearnsmarterREST('getCourses', {
	'courseAreaId' : 'COURSE_AREA_ID'
});
```

Here is a list of options you can use.

| Option Key | Type | Required | Description 			|
| ---------- | ---- | -------- | ---------------------- |
| courseAreaId | Id   | No	   | Parent subject area id |
| beforeRender | Function | No | Function to execute before auto render |
| callback | Function | No | Callback function to invoke after auto render or if auto render disabled |
| autoRender | Boolean | No | Defaults to true. Will auto render HTML |

Write a snippet of HTML code for which you want to repeat for each course record and add the attribute `ls-repeat` with a value of `courses` and hide the tag you are repeating.

```html
<table>
	<tr ls-repeat="courses" style="display:none;">
		<td>{!Name}</td>
		<td>{!lsc__Cost__c}</td>
	</tr>
</table>
```


<a name="retrieving-scheduled-courses" />
## Retrieving scheduled courses

To retrieve a list of scheduled courses within a course, add the following JavaScript code. Adjust how you identify the course ID and specify it in the options parameter.

```javascript
// Get courses from specified course id
$(document).LearnsmarterREST('getEvents', {
	'courseId' : 'COURSE_ID'
});
```

Here is a list of options you can use.

| Option Key | Type | Required  | Description 		 |
| ---------- | ---- | --------- | ------------------ |
| courseId   | Id   | Yes 		| Parent course ID 	 | 
| beforeRender | Function | No | Function to execute before auto render |
| callback | Function | No | Callback function to invoke after auto render or if auto render disabled |
| autoRender | Boolean | No | Defaults to true. Will auto render HTML |

Write a snippet of HTML code for which you want to repeat for each scheduled course record and add the attribute `ls-repeat` with a value of `events` and hide the tag you are repeating.

```html
<table>
	<tr ls-repeat="events" style="display:none;">
		<td>{!lsc__StartDate__c}</td>
		<td>{!lsc__Venue__r.Name}</td>
		<td>{!lsc__SellingPrice__c}</td>
	</tr>
</table>
```


The SDK will locate this tag, repeat it for each record and parse the variables automatically. It will then destroy the original tag. The above snippet will give you a list of courses in a table with the costs.

<a name="basic-field-references" />
## Basic field references
Basic field references are a simple way to pull field values into your HTML. These cannot be formatted. If you want to format your field values, use the attribute field references. Please also note that all basic field references are escaped. If you want to display unescaped values, use attribute field references.

To add a field into your HTML, write the field name like so:

```html
<!-- Simple field reference -->
<div>{!lsc__StartDate__c}</div>

<!-- Lookup field reference -->
<div>{!lsc__Venue__r.lsc__Location__r.Name}</div>
```


<a name="attribute-field-references" />
## Attribute field references
Referenceing fields via tag attributes allow you to define formats or the object you are referring to.

To reference a field in a repeat tag, the following snippet will populate the inner div field with the start date of the scheduled course.

```html
<div ls-repeat="events">
	<div ls-field="lsc__StartDate__c"></div>
</div>
```

If you want to format your date, include `moment.js` on your page and use the `ls-format` attribute like so:

```html
<div ls-field="lsc__StartDate__c" ls-format="DD MMMM YYYY"></div>
```

All field values are escaped by default. If you want to make sure your data is not escaped (for instance, when you are displaying rich text), use the `ls-escape` attribute:

```html
<div ls-field="lsc__LongDetail__c" ls-escape="false"></div>
```

| Attribute | Description |
| --------- | ----------- |
| ls-repeat | Specifies object to repeat over |
| ls-field | Specifies field to populate tag with |
| ls-object | Specifies object to pull fields from |
| ls-format | Specifies date format (requires moment.js) |
| ls-escape | Specifies whether to escape field value (defaults to true) |


<a name="version-history" />
## Version History


| Version   | Notes                    |
| --------- | ------------------------ |
| 1.0.1     | Fix for sort order on repeat / top level object access |
| 1.0       | REST SDK Release         |
