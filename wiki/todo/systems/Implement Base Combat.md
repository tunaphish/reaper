---
tags:
  - reaper
  - gamedev
---
# Mind Dump
- spellcrafting
- multi menu ideation
	- buffs
		- multi attacking by using buffs.
		- are trading buffs up
	- or maintaing defensive stances, barriers, etc.
	- converting buffs so I can chain a big attack, gunna cum
	- perhaps you manage three menus to chain different things..
	- target menu. can alter the target menu... buffs as menu
	- using buffs as charges
	- defense menu. 
		- sac it to use as a different menu
		- different options, counter, guard, dodge. etc. 
		- hmm

- https://www.reddit.com/r/gamedesign/comments/1nnwsgx/what_are_your_favorite_classes_that_dont_get_the/
	- summon auto select their action
	- knight gets suite of defensive actions
	- defensive actions are small timed buffs
	- buffs couuuld be unlimited
	- magic is async attacks (mainly used to extend a combo)
	- assigned..
	- had this idea where menus spawn, merged, sacced. how could that work.
	- if you get attacked and don't have a defensive menu up then your shit gets rocked
- enemy attacks break menus
	- you want to combo ideally
	- enemies will also be comboing and you gotta break it up
- targeting your own menu
	- attack, defend... 
	- dressphere?
- class examples
	- duelists have stance switching (tabs)
	- hmm summonors
	- buf
- hold onto cast to stop AP but trigger it faster

- you can see what an enemy is investing into..
- attack chains... 
	- i'd want it to interact with 

- additional windows are metaphors for active spells... 
- conditionals... you try to click a window but you can't.. or an option is glitch locked.. MAHAGORA. the summoner window. 
	- or a summon when a teammate is died. 
	- a loadout where they shift from stance to stance
- target
	- enemies // allies 
	- players are still typically only doing one thing at a time
	- maybe debuffs applied via magic (but only if they have no guard up)

- guards
- buffs // debuffs
- casting
- summons
- attack (adds to chain) 
	- clicking on chain unleashes? -> nah 
- alternate actions 
- ultimate

- just classes you equip that modify the window metaphor... no extensions or anything. just a variety of actions you can select from? with a range of small to large AP. 

- active
	- casting // combos
- defense
- investments
	- buffs // debuffs // triggers (counter, follow ups) // alternate actions menu // ult // summon

- active > investment
- investment > defense
- defense > active 

- enemies can
	- timer til they attack
	- have guard criteria
	- plus buffs 
	- plus cast magic

okay new triangle

- atk > magic > invest > atk
	- investments are just buff windows and can have a variety of cool effects. can be sacced to get AP and invest into bic attacks, magic, or investments
- loadouts are just a variety of magic, attacks, investments. 
- "real time" party with no AI -> ATB
	- top dogs are X-2 and XIII
	- why do people like XIII
		- stagger and flowing through battle. orchestration.
		- juggling enemies -> combo
		- dislike AI
	- why do people like x-2?
		- job system, pretty animation when equipping spheres
		- comboing system, aligning magic and physical attacks so it landed in a way
		- dislike how it was too frenetic, bit complicated
- hmm I still like the idea of spawning buffs and then cracking them to feed into higher tier.
	- maybe a health system on them or something...
	- okay but then how do you actually. what's the actual baseline system.
- the fucking investments are the building
	- so what exactly do I have access to?
	- investing into knight. 
	- the idea is like activating a technique... 
		- then getting more..
	- sinking ATB into those things I get to do.
	- sinking ATB into guard and I can mitigate attacks
		- turning on the mini game is not fun
	- hmm
		- okay so I get AP. now I sink into an ability. 
		- actually the moves themselves get access to better skills? so it cracks itself..
		- they all start to increase.
	- atk
	- knight
	- berserker.
	- the different combos... 
	- but where does composition happen? in the main menu? and then it disappears after? would suck coding this in react lmao. assigning certain aspects to menus. giving it transformations. open special menus. click click click. having them available and then destructable. combinable? and then enemies can curse certain menus. no longer chaining them. and have them be shattered... modify your target menu? so baseline is just attack. defend. techniques. items. duelist -> switch between stances. but then who was phone??? fuck I'm almost there. gives you bloodlust actions. adds bloodied. to knight. no that's too confusing. they only ever really do one thing at a time. maybe the baseline system of chaining classes is still there? and alternate actions are quite rare. most of the times they are just buffs. 
	- okay so uniquely chaining classes to unlock other identities.. hmm
	- knight -> berserker (dark knight). how would I select from menu. techniques, knight. knight. techniques. 


