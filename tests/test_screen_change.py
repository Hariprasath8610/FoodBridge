from PIL import Image
from vision.screen_change import has_screen_changed
def test_detects_large_change():assert has_screen_changed(Image.new("RGB",(100,100),"black"),Image.new("RGB",(100,100),"white"))
def test_tolerates_tiny_change():assert not has_screen_changed(Image.new("RGB",(100,100),"black"),Image.new("RGB",(100,100),(1,1,1)))
