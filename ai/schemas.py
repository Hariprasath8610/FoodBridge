from __future__ import annotations
from enum import Enum
from typing import Annotated, Literal, Union
from pydantic import BaseModel, ConfigDict, Field

class ActionName(str, Enum):
    CLICK="click"; DOUBLE_CLICK="double_click"; RIGHT_CLICK="right_click"; MOVE="move"; TYPE="type"; KEY="key"; HOTKEY="hotkey"; SCROLL="scroll"; WAIT="wait"; OPEN_APPLICATION="open_application"; SYSTEM_COMMAND="system_command"; DONE="done"; ASK_CONFIRMATION="ask_confirmation"
class ActionBase(BaseModel):
    model_config=ConfigDict(extra="forbid")
    action: ActionName
    reason: str=Field(default="", max_length=1000)
class PointerAction(ActionBase):
    action: Literal[ActionName.CLICK,ActionName.DOUBLE_CLICK,ActionName.RIGHT_CLICK,ActionName.MOVE]
    x:int=Field(ge=0); y:int=Field(ge=0)
class TypeAction(ActionBase):
    action:Literal[ActionName.TYPE]; text:str=Field(min_length=1,max_length=5000)
class KeyAction(ActionBase):
    action:Literal[ActionName.KEY]; key:str=Field(min_length=1,max_length=32)
class HotkeyAction(ActionBase):
    action:Literal[ActionName.HOTKEY]; keys:list[str]=Field(min_length=1,max_length=5)
class ScrollAction(ActionBase):
    action:Literal[ActionName.SCROLL]; amount:int=Field(ge=-100,le=100)
class WaitAction(ActionBase):
    action:Literal[ActionName.WAIT]; seconds:float=Field(default=1.0,ge=0.1,le=10.0)
class OpenApplicationAction(ActionBase):
    action:Literal[ActionName.OPEN_APPLICATION]; application:str=Field(min_length=1,max_length=100)
class SystemCommandAction(ActionBase):
    action:Literal[ActionName.SYSTEM_COMMAND]; command:str=Field(min_length=1,max_length=1000)
class CompletionAction(ActionBase):
    action:Literal[ActionName.DONE,ActionName.ASK_CONFIRMATION]
ComputerAction=Annotated[Union[PointerAction,TypeAction,KeyAction,HotkeyAction,ScrollAction,WaitAction,OpenApplicationAction,SystemCommandAction,CompletionAction],Field(discriminator="action")]
class ActionResponse(BaseModel):
    model_config=ConfigDict(extra="forbid")
    next_action:ComputerAction


class GeminiAction(BaseModel):
    """SDK-compatible response contract; ``ActionResponse`` remains authoritative."""
    action: ActionName
    x: int | None = None
    y: int | None = None
    text: str | None = None
    key: str | None = None
    keys: list[str] | None = None
    amount: int | None = None
    seconds: float | None = None
    application: str | None = None
    command: str | None = None
    reason: str = ""


class GeminiActionResponse(BaseModel):
    next_action: GeminiAction

def parse_action(payload:str|dict)->ActionBase:
    return ActionResponse.model_validate_json(payload).next_action if isinstance(payload,str) else ActionResponse.model_validate(payload).next_action


def validate_action_coordinates(action: ActionBase, screen_width: int, screen_height: int) -> ActionBase:
    """Ensure pointer actions address a pixel in the screenshot supplied to Gemini."""
    if screen_width <= 0 or screen_height <= 0:
        raise ValueError("Screen dimensions must be positive")
    if isinstance(action, PointerAction) and not (0 <= action.x < screen_width and 0 <= action.y < screen_height):
        raise ValueError(
            f"{action.action.value} coordinates ({action.x}, {action.y}) are outside "
            f"the {screen_width}x{screen_height} screenshot"
        )
    return action
