from dataclasses import dataclass
from PIL import Image
import mss
@dataclass(frozen=True)
class ScreenImage:
    image:Image.Image; width:int; height:int
def _capture(monitor:dict)->ScreenImage:
    try:
        with mss.MSS() as sct:
            shot=sct.grab(monitor); image=Image.frombytes("RGB",shot.size,shot.bgra,"raw","BGRX")
            return ScreenImage(image,image.width,image.height)
    except Exception as exc: raise RuntimeError(f"Screen capture failed: {exc}") from exc
def capture_screen()->ScreenImage:
    with mss.MSS() as sct: monitor=sct.monitors[1]
    return _capture(monitor)
def capture_region(x:int,y:int,width:int,height:int)->ScreenImage:
    if width<=0 or height<=0: raise ValueError("Region dimensions must be positive")
    return _capture({"left":x,"top":y,"width":width,"height":height})
