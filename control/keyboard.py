import pyautogui
_KEYS={"ENTER":"enter","ESC":"esc","TAB":"tab","CTRL":"ctrl","ALT":"alt","SHIFT":"shift","WIN":"win","BACKSPACE":"backspace","DELETE":"delete","UP":"up","DOWN":"down","LEFT":"left","RIGHT":"right","SPACE":"space"}
def _key(key:str)->str:
    value=_KEYS.get(key.upper(),key.lower())
    if value not in pyautogui.KEYBOARD_KEYS:raise ValueError(f"Unsupported key: {key}")
    return value
def type_text(text:str):pyautogui.write(text,interval=.01)
def press_key(key:str):pyautogui.press(_key(key))
def hotkey(keys:list[str]):pyautogui.hotkey(*[_key(k) for k in keys])
