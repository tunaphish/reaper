---
finished: 
tags:
  - reaper
  - artstyle
archived: true
---


# Thesis 
- basically want to be able to convey sex scenes, action, etc with cut scenes.. probably need camera movement... cuts. 
- I want to write scenes easily... 

# Mind Dump 
- Anime Captions vs Dialogue Boxes
	- because VN's don't force audio it has to show the character that is talking
- Visual cohesiveness between CG's and dialogue, 
- how to handle movie style cuts... anno mutationem just swings shit in and out. I could spawn dialogue above their head. and it's up to player to ensure it's in frame?

# Research
- Magus 2.5D fight - https://www.youtube.com/watch?v=yKca4X3AKR0
-  HD-2D (Undreamed Panic) - https://www.youtube.com/watch?v=UvieXLnyw3M 
- gamma - emerald - https://www.youtube.com/watch?v=IHGyqB4g4ho&list=WL&index=4
- Anno Mutation Em - https://www.youtube.com/watch?v=MUK5QwBKXCI
- Manhwa, VNs, Movies - Speech Bubbles
- Dohna Dohna: https://www.youtube.com/watch?v=IuBt-MDCuro
- Butterfly Soup Parallax
- signalis palythrough - https://www.youtube.com/watch?v=FxCvnuWNbgg&t=6786s
	- sometimes hard cuts and had detail cut ins... 
- threads of time trailer - https://www.youtube.com/watch?v=rYc4TftSW94
- Tech
	- markdown Like https://fountain.io/
	- look up other options on reddit
	- Script to cutscene. Display on web. Display animations. Scene generator. Animations and sounds.
- Drag and drop assets and define a 3D coordinate lmao. 


# High Level Plan 
- Sacrifices
	- color - manga style 
	- no anime captions... purely manga style
	- will just do full screen cut ins 


- I want to design tooling and system for generating cutscenes in my hd-2d style game (a game where mostly 2D assets are running around 3D space/environments)
- because it's a game I want to take advantage of features like dynamic fish eye filters being added or having parallax on displaying the 3d space when players drag on the screen
- however I will also rely on a lot of 2D presentation that's just flat as well (not in the 3D environment)
- Thus I will take a two screen presentation approach. One 2D screen that overlays on top of the 3D screen. 
- For implementation I want to be able to easily write scenes in a somewhat human readable way. Something like fountain.io or how renpy does scripts. I will list a variety of features I want to be able to do, and I want help on writing the syntax for scripts in my game. 


- General Features
	- auto advance, tap to advance
	- vertically based
	- Content 
		- Animations 
		- Portrait changes, expression changes, pose changes
		- Detail Shots -> Minor Acting
			- Pose Changes 
			- Portrait Updates 
- 2D Screen
	- UI HUD
		- Dialogue Options between party members
	- display full screen images, usually in the form of manga style panels
- 3D Screen
	- speech bubbles
		- text styling with html/css
	- backgrounds
	- parallax by dragging
	- camera movement (pans, zooms)
	- filters (fish eye)


# Physical Implementation 


# Reflection 
