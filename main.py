from __future__ import annotations
import logging,os,threading,time
from pathlib import Path
from dotenv import load_dotenv
from ai.gemini import GeminiComputerAgent
from ai.schemas import ActionBase,ActionName
from vision.screenshot import ScreenImage,capture_screen
from vision.screen_change import wait_for_screen_update
from control import mouse,keyboard,windows
from system.terminal import run_safe_command
from security.permissions import requires_confirmation
load_dotenv();Path("logs").mkdir(exist_ok=True)
logging.basicConfig(filename="logs/controller.log",level=logging.INFO,format="%(asctime)s %(levelname)s %(message)s")

class Controller:
    def __init__(self,on_event=lambda *_:None,on_screen=lambda *_:None,on_confirmation=lambda *_:False):
        self.on_event,self.on_screen,self.on_confirmation=on_event,on_screen,on_confirmation;self.stop_event=threading.Event();self.max_steps=int(os.getenv("MAX_STEPS","30"))
    def stop(self):self.stop_event.set();self.on_event("STOPPED")
    def _execute(self,a:ActionBase):
        if a.action==ActionName.CLICK:mouse.click(a.x,a.y)
        elif a.action==ActionName.DOUBLE_CLICK:mouse.double_click(a.x,a.y)
        elif a.action==ActionName.RIGHT_CLICK:mouse.right_click(a.x,a.y)
        elif a.action==ActionName.MOVE:mouse.move(a.x,a.y)
        elif a.action==ActionName.TYPE:keyboard.type_text(a.text)
        elif a.action==ActionName.KEY:keyboard.press_key(a.key)
        elif a.action==ActionName.HOTKEY:keyboard.hotkey(a.keys)
        elif a.action==ActionName.SCROLL:mouse.scroll(a.amount)
        elif a.action==ActionName.OPEN_APPLICATION:windows.open_application(a.application)
        elif a.action==ActionName.SYSTEM_COMMAND:run_safe_command(a.command)
        elif a.action==ActionName.WAIT:time.sleep(a.seconds)
    def run_task(self,command:str):
        # Global listener remains active while Gemini/network work runs in this thread.
        from pynput import keyboard as pynput_keyboard
        pressed=set()
        def down(key):
            pressed.add(key)
            if key==pynput_keyboard.Key.f12 and any(k in pressed for k in (pynput_keyboard.Key.ctrl_l,pynput_keyboard.Key.ctrl_r)) and any(k in pressed for k in (pynput_keyboard.Key.shift,pynput_keyboard.Key.shift_l,pynput_keyboard.Key.shift_r)):
                self.stop()
        def up(key): pressed.discard(key)
        listener=pynput_keyboard.Listener(on_press=down,on_release=up);listener.start()
        agent=GeminiComputerAgent();history=[];screen=capture_screen();self.on_screen(screen);self.on_event("RUNNING")
        repeats=0;last_signature=None
        for step in range(1,self.max_steps+1):
            if self.stop_event.is_set(): listener.stop();return
            action=agent.analyze_screen(command,screen.image,history)
            # An emergency stop can arrive while the API request is in flight.
            if self.stop_event.is_set(): listener.stop();return
            self.on_event(f"Step {step}/{self.max_steps}: {action.action.value} — {action.reason}")
            if action.action==ActionName.DONE:self.on_event("COMPLETED");listener.stop();return
            if requires_confirmation(action) and not self.on_confirmation(action.reason or "This action may modify your system."):
                self.on_event("PAUSED: confirmation declined");listener.stop();return
            if action.action==ActionName.ASK_CONFIRMATION:
                self.on_event("PAUSED: model requested confirmation");listener.stop();return
            signature=action.model_dump_json();repeats=repeats+1 if signature==last_signature else 0;last_signature=signature
            if repeats>=3:self.on_event("PAUSED: repeated action without progress");listener.stop();return
            self._execute(action);history.append({"action":action.action.value,"reason":action.reason})
            # This returns a newly captured image even after timeout; stale image is never reused.
            screen=wait_for_screen_update(screen);self.on_screen(screen)
        self.on_event("PAUSED: maximum step limit reached");listener.stop()

if __name__=="__main__":
    from gui.app import run
    run()
