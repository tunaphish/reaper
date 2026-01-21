// TODO: Multiple Saves
// localStorage.getItem("reaper:playersave")
const key = "reaper:playersave";

export class LocalStorageAdapter {
  save(data: PlayerSave): void {
    localStorage.setItem(key, JSON.stringify(data))
  }

  load(): PlayerSave {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  }
}