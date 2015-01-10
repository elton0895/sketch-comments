# Sketch Comments

Easily add comments to your designs.

## Installation

You can install Sketch Comments in two ways:

**A) Using Sketch Toolbox (plugin manager):**

> It's not yet there, please use the manual method for now.

1. [Download Sketch Toolbox]
2. Unzip the archive and run Sketch Toolbox
3. Type "Comments" into the search input or look for it in the list
4. Click "Install"

You now have Sketch Comments installed.


**B) The manual method:**

1. [Download the plugin]
2. Unzip the archive
3. (Optional) Rename it to "Sketch Comments"
4. Place the folder into your Sketch Plugins folder by navigating to Sketch > Plugins > Reveal Plugins Folder

The plugin folder should look like this:

![Sketch Comments Folder](instructions/plugin-folder.png?raw=true "Sketch Comments Folder")



## Using the plugin

You can access Sketch Comments from the menu:

![Sketch Comments Menu](instructions/plugin-menu.png?raw=true "Sketch Comments Menu")

> Make sure you are using artboards. This plugin will not work otherwise.


### Set up your comment template

Sketch Comments gives you the option to customise how your comments look. Run the "Initialise" command to setup the template. 

![Initialise](instructions/initialisation.gif?raw=true "Initialise")

> The template will also be initialised the first time you add a comment if it doesn't already exist. 


### Add comment `ctrl` + `alt` + `⌘` + `c`

1. Select a layer you want to comment on
2. Run the "Comment" command
3. Type in your comment
4. **Position your mouse where you want to put the comment tip**
5. Press return to confirm

![Add Comment](instructions/add.gif?raw=true "Add Comment")


### Edit comment `ctrl` + `alt` + `⌘` + `c`

1. Select an existing comment
2. Run the "Comment" command
3. Edit your comment
5. Press return to confirm

![Edit Comment](instructions/edit.gif?raw=true "Edit Comment")


### Delete comment

Just select a comment and delete it like any other layer.


### Collapse/expand comment(s) `ctrl` + `alt` + `⌘` + `.`

This leaves the comment tip visible but hides the comment body.

1. (optional) Select a comment
2. Run the "Toggle Collapse" command

![Collapse/Expand](instructions/collapse.gif?raw=true "Collapse/Expand")

> Tip: If you don't select anything, all comments in the document will be collapsed/expanded.


### Hide/show comment(s) `ctrl` + `alt` + `⌘` + `,`

This hides the comment completely.

1. (optional) Select a comment
2. Run the "Toggle Hide" command

![Hide/Show](instructions/hide.gif?raw=true "Hide/Show")

> Tip: If you don't select anything, all comments in the document will be hidden/shown.


### Swich comment position `ctrl` + `alt` + `⌘` + `/`

This keeps the tip position still but moved the comment body. Useful when commenting near the edges of an artboard.

1. Select a comment
2. Keep running the "Switch Position" command until the desired position

![Switch Position](instructions/switch-position.gif?raw=true "Switch Position")

> Note: Running the command multiple times will cycle through positions.


### Update style

This allows you to update the style of all comments in the document at once.

1. Navigate to the '-sketch-comments-' page
2. Make any changes to the template
3. Run the "Update" command

![Update Style](instructions/hide.gif?raw=true "Update Style")

> Warning: Please don't change the names of any of the layers in the template.


## Feedback

I've done my best to make sure everything works but if you find any problems or have a suggestion, please [open an issue]. Your feedback is very welcome.


## Last note

There's a lot of really useful code that took a while to figure out. Feel free to use it in your own plugins.


## License

**The MIT License (MIT)**

Copyright (c) 2015 Lukas Ondrej

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


[Download the plugin]:https://github.com/lukas77me/Sketch-Comments/archive/master.zip
[open an issue]:https://github.com/lukas77me/Sketch-Comments/issues/new
[Sketch Toolbox]:http://www.sketchtoolbox.com
[Download Sketch Toolbox]:http://sketchtoolbox.com/Sketch%20Toolbox.zip


