//resized text layer to fit text
function resizeLayerToFitText(layer) {
	[layer adjustFrameToFit];
    [layer select:true byExpandingSelection:false];
    [layer setIsEditingText:true];
    [layer setIsEditingText:false];
    [layer select:false byExpandingSelection:false];
}

//get value at index
function valueInViewAtIndex (view, index) {
    return view.viewAtIndex(index).stringValue();
}

//get rect for layer
function getRect(layer) {
    return {
        x: layer.frame().x(),
        y: layer.frame().y(),
        width: layer.frame().width(),
        height: layer.frame().height()
    };
}

//send action (e.g. 'copy:', 'pasteHere:')
function sendAction(commandToPerform) {
	try {
		[NSApp sendAction:commandToPerform to:nil from:doc];
	} catch(e) {
		my.log(e)
	}
}

//copy layer to clipboard
function copyLayerToClipboard(layer) {

    //get current page
    var page = [doc currentPage];

    //add and copy layer to clipboard
    page.addLayers([layer]);
    [layer select: true byExpandingSelection: false];
    sendAction('copy:');

    //remove layer
    [page removeLayer: layer];
}

//filter array using predicate
function predicate(format, array) {
	
	//make sure that format is speficied
	if(!format || !format.key  || !format.match) return;

	//create predicate
	var predicate = NSPredicate.predicateWithFormat(format.key, format.match);

	//perform query
	var queryResult = array.filteredArrayUsingPredicate(predicate);

	//return result
	return queryResult;
}

//get layer with name
function getLayerWithName(name, rootLayer, fullMatch) {

	//prepare predicate format
	var format = {
		key : '(name != NULL) && ' + ((fullMatch) ? '(name == %@)' : '(name like %@)'), 
		match : (fullMatch) ? name : (name + '*')
	};

	//get matches
	var matches = jsArray(predicate(format, [rootLayer children]));

	//if at least one match found
	if(matches.length) return matches[0];

	//return nothing if no matches
	return;
}

//get layers with name
function getLayersWithName(name, rootLayer, fullMatch) {

	//prepare predicate format
	var format = {
		key : '(name != NULL) && ' + ((fullMatch) ? '(name == %@)' : '(name like %@)'), 
		match : (fullMatch) ? name : (name + '*')
	};

	//get and return matches
	return jsArray(predicate(format, [rootLayer children]));
}

//find layers with name in doc
function getLayersWithNameInDoc(name, fullMatch) {

	//collect instances of component with name
	var instances = [];

	//get all pages
	var pages = jsArray([doc pages]);
	for(var i = 0; i < pages.length; i++) {
	  	var page = pages[i];

	  	//get matches
	  	var matches = getLayersWithName(name, page, fullMatch);

		//add to all instances found
		instances = instances.concat(matches);
	}

	//return found component instances
	return instances;
}

//check if group or artboard or page
function canContainLayers(layer) {
	return !!([layer isKindOfClass:[MSLayerGroup class]] || 
		   [layer isKindOfClass:[MSArtboardGroup class]] ||
		   [layer isKindOfClass:[MSPage class]]);
}

//find page with name
function getPageWithName(name) {

	var pages = jsArray([doc pages]);
	for(var i = 0; i < pages.length; i++) {
	  	var currentPage = pages[i];

	  	//if page matches name
	  	if([currentPage name] == name) {
	  		return currentPage;
	  	}
	}

	return;
}

//bring layer to front
function bringToFront(layer) {
    var parentGroup = layer.parentGroup();
    parentGroup.removeLayer(layer);
    parentGroup.addLayers([layer]);
}

//get all child layers of layer
function getChildLayers(layer) {
	return jsArray([layer layers]);
}

//capitalise string
function capitalise(str) {
	return str.slice(0, 1).toUpperCase() + str.slice(1);
}

//get javascript array from NSArray
function jsArray(array) {
  var length = [array count];
  var jsArray = [];

  while(length--) {
  	jsArray.push([array objectAtIndex: length]);
  }
  return jsArray;
}

//copy layer
function copyLayer(layer) {

	//create duplicate
	var layerCopy = [layer duplicate];

	//remove duplicate from parent
	layerCopy.removeFromParent();

	return layerCopy;
}

//adds a text field to alert
function addAlertField(alert, label, defaultValue) {
    alert.addTextLabelWithValue(label);
    alert.addTextFieldWithValue(defaultValue);
}

//adds a text area to alert
function addAlertTextArea(alert, label, defaultValue) {
	alert.addTextLabelWithValue(label);
	var textArea = [[NSTextField alloc] initWithFrame:NSMakeRect(10, 10, 300, 200)];
    textArea.setStringValue(defaultValue || '');
    alert.addAccessoryView(textArea);
}

//check if layer is artboard
function isArtboard(layer) {
	return !![layer isKindOfClass:[MSArtboardGroup class]];
}

//check if layer is group
function isGroup(layer) {
	return !![layer isKindOfClass:[MSLayerGroup class]];
}

