# r e a p er

http://tunaphish.github.io/reaper


# Patterns

## UI 
Game uses HTML + CSS to create and style UI elements. Because it's a JRPG UI navigation ends up being the majority of the game. 

1. HTML can be generated via JSX syntax for ease of creation and visibility. CSS is styled with CSS modules. 
2. Behavior can be attached after attaching the UI to the UI manager plugin. The plugin simply places and replaces one HTML dom element per scene. This means event listeners have to be attached after adding to the UI manager.  

# Deploy
1. npm run build:prod
2. npm run deploy
