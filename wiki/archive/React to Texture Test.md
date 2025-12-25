---
date: 2025-12-25
---
# react -> texture test
- can i apply shaders to html css via drei?... I think so right lmao
	- balatro shaders - https://www.youtube.com/watch?v=I1dAZuWurw4&t=53s
	- https://godotshaders.com/shader/balatro-fire-shader/
- [ ] don't know size
- [ ] pixelated 
	- https://discourse.threejs.org/t/lets-solve-pixelated-svg-texture-rendering-in-three-js/30819
	- https://discourse.threejs.org/t/render-canvas-context2d-content-into-some-threejs-renderer-object/37565
	- https://github.com/pmndrs/drei/blob/39ef36bb2fb029c4f4f6d0416a93163ee3ae00db/src/web/Html.tsx#L120
- [ ] not reactive
- [ ] https://github.com/lukehorvat/computed-style-to-inline-style
- [x] how does lume create 3d components

# Resources
- https://www.reddit.com/r/webgl/comments/k5lbuq/rendering_html_in_webgl_demo/
- https://github.com/gnikoloff/html-to-webgl-demo/blob/04ce06bdcd091b21a40d3d5186679697b77d2453/app/index.js#L52
- https://discourse.threejs.org/t/lets-solve-pixelated-svg-texture-rendering-in-three-js/30819
- https://discourse.threejs.org/t/problem-rendering-svg-to-texture/22626

## not reactive
- tried hack where i update time every frame in component
- tried test where i do onclick but i'm stupid and forgot that it's just a texutre now : )
- FUCKING z-INDEX IS WHY I CAN"T USE ORBIT CONTROLS FUCK

# Conclusion
- it's janky and not supported... better to just bite the bullet and start writing the game in godot (or do something else than this)