//check if layer is page
function isGroup(layer) {
	return !![layer isKindOfClass:[MSPage class]];
}

//add page
function addPage(name, returnToPrevPage) {

    //get current page
    var currentPage = doc.currentPage();

    //create new page
    var page = doc.addBlankPage();
    page.setName(name);

    //make current page active again
    if(returnToPrevPage) doc.setCurrentPage(currentPage);

    return page;
}

//create rect
function createRect(parent, name, colour, x, y, w, h) {

    //create rect
    var rect = parent.addLayerOfType('rectangle');
    // rect = rect.embedInShapeGroup();

    //add fill
    var fill = rect.style().fills().addNewStylePart();
    fill.color = MSColor.colorWithSVGString(colour);

    //set frame
    rect.frame().setWidth(w);
    rect.frame().setHeight(h);
    rect.frame().setX(x);
    rect.frame().setY(y);

    //set name
    rect.setName(name);
    rect.setNameIsFixed(true);
        
    return rect;
}

//create group
function createGroup(parent, name) {

    //create group
    var group = parent.addLayerOfType('group');
    group.setName(name);

    return group;
}

//create text
function createText(parent, name, color, font, fontSize, string, x, y, w, h, fixed) {

    //create text layer
    var textLayer = parent.addLayerOfType("text");
    textLayer.textColor = MSColor.colorWithSVGString(color);
    textLayer.fontSize = fontSize;
    textLayer.setFontPostscriptName(font);
    textLayer.setName(name);
    textLayer.setNameIsFixed(true);
    textLayer.setStringValue(string);

    //set fixed
    if(fixed) {
        textLayer.setTextBehaviour(1); // BCTextBehaviourFixedWidth
    }

    //set size
    textLayer.frame().setWidth(w);
    resizeLayerToFitText(textLayer);

    //set position
    textLayer.frame().setX(x);
    textLayer.frame().setY(y);

    return textLayer;
}

//copy layer style
function copyLayerStyle(sourceLayer, destinationLayer) {

    //define available collections
    var collectionNames = ['fills', 'borders', 'shadows', 'innerShadows'];

    //define properties for each collection (normal layers)
    var propertyNames = {
        fills: [
            'fillType',
            'color',
            'gradient',
            'noiseIntensity',
            'isEnabled'
        ],
        borders: [
            'position',
            'thickness',
            'fillType',
            'gradient',
            'isEnabled'
        ],
        shadows: [
        	'offsetX',
            'offsetY',
            'blurRadius',
            'spread',
            'color',
            'isEnabled'
        ],
        innerShadows: [
            'offsetX',
            'offsetY',
            'blurRadius',
            'spread',
            'color',
            'isEnabled'
        ]
    };

    //define properties for text layers
    var textPropertyNames = [
        'fontSize',
        'fontPostscriptName',
        'textColor',
        'textAlignment',
        'characterSpacing',
        'lineSpacing'
    ];

    //get styles
    var sourceLayerStyle = [sourceLayer style];
    var destinationLayerStyle = [destinationLayer style];

    //get context settings
    var sourceContext = [sourceLayerStyle contextSettings];
    var destinationContext = [destinationLayerStyle contextSettings];

    //go through each collection
    for (var i = 0; i < collectionNames.length; i++) {
        var collectionName = collectionNames[i];
        var propertyNamesForCollection = propertyNames[collectionName];

        //get collections
        var sourceCollection = sourceLayerStyle[collectionName]();
        var destinationCollection = destinationLayerStyle[collectionName]();

        //remove all styles from destination collection
        for (var j = 0; j < [destinationCollection count]; j++) {
            [destinationCollection removeStylePartAtIndex: j];
        }

        //add source collection styles to destination collection
        for (var j = 0; j < [sourceCollection count]; j++) {

            //get source style
            var sourceStyle = [sourceCollection objectAtIndex: j];

            //add new style to destination collection
            [destinationCollection addNewStylePart];
            var destinationStyle = [destinationCollection objectAtIndex:[destinationCollection count] - 1]];

            //apply style properties
            applyStyleProperties(sourceStyle, destinationStyle, propertyNamesForCollection);
        }
    }

    //set context settings
    [destinationContext setOpacity: [sourceContext opacity]];
    [destinationContext setBlendMode: [sourceContext blendMode]];

    //copy text layer specific properties
    if ([destinationLayer isKindOfClass: [MSTextLayer class]]) {
        applyStyleProperties(sourceLayer, destinationLayer, textPropertyNames);
    }
}

//apply properties of source style to destination style
function applyStyleProperties(sourceStyle, destinationStyle, properties) {

    //apply each property
    for (var i = 0; i < properties.length; i++) {

        //make getter and setter for properties
        var getter = properties[i];
        var setter = 'set' + capitalise(getter);

        //apply style from source to destination
        destinationStyle[setter](sourceStyle[getter]());
    }
}