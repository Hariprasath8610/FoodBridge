import os,time
from PIL import Image,ImageChops,ImageStat
from .screenshot import ScreenImage,capture_screen
def has_screen_changed(previous:ScreenImage|Image,current:ScreenImage|Image,threshold:float|None=None)->bool:
    before=previous.image if isinstance(previous,ScreenImage) else previous; after=current.image if isinstance(current,ScreenImage) else current
    if before.size!=after.size:return True
    before=before.convert("RGB").resize((128,72)); after=after.convert("RGB").resize((128,72))
    score=sum(ImageStat.Stat(ImageChops.difference(before,after)).mean)/3
    return score >= (threshold if threshold is not None else float(os.getenv("SCREEN_CHANGE_THRESHOLD","2.0")))
def wait_for_screen_update(previous_screenshot:ScreenImage)->ScreenImage:
    delay=float(os.getenv("POST_ACTION_DELAY","0.5")); interval=float(os.getenv("SCREEN_CHECK_INTERVAL","0.25")); timeout=float(os.getenv("SCREEN_CHANGE_TIMEOUT","5"))
    time.sleep(max(0,delay)); deadline=time.monotonic()+max(0,timeout); latest=capture_screen()
    while not has_screen_changed(previous_screenshot,latest) and time.monotonic()<deadline:
        time.sleep(max(.05,interval)); latest=capture_screen()
    return latest
