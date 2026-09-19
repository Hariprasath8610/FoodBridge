import pyautogui
pyautogui.PAUSE=.08; pyautogui.FAILSAFE=True
def _point(x:int,y:int)->tuple[int,int]:
    width,height=pyautogui.size()
    if not 0<=x<width and 0<=y<height: raise ValueError(f"Coordinate ({x},{y}) outside {width}x{height}")
    return x,y
def click(x:int,y:int):pyautogui.click(*_point(x,y))
def double_click(x:int,y:int):pyautogui.doubleClick(*_point(x,y))
def right_click(x:int,y:int):pyautogui.rightClick(*_point(x,y))
def move(x:int,y:int):pyautogui.moveTo(*_point(x,y))
def scroll(amount:int):pyautogui.scroll(amount)
