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

- I want to converge ideas together...
	- issue is that I want to have cutscenes and battle converge together?
	- on top of that it also appears in the in game world lmao... so i have to be spawning or showing alternate things all the fucking time... and it gets to be a point... it shows up
	- triggers a cutscene and then the camera takes over
	- okay so there's the world layer... then the dialogue layer... 
	- I guess the issue is that it's full body?


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


# Mind Dump
- Window similar to announcing attack announcing attacks in anime?
	- make it bold and shit and have special effects
- Menus close one at a time instead of at once.
- By stacking layers, you can add a ton of depth to environments and even interface elements. One of my personal favorites is to add a nearly-transparent "dust layer" that mostly just drifts about, but responds to nearby movement and/or u interactions.


## Content Ideas
- spawn a bunch of attacks
	- spawn a bunch of swords
- character talks over another character
- spawn eyes, reactions
- spawn additional enemies
- She’s lying 
- Fractured self effect
- Only a text box
	- … oh. I guess. I’ve disappeared now. 
- Shows all the gifs of your past life. Do you want to forget? Yes. No. 
	- They all fade one by one 
- Pop ups and modals
- Window fractals
- Her hair. Her eyes. Her plump lips. Error. Error. Error. Error. 

## Issues
- character dancing
- new displays
- fitting everythang
 ![[window-ideation.png]]

- probably lots of cool ideas to be had with regard to my other abilities...
- rewrite my game AGAIN.. probably punt it back all the way to 2D assets... and remove a shit ton of assets. focus on dialogue now..


# Implementation
- let's just focus on  dialogue for now
	- okay so it needs 
	- width, height, depth (or maybe a way to do it organically?)
	- x, y coordinates
	- styled in different ways.. perhaps a type 
		- dialogue 
		- choice...
		- animation... plus
	- params based on the type of window it is... does it make sense to do this in some kind of DSL language? I would need an interpreter lmao. maybe each piece of dialogue is custom... but I don't necessarily want to do that. 
	- choices oftentimes always appear in a certain place... along with dialogue 
	- perhaps it's optional with a set of smart defaults. bottom left... bottom right. stuff like that 

# Physical Implementation 
- encounter
	- threads
	- enemies
	- initiated (battle)

- [x] remove 3D setup
- [x] add back 2D setup
- [x] delete dialogue setup 
- [x] windows 
- [x] mask
- [x] encounter list
- [x] play music
- [x] auto advance
- [x] BUG (old ones still interactable)
- [x] frenzy text
- [x] asset bug
- [x] styled multi text
- [x] dialogue choice
- [x] multiple spreads
- [ ] redesign overworld -> menu -> battle
- [ ] refactor react overlay so I can have multiple overlays
- [ ] design cutscene generator
	- [ ] step into area
	- [ ] walk up to someone and have convo...
- [ ] animations
- [ ] rename window... as it's shadowed
- [ ] integrate battle
- [ ] tapping on last window of multi thread will close it, only leave convo, shows interaction symbol (potential solution is some kind of stall event, or keep track if multiple spreads)
# Reflection 
- need to develop cutscene tooling