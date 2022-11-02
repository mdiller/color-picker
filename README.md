# @dillerm/webutils
The idea of this project is to support the creation of other web tools projects by providing an easy to use framework for creating configurations as well as a consistant style. So far its in early stages, but the end result will be a library and styles that can be used by an application, with ideally as little code needed as possible to get up and running.

Some of the following notes will later be moved to the tools.dillerm.io project but is here for now as this does not yet exist

## Questions/To Decide
- naming of repo/library (probably @dillerm/webutils)
- naming of css styling classes (mainly decided now?)
  - root of .dillerm?, prolly have nothing that is unstyled?
  - i think we do root of "dillerm" for SPECIFIC ELEMENTS, like "dillerm" on a table makes it good etc.
- naming of the site for editing/playing with colors

# Projects
This is a list of existing or planned projects that will benifit from this library. The idea is any of the existing projects will be migrated over to use this so that i can have a consistant style for all the projects and host them from the same place, and it will be easier to get the new projects up and running and still have them look nice. Things to list for each project(?): pros/challenges, ideas of making it fit better into my new tools ecosystem, updates needed to be made for utils

## tools.dillerm.io
- a place to navigate to all my tools from, serve them from, and auto-rebuild-and-deploy when they change
- features
  - main page that shows all supported tools with git stats
  - serves all of them from subdirectories nicely
  - should be suuuper simple to add a new tool to this (maybe just by adding the git hook)
    - if it gets a new git hook from @mdiller, it just grabs it, downloads repo, builds, and then stuffs the output in the right place
  - auto-redeploy of tools when git hook signals a change

## Styles creator
- a thing to create styles for @dillerm/webutils
- probably lives in this same repo, but could be an example of a way to use the app
- good example for this because should be super simple, and not require a lot of code for it, most of work is in the webutils
- features
  - nice gui controls for changing colors etc
  - live updates to example? (maybe it itself is the example)
  - serialize to json
    - download directly
    - you can save a theme to the browser cache, then it can be used by all the tools
  - themes
    - 2 default themes
    - your own custom one (or multiple)
      - saved in the cache

## json-to-controls Demo
- a demo of my parameter system and how the json creates it
- low priority to create this as not a lot of usecase for it really
- could be a cool demo to show people how it works tho

## Examples/Scratch project
- a project with ez framework for testing new libraries etc.
- would not be lightweight but purpose is for just testing stuff and like a playground.
- benefit is its easy to demo to people and to get up and running with new libs without hassle/boilerplate of new project.
- downsides
  - would prolly eventually get clogged from all the projects?
  - if we get something good here and move it to new repo, loses all history
  - not good for trying out new base systems/frameworks?
- could have a server component too for tools that wanna use that

## Color Editor/Playground
- a tool for getting colors from and playing around with different values and formats
- features
  - paste in a color from anywhere on page (in variety of formats)
  - live updating of all controls obviously (could be interesting vue challenge)
  - auto-convert to many different formats (with buttons for ez copy-to-clipboard)
    - (good practice and nice to have code for converting between formats)
  - get complimenting colors etc

## CSS Demo
- a demo showing a div and how you can manipulate it with css
- idea is its kindof an intro to css and you can experiment with it too
- features
  - user uses nice controls to configure it
  - the controls generate a css that is auto-applied to the div
  - animations to it updates nicely

## Dotabase (https://github.com/mdiller/dotabase-web and https://github.com/mdiller/old-dotabase-web)
- split this project into two parts
  - vpk viewer/hoster (not connected to dillerm/webutils, mebbe host as dotavpk.dillerm.io)
    - maybe also has a dotabase web api
  - a couple cool web utils (connected to dillerm/webutils)
    - searching for responses
    - searching for loadingscreens
    - stats table/calculator thing

## Svg Tools (svg-editor project currently)
- tabs for different tools that are a simple "input svg" => do configurable thing => "output svg"
  - mebbe visually on the page have it go left-to-right like that.
  - tab-like-thing in the middle to control what modification we're making
- add a mode for creating an expanded/blown up version (tools for making animations)
- could put the code for our toolbar in here
- important to have part of this tool be for coloring in via a png
- example.svg => example_v2.svg, and button to put v2 back to be input again
- link from here to other svg tools, like that editor, and svgomg

## Syntax Examples (https://github.com/mdiller/syntax-scripts)
- could make a web frontend for this.
- maybe tabs for the different languages (icons on tabs)
- syntax/highlighted code, with little readme below/above explaining how to run/use

## Lowpoly Earth (https://github.com/mdiller/lowpoly-earth)
- visually/functionally a very straightforward update, just swapping out config, and adding new toolbar
- potential issues are libraries out of date n stuff.

## Herographer (https://github.com/mdiller/herographer)
- main issue here is styling. the graph is in a light style, but we wanna do dark/both. not sure how we handle this, maybe just lock in white style
- other than that should be relatively straight-forward upgrade


lo