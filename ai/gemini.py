from __future__ import annotations
import os, time
from typing import Any
from google import genai
from google.genai import types
from PIL import Image
from .prompts import SYSTEM_PROMPT
from .schemas import GeminiActionResponse, ActionBase, parse_action

class GeminiComputerAgent:
    """Gemini plans one visual action; it never executes one."""
    def __init__(self, api_key: str|None=None, model: str|None=None, retries:int=2):
        key=api_key or os.getenv("GEMINI_API_KEY")
        if not key: raise ValueError("GEMINI_API_KEY is not set in the Windows environment.")
        self.client=genai.Client(api_key=key); self.model=model or os.getenv("GEMINI_MODEL","gemini-3.7-flash"); self.retries=retries
    def analyze_screen(self, command:str, screenshot:Image.Image, history:list[dict[str,Any]]|None=None)->ActionBase:
        context="No previous actions." if not history else f"Recent actions (do not reuse coordinates): {history[-3:]}"
        for attempt in range(self.retries+1):
            try:
                response=self.client.models.generate_content(model=self.model, contents=[f"User goal: {command}\n{context}\nReturn the next action for THIS screenshot.", screenshot], config=types.GenerateContentConfig(system_instruction=SYSTEM_PROMPT,response_mime_type="application/json",response_json_schema=GeminiActionResponse.model_json_schema(),automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=True)))
                if not response.text: raise RuntimeError("Gemini returned no text")
                return parse_action(response.text)
            except Exception as exc:
                unavailable = getattr(exc, "code", None) == 503 or "503" in str(exc)
                if not unavailable or attempt == self.retries:
                    raise RuntimeError(f"Gemini analysis failed: {exc}") from exc
                time.sleep(.5 * (2 ** attempt))
