# Announcing Attacks with Windows
- Window similar to announcing attack announcing attacks in anime?
	- make it bold and shit and have special effects



## Visual Filters & Screen Effects
- Chromatic abberation filter
- Pixelated Filter
- Mostly darkness...
  - Attacks light up the character
  - Rim Lighting
- Big attacks can effect lighting
- Screen gags. Arms that reach in and aids Makima
- Crack the Screen
- Screen fades to black and characters get fucked up
- crack the display screen?
- Psycho Eyes  - Fish Eye Lens
- CRT TV
- Vignettes
- Depth shader
- Film grain
- shockwave
- Impact frame shader
- Heart background

---

## Lighting System
- Shadow filters
- Lighting Effects
  - Passing Streetlamps
  - Dappled Lighting
  - The light from a cafe window shining onto their faces.
- Point is Flashlight, Reveal Hidden Things in World
- Rim Lighting
- Normal Maps
  - For 2D lighting

---

## Particles & Environmental Effects
- Particle Effects Sunrays
- Foreground Elements
  - Falling leaves, snow
- Chidori Birds
- mourning doves
- Bomb actually flies at your face as it gets thrown at you.

---

## Text, UI Text, and Typography Effects
- Text
  - Frenzy Text
- Godot glitch text for curses
- Attack name appearing behind character

---

## Character Visuals & Expression
- Eye shaders
  - Emotions as response to parameters.
- Madara Eyes
- Eyes Flashing
- Donkey Kong Eyes popping out
  - memes?
- eye twitch emoji
- Flow state hair flying back
- nose bleeds. Crying blood.
- Separate mouth and blink and hair.
- Feral Elise.
- The zone eyes
- Spiritual Pressure
- Elements can be associated with certain things. Electricity in the eyes with flow. Fire with anger.
- Instead of just flat color effects they’re glow light sources like the Angel halo. Again these are representation of how they survive and see themselves. Lacking empathy causes these lights to disappear.

---

## Animation Systems
- load up animations
- flow animations
- hit animations
- At high flow characters dance.
- Deku Multiple Punch
- Neji thousand palms
- Decoy trick. Itachi point right.
- Foreground hand sign that's blurred, ultimate attack fucks you up
- P4 Animated Cutins: https://www.youtube.com/watch?v=1Hoo8ToA28Y

---

## Combat Feedback & Damage Scaling
- Reactions should scale from damage
- Bones break, characters moan, gurgling
- Parameters trigger specials. Normal gameplay and something cool happens when high damage.
- Hit Stop - Time delays on finisher
- Small delay before health starts ticking

---

## Camera & Cinematography
- Poses should have good sillohuettes
- Move camera around to emphasize hits
- Action -> REACTION
- Maybe characters have moves that can stabilize camera?
- Short guy, camera pans down
- Reward skill expression with different animations.
- Time dilation
- Incorporate cinematography somehow like persona 5s.
- Music stops when OP character easily deflects your attack

---

## Audio & Music Juice
- JUICE: Music changes during deep combos
- Music stops when OP character easily deflects your attack

---

## Menus & UI Systems
- Persona 5 Menus
- Menus close one at a time instead of at once.
- By stacking layers, you can add a ton of depth to environments and even interface elements. One of my personal favorites is to add a nearly-transparent "dust layer" that mostly just drifts about, but responds to nearby movement and/or u interactions.

---

## Effect Trigger / Event System
- effect notices
  - when things happen
    - select
    - execution (caster independent)
    - reaction
  - what can happen
    - camera movement
    - sprite animations
      - sprite effects (squash, flash)
      - dialogue
    - lights
    - particles
    - screen side shaders
    - sound effects
    - voice lines

---



---

## Tools & Pipelines
- Create a Unity VFX tool in Browser... and cutscene generator... something like cinemachine : D
- review how unity creates particles
- review nebula tool
- review nebula js code
- decide if i want to just port nebula

---

## Research & Technical References
### three quarks research
- https://github.com/Alchemist0823/three.quarks/blob/0a891c33b2c3952e3375de4aee0255e719bfa811/packages/three.quarks/src/ParticleSystem.ts#L760
- https://github.com/Alchemist0823/three.quarks/blob/0a891c33b2c3952e3375de4aee0255e719bfa811/packages/three.quarks/src/QuarksLoader.ts#L144
- other guy particle emitter.
  - https://github.com/simondevyoutube/ThreeJS_Tutorial_ParticleSystems/blob/master/main.js

---

## Sprite Shadows & 2D/3D Integration
- https://drei.docs.pmnd.rs/misc/html
- https://stackoverflow.com/questions/37198800/three-js-how-to-let-transparent-png-sprites-cast-and-receive-shadows
- https://codesandbox.io/p/sandbox/threejs-cloth-animation-example-sz691
- https://github.com/pmndrs/drei/blob/10aa60f0427392872f9abb861789ad0931f8ef94/src/web/Html.tsx#L457
- what is difference between raycast and blending
- https://blog.7linternational.com/drei-spriteanimator-the-bridge-between-2d-and-3d-fcf5f3805c0f

---

## Nebula / Three.js Discussion
- https://github.com/pmndrs/react-three-fiber/discussions/1658
- https://www.reddit.com/r/gamedev/comments/1fcyqhz/using_threejs_as_a_game_engine_and_my_particle/

---
## Shader Learning & Experiments
- LEARN SHADERS
  - Pixelated Effect
  - Mix and Jam Balatro
- Freya Shader chick
- https://www.youtube.com/@kextex/shorts
- https://godotshaders.com/shader/vhs-and-crt-monitor-effect/
- Spiritual pressure shader
## Juice & Game Feel
- Balatro Pageantry of Combos
- Health Bar Juice
  - https://www.youtube.com/watch?v=YEZXVK1-tlU&t=438s
- There are also a ton of animation tricks, and even lighting tricks to make sprites look 3D. Terraria, for example, gets loads of mileage out of their sprites by tinkering with shaders

---

## Inspiration & References
- persona 3 reload - https://www.youtube.com/watch?v=Z4VcLrPs1Y8
- random guy showcase - https://www.youtube.com/watch?v=Qt4KOrRSQ3I
  - another cool showcase - https://www.youtube.com/watch?v=Lh1FfOF0ibc
- honkai third rail ults - https://www.youtube.com/watch?v=DT4T5gW0Ajw
- zzz ults - https://www.youtube.com/watch?v=SI2_obO15zM
- zzz combat - https://www.youtube.com/watch?v=5LolsMA_rco
- edom games effects - https://www.youtube.com/watch?v=PGfmhnFsu9U&list=WL&index=1
- simondev - https://www.youtube.com/watch?v=OFqENgtqRAY&list=WL&index=2
- so you wanna make games - https://www.youtube.com/watch?v=3QKK2o5rWSQ&list=WL&index=2
- gamma emerald - https://www.youtube.com/watch?v=gVL-otE_mYU&list=WL&index=5
  - trainer battles - https://www.youtube.com/watch?v=gVL-otE_mYU&list=WL&index=6
- unity particles - https://www.youtube.com/watch?v=FEA1wTMJAR0&list=WL&index=4
- godot particle system - https://www.youtube.com/watch?v=F1Fyj3Lh_Pc&list=WL&index=1
