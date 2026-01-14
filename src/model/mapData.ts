export type MapData = {
  tilemapKey: string,
  tilesetTiledKey: string, // could this and phaser to array for multiple tileset references per tilemap
  tilesetPhaserKey: string,
  musicKey?: string,
  locationName: string,
}