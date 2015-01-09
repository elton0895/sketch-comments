//create comment layer
function createCommentLayer(text) {

    //get page
    var page = getPageWithName('sketch-comments');

    //get comment template
    var template = getLayerWithName('-template-', page);

    //make a copy
    var comment = copyLayer(template);

    //find layers
    var bodyLayer = getLayerWithName('body', comment);
    var textLayer = getLayerWithName('text', bodyLayer);
    
    //set comment text
    [textLayer setStringValue: text];
    
    //adjust comment size
    adjustCommentSize(comment);

    //return prepared comment layer
    return comment;
}

//insert comment at position
function insertComment(comment, selection) {

    //add comment layer
    [comment setName: '-comment-'];
    selection.addLayers([comment]);

    //select comment and copy it
    [comment select: true byExpandingSelection: false];
    sendAction('copy:');

    //remove comment from selection
    [selection removeLayer: comment];

    //select selection again
    [selection select: true byExpandingSelection: false];

    //paste comment
    sendAction('pasteHere:');
}

//update comments
function updateComments(comments) {

	//get page
	var page = getPageWithName('sketch-comments');

	//get comment template
	var template = getLayerWithName('-template-', page);

	//find template layers
	var templateBodyLayer = getLayerWithName('body', template);
    var templatePointLayer = getLayerWithName('point', template);
	var templateTextLayer = getLayerWithName('text', templateBodyLayer);
	var templateBgLayer = getLayerWithName('bg', templateBodyLayer);

	//update all comments
	for(var i = 0; i < comments.length; i++) {
		var comment = comments[i];

		//find layers
		var bodyLayer = getLayerWithName('body', comment);
        var pointLayer = getLayerWithName('point', comment);
		var textLayer = getLayerWithName('text', bodyLayer);
		var bgLayer = getLayerWithName('bg', bodyLayer);

        //copy layers from template
        var templateBgLayerCopy = copyLayer(templateBgLayer);
        var templatePointLayerCopy = copyLayer(templatePointLayer);

        //position point layer
        [templatePointLayerCopy select: true byExpandingSelection: false];
        var templatePointLayerCopyFrame = [templatePointLayerCopy frame];
        [templatePointLayerCopyFrame setX: pointLayer.frame().x()];
        [templatePointLayerCopyFrame setY: pointLayer.frame().y()];

        //replace old layers with copies
        [bodyLayer removeLayer: bgLayer];
        [bodyLayer removeLayer: textLayer];
        [comment removeLayer: pointLayer];
        bodyLayer.addLayers([templateBgLayerCopy]);
        bodyLayer.addLayers([textLayer]);
        comment.addLayers([templatePointLayerCopy]);

		//copy layer styles
		copyLayerStyle(templateBodyLayer, bodyLayer);
		copyLayerStyle(templateTextLayer, textLayer);

        //adjust comment size
        adjustCommentSize(comment);
	}
}

//collapse comment
function collapseComment(comment) {

    //get body layer
    var bodyLayer = getLayerWithName('body', comment);

    //hide comment body
    [bodyLayer setIsVisible: false];

    //lock comment layer
    [comment setIsLocked: true];
}

//expand comment
function expandComment(comment) {

    //get body layer
    var bodyLayer = getLayerWithName('body', comment);

    //hide comment body
    [bodyLayer setIsVisible: true];

    //lock comment layer
    [comment setIsLocked: false];
}

//show comment
function showComment(comment) {

    //make comment visible
    [comment setIsVisible: true];
}

//hide comment
function hideComment(comment) {

    //make comment hidden
    [comment setIsVisible: false];
}

//adjust comment size
function adjustCommentSize(comment) {

    //get layers
    var bodyLayer = getLayerWithName('body', comment);
    var bgLayer = getLayerWithName('bg', bodyLayer);
    var textLayer = getLayerWithName('text', bodyLayer);

    //get original body pos and height
    var bodyLayerFrame = [bodyLayer frame];
    var originalBodyYPos = [bodyLayerFrame y];
    var originalBodyHeight = [bodyLayerFrame height];

    //set comment size
    resizeLayerToFitText(textLayer);

    //get height of text layer
    var textLayerHeight = [[textLayer frame] height];

    //set bg layer size
    var newHeight = 20 + textLayerHeight + 20;
    var bgLayerFrame = [bgLayer frame];
    [bgLayerFrame setHeight: newHeight];

    //adjust body pos
    var heightDiff = originalBodyHeight - newHeight;
    [bodyLayer select: true byExpandingSelection: false];
    bodyLayerFrame = [bodyLayer frame];
    [bodyLayerFrame setY: originalBodyYPos + heightDiff];
    [bodyLayer select: false byExpandingSelection: false];
}

//create alert
function createAlert(title, existingComment) {

    //create comment
    var alert = COSAlertWindow.new();

    //set alert title
    alert.setMessageText(title);
    alert.setInformativeText('Type your comment below.');

    //comment area
    addAlertTextArea(alert, 'Comment', existingComment || '');

    //action buttons
    alert.addButtonWithTitle('OK');
    alert.addButtonWithTitle('Cancel');

    //open alert
    return handleAlert(alert, alert.runModal());


    //handles the response from alert
    function handleAlert(alert, responseCode) {

        //if ok button pressed
        if (responseCode == '1000') {

            //return comment text
            return valueInViewAtIndex(alert, 1);
        }
    }
}


