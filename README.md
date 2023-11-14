# create-list README

## Description

This is a visual studio code extension.
Adds a new action "Create List" in context menu in file explorer which creates a list of all the files inside of that folder with its content and stores it in output.txt
The file should also open after the generation is completed.

This is for example useful if you want to copy an extension to chatGPT without having to manually copy and paste all the files and paths one by one.

## Installation

Go into the directory and execute `vsce package` (Requires NodeJs & NPM) then in visual studio code under "Extension" (CTRL+SHIT+X)
search for the ... three dots at the top right and select "Install from VSIX..." and select the package
you just generated.

## Usage

In file explorer (Ctrl+Shift+E) Right click on a folder and select "Create List", you will find a output.txt
in that directory with the output. The file should also open automatically after generation is completed.

