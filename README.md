# Gemini Screen AI Controller

A Windows PySide6 desktop controller that sends the current in-memory MSS screenshot plus your command to Gemini, validates exactly one Pydantic action, executes it locally, then captures a fresh screen before the next decision.

## Install

```powershell
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
# GEMINI_API_KEY must be set in the Windows environment
python main.py
```

Gemini is the only AI/vision model. The current official `google-genai` SDK receives the PIL screenshot and returns JSON constrained by the `ActionResponse` schema. The model can only plan; PyAutoGUI and native Windows launching execute locally.

## Safety and operation

Every cycle is `capture → Gemini → validate one action → execute → wait/poll → fresh capture`. Screen comparisons tolerate minor rendering noise but always return a newly captured screenshot after timeout. Coordinates are bounded to the physical screen. The run stops after `MAX_STEPS` (default 30) or after repeated identical actions. Dangerous terminal commands require GUI confirmation; common applications are allowlisted.

The UI runs the controller in a worker thread, previews the exact screenshot supplied to Gemini, and logs actions. Click **STOP** to stop new actions. The global emergency hotkey is **Ctrl+Shift+F12**; PyAutoGUI's top-left-corner fail-safe is also enabled.

Example commands: `Open Notepad`, `Open Calculator`, `Open Notepad and type Hello World`, `Scroll down`.

## Tests

```powershell
pytest
```

Limitations: visual automation depends on a visible unlocked desktop, DPI scaling can affect coordinate matching, and a valid Gemini key/network connection is required. Do not give it commands that could expose sensitive data.
