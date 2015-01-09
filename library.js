//ensure assets
function ensureAssets() {

    //get assets page
    var assetsPage = getPageWithName('-sketch-comments-');

    //create assets page if it doesn't exist
    if(!assetsPage) {

        //make page
        assetsPage = addPage('-sketch-comments-', false);

        //add comment template
        var template = createGroup(assetsPage, '-template-');
        var body = createGroup(template, 'body');
        body.setIsLocked(true);
        var bg = createRect(body, 'bg', '#222222', 0, 0, 300, 60);
        bg.setIsLocked(true);
        var text = createText(body, 'text', '#FFFFFF', 'Helvetica', 14, 'Comment template', 20, 20, 260, 20, true);
        text.setIsLocked(true);
        var point = createRect(template, 'point', '#FF0000', 0, 65, 10, 10);
        point.setIsLocked(true);

        //resize groups
        [body resizeRoot:true];
        [template resizeRoot:true];

        //return false, made new assets
        return false;
    }

    //assets are ok
    return true;
}

//insert comment at position
function insertComment(comment, selection) {

    //copy comment to clipboard
    copyLayerToClipboard(comment);

    //get container
    var container = getCommentsContainer();
    if(!container) return;
    var firstComment = getChildLayers(container)[0];

    //select first comment and paste next to it
    [firstComment select: true byExpandingSelection: false];
    sendAction('pasteHere:');

    //get pasted comment and adjust
    comment = doc.selectedLayers()[0];
    adjustCommentHeight(comment);

    //rename comment
    [comment setName: '-comment- (' + [selection name] + ')'];

    //position comment at point
    comment.frame().setX(comment.frame().x() + comment.frame().width() / 2);
    comment.frame().setY(comment.frame().y() - comment.frame().height() / 2);

    //bring comments container to front
    bringToFront(container);
}

//get comments container
function getCommentsContainer() {

    //get artboard
    var artboard = doc.currentPage().currentArtboard();
    if(!artboard) return;

    //get existing container
    var existingContainer = getLayerWithName('-comments-', artboard, true);
    return (existingContainer) ? existingContainer : createCommentsContainer();

    //create a new comments container
    function createCommentsContainer() {

        //create container
        var container = artboard.addLayerOfType('group');
        container.setName('-comments-');
        container.frame().setWidth(artboard.frame().width());
        container.frame().setHeight(artboard.frame().height());
        container.frame().setX(0);
        container.frame().setY(0);

        //enable click-through
        [container setHasClickThrough: true];

        //add dummy layer inside
        var dummy = container.addLayerOfType('rectangle');
        dummy.setName('-dummy-comment-');
        dummy.frame().setWidth(1);
        dummy.frame().setHeight(1);
        dummy.frame().setX(0);
        dummy.frame().setY(0);
        dummy.setIsLocked(true);

        return container;
    }
}

//create comment layer
function createCommentLayer(text) {

    //get page
    var page = getPageWithName('-sketch-comments-');

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
    adjustCommentHeight(comment);

    //return prepared comment layer
    return comment;
}

//adjust comment size
function adjustCommentHeight(comment) {

    //get layers
    var body = getLayerWithName('body', comment);
    var point = getLayerWithName('point', comment);
    var bg = getLayerWithName('bg', body);
    var text = getLayerWithName('text', body);

    //get point position
    var pointX = comment.frame().x();
    var pointY = comment.frame().y() + comment.frame().height();

    //resize text layer
    resizeLayerToFitText(text);
    
    //get heights
    var textHeight = text.frame().height();
    var bgHeight = 20 + textHeight + 20;
    var pointHeight = point.frame().height();
    var totalHeight = bgHeight + 5 + pointHeight;

    //set bg height
    bg.frame().setHeight(bgHeight);

    //set positions
    comment.frame().setX(0);
    comment.frame().setY(0);
    body.frame().setX(0);
    body.frame().setY(0);
    bg.frame().setX(0);
    bg.frame().setY(0);
    text.frame().setY(20);
    point.frame().setY(bgHeight + 5);

    //resize comment group layer to fit children
    [comment resizeRoot:true];

    //set comment position
    comment.frame().setX(pointX);
    comment.frame().setY(pointY - totalHeight);
}

//update comments
function updateComments(comments) {

	//get page
	var page = getPageWithName('-sketch-comments-');

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
        adjustCommentHeight(comment);
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


