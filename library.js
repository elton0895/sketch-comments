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
    var commentPosition = getCommentPosition(comment);
    adjustCommentHeight(comment, commentPosition);

    //rename comment
    [comment setName: '-comment- (' + [selection name] + ')'];

    //position comment at point
    comment.frame().setX(Math.round(comment.frame().x() + comment.frame().width() / 2));
    comment.frame().setY(Math.round(comment.frame().y() - comment.frame().height() / 2));

    //make sure comment fits horizontally
    if(container.parentGroup().frame().width() < (comment.frame().x() + comment.frame().width())) {
        setLeftCommentPosition(comment);
    }

    //make sure comment fits vertically
    if(0 > comment.frame().y()) {
        setBottomCommentPosition(comment);
    }

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

//switch point side
function switchPointSide(comment) {

    //get point
    var point = getLayerWithName('point', comment);

    //switch side
    if(point.frame().x() == 0) {
        point.frame().setX(point.frame().x() + comment.frame().width() - point.frame().width());
    }
    else {
        point.frame().setX(0);
    }
}

//set top comment position
function setTopCommentPosition(comment, keepInPlace) {

    //get layers
    var point = getLayerWithName('point', comment);
    var body = getLayerWithName('body', comment);

    //get rects
    var pointRect = getRect(point);
    var bodyRect = getRect(body);

    //set position
    body.frame().setY(0);
    point.frame().setY(bodyRect.height + 5);

    if(!keepInPlace) {
        comment.frame().setY(comment.frame().y() - (bodyRect.height + 5));
    }
}

//set bottom comment position
function setBottomCommentPosition(comment, keepInPlace) {

    //get layers
    var point = getLayerWithName('point', comment);
    var body = getLayerWithName('body', comment);

    //get rects
    var pointRect = getRect(point);
    var bodyRect = getRect(body);

    //set position
    point.frame().setY(0);
    body.frame().setY(pointRect.height + 5);

    if(!keepInPlace) {
        comment.frame().setY(comment.frame().y() + (bodyRect.height + 5));
    }
}

//set right comment position
function setRightCommentPosition(comment, keepInPlace) {

    //get layers
    var point = getLayerWithName('point', comment);
    var body = getLayerWithName('body', comment);

    //get rects
    var pointRect = getRect(point);
    var bodyRect = getRect(body);

    //set position
    point.frame().setX(0);

    if(!keepInPlace) {
        comment.frame().setX(comment.frame().x() + (bodyRect.width - pointRect.width));
    }
}

//set left comment position
function setLeftCommentPosition(comment, keepInPlace) {

    //get layers
    var point = getLayerWithName('point', comment);
    var body = getLayerWithName('body', comment);

    //get rects
    var pointRect = getRect(point);
    var bodyRect = getRect(body);

    //set position
    point.frame().setX(bodyRect.width - pointRect.width);

    if(!keepInPlace) {
        comment.frame().setX(comment.frame().x() - bodyRect.width + pointRect.width);
    }
}

//set comment position
function setCommentPosition(comment, position) {

    //top left
    if(position.top && position.left) {
        setTopCommentPosition(comment, true);
        setLeftCommentPosition(comment, true);
    }

    //top right
    if(position.top && !position.left) {
        setTopCommentPosition(comment, true);
        setRightCommentPosition(comment, true);
    }

    //bottom left
    if(!position.top && position.left) {
        setBottomCommentPosition(comment, true);
        setLeftCommentPosition(comment, true);
    }

    //bottom right
    if(!position.top && !position.left) {
        setBottomCommentPosition(comment, true);
        setRightCommentPosition(comment, true);
    }
}

