# Fractal Viewer

##### WEB-115 Final Project Proposal Student: `Naphtali Rutzky` | Repo: `Looty9397/fractal-viewer`

## Overview

A moderately simple web app allowing users to view and manipulate various fractals (like a Mandelbrot set). Users select their desired fractal using a navbar, and from there can modify various parameters used to generate the image. Some preset customization will be available, permitting users to explore a variety of visuals before embarking to create their own.

The target audience is those who want to be able to view fractals.

## Features

- Choice of fractal to view
- Zoom in on the fractal up to a point (as yet unknown)
  - Possible scroll zoom
- Customize colors
- Customize any constants used in generating the fractal (ex: c, n for Julia sets)
- Image automatically updates according to user input, but not to changes in settings
- Reset / Random / Apply Settings buttons

## Core Requirements

| Requirement | Implementation |
| --- | --- |
| If statements & Loops | Analyzing user input requires conditional operations. Generating a fractal image requires looping. |
| Event Listeners | Any button press gets processed by an event listener. User input is handled by event listeners. |
| DOM Element Creation | The customization options are dynamically built using DOM functions. Most functionality is as well. |
| Classes and Subclasses | Color(red, green, blue) to store easily-modifiable colors. Fractal(name, algorithm, <options = indicator of what stuff to have>). Uses mathjs to do complex number stuff. |
| DLC | HTML Canvas API to render the fractals. |
| Other | Possibly will animate the rendering in stages. Unsure yet. |

## Tech Stack

- HTML
  - HTML Canvas
- CSS
- JavaScript
- [mathjs](https://github.com/josdejong/mathjs) library
- VS Code + GitHub