- modifying my own menu...  the reason why I wouldn't just always go for top abilities...
	- plus complexity to track. 
	- add charge to the menu chain. then I can go down either route. and use up charge. the reason why you'd like em is to link effects. 
	- I didn't love the heat system
	- and I couldn't think of something coherent to prevent players from just whiz banging a chain down. I didn't want to arbitrarily make constraints.
	- what about the keyword system itself.... too much complexity?
- counterspell 
	- destroys self as a cost
	- investments into itself... 
	- little one offs
	- how would I crack things then... 
- how does this different from keyword system...
	- keyword system sought to modify the chain of actions you had available. or add buffs to the chain. so you'd build up actions in lower chains? and that'd be incentivized because it's easier to reach. and heat would build up. but ideally you'd want other things there.
	- you'd do things in your menu on the way to the top of the chain. so you'd seek to power it up?
- okay so menu chain
	- charger buff (requires you to select your buffs)
	- can hold magic menu to cast it faster. 
	- okay so maybe there's a queue where actions are happening
- okay so gameplay loop is basically juggling attacking, investing into menus so 


# Overview
- Players will build characters using souls. 
	- Souls are collections of actions that players will choose to allocate to limited slots
	- Souls can link to other souls using the slots and players will navigate through these souls like menus. Souls that are linked to get access to more complex actions that typically cost more AP, and typically are traits of the linked souls (knight + berserker = dark knight) for instance at a max of three combinations. 
- During combat, Combatants accrue Action Points over time.
- Players with select actions from their builds using AP.
- There are three types of actions
	- Attacks
		- These happen instantly 
		- These can delay/cancel magic by knocking back cast time (cast time will speed up though)
		- Variety of traits
		- Attacks that happen close together will combo which increases damage 
			- They will also delay break state recovery
	- Magic
		- These are casted asynchronously
		- They can shatter buffs
		- Variety of traits
	- Buffs
		- These happen instantly
		- Persist as additional windows around character
		- Variety of traits
			- They can range from simple stat buffs
			- To complex like being a summon that periodically performs an action and selecting the window lets you select the action it performs
			- They could provide alternate actions that are only accessible via that window
			- It can be a trigger where characters follow up actions with their own, or counter actions
		- Debuffs are attached to caster, so they can be shattered by caster or by enemies seeking to remove debuff
		- - Would you dance?  Shattering causes you to exceed to max AP and your character dances. 
	- Actions in general may feature conditions, or unique scaling, or other factors
- Enemies will also accrue AP and will typically perform a variety of actions (attack, magic, buff)
- Enemies will typically enter with some buffs applied. Sometimes these buffs will feature special conditions to shatter. 
	- When all of an enemies buffs are shattered they enter a break state where they take increased damaged
- Typically battles, will flow like this. Players will balance buffing, canceling enemy magic with attacks, shattering enemy windows with magic, and healing. 
	- Players will then shatter their own buffs to cast more powerful buffs, magic, or attacks when more AP is accrued or in response to enemy break states, or powerful incoming enemy actions. 
	- Perhaps buffs tend to work particularly well with own class?


## Flavor
- Core themes of the game is the distinction of 'letting go'. Sei believes letting go to lead to oblivion vs letting go to give way to new things. This is similar to accumulation of power and immortality which being a reaper effectively gives. 

# implementation
- [ ] implement magic
	- [ ] Magic needs to charge and then be casted (to give that selection bias feedback)
- [ ] implement enemy behavior