//get comment position (top left, etc)
function getCommentPosition(comment) {

    //get layers
    var point = getLayerWithName('point', comment);
    var body = getLayerWithName('body', comment);

    //get rects
    var pointRect = getRect(point);
    var bodyRect = getRect(body);

    //top right
    if((bodyRect.x == pointRect.x) && (bodyRect.y == 0)) {
        return {
            top: true,
            left: false 
        };
    }

    //bottom right
    if((bodyRect.x == pointRect.x) && (bodyRect.y != 0)) {
        return {
            top: false,
            left: false 
        };
    }

    //bottom left
    if((pointRect.x == (bodyRect.width - pointRect.width)) && (bodyRect.y != 0)) {
        return {
            top: false,
            left: true 
        };
    }

    //top left
    if((pointRect.x == (bodyRect.width - pointRect.width)) && (bodyRect.y == 0)) {
        return {
            top: true,
            left: true 
        };
    }
}

//switch comment body position
function switchCommentBodyPosition(comment) {

    //get layers
    var point = getLayerWithName('point', comment);
    var body = getLayerWithName('body', comment);

    //get rects
    var pointRect = getRect(point);
    var bodyRect = getRect(body);

    //top right
    if((bodyRect.x == pointRect.x) && (bodyRect.y == 0)) {


        //position it bottom right
        setBottomCommentPosition(comment);
    }

    //bottom right
    if((bodyRect.x == pointRect.x) && (bodyRect.y != 0)) {

        //position it bottom left
        setLeftCommentPosition(comment);
    }

    //bottom left
    if((pointRect.x == (bodyRect.width - pointRect.width)) && (bodyRect.y != 0)) {

        //position it top left
        setTopCommentPosition(comment);
    }

    //top left
    if((pointRect.x == (bodyRect.width - pointRect.width)) && (bodyRect.y == 0)) {

        //position it top right
        setRightCommentPosition(comment);
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
    var commentPosition = getCommentPosition(comment);

    //find layers
    var bodyLayer = getLayerWithName('body', comment);
    var textLayer = getLayerWithName('text', bodyLayer);
    
    //set comment text
    [textLayer setStringValue: text];
    
    //adjust comment size
    adjustCommentHeight(comment, commentPosition);

    //return prepared comment layer
    return comment;
}

//adjust comment size
function adjustCommentHeight(comment, commentPosition) {

    //get layers
    var body = getLayerWithName('body', comment);
    var point = getLayerWithName('point', comment);
    var bg = getLayerWithName('bg', body);
    var text = getLayerWithName('text', body);

    //get point position
    var pointX = Math.round(comment.frame().x());
    var pointY; 
    if(commentPosition.top) {
        pointY = Math.round(comment.frame().y() + comment.frame().height());
    }
    else {
        pointY = Math.round(comment.frame().y());
    }

    //resize text layer
    resizeLayerToFitText(text);
    
    //get heights
    var textHeight = Math.round(text.frame().height());
    var bgHeight = Math.round(20 + textHeight + 20);
    var pointHeight = Math.round(point.frame().height());
    var totalHeight = Math.round(bgHeight + 5 + pointHeight);

    //set bg height
    bg.frame().setHeight(bgHeight);

    //set positions
    comment.frame().setX(0);
    comment.frame().setY(0);

    if(commentPosition.top) {
        body.frame().setX(0);
        body.frame().setY(0);
        bg.frame().setX(0);
        bg.frame().setY(0);
        text.frame().setY(20);
        point.frame().setY(bgHeight + 5);
    }
    else {
        body.frame().setX(0);
        body.frame().setY(pointHeight + 5);
        bg.frame().setX(0);
        bg.frame().setY(0);
        text.frame().setY(20);
        point.frame().setY(0);
    }

    //resize comment group layer to fit children
    [comment resizeRoot:true];

    //set comment position
    comment.frame().setX(pointX);
    if(commentPosition.top) {
        comment.frame().setY(pointY - totalHeight);
    }
    else {
        comment.frame().setY(pointY);
    }
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
        var commentPosition = getCommentPosition(comment);

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
        adjustCommentHeight(comment, commentPosition);
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


