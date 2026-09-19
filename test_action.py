"""Display-only integration test for Gemini's one-step visual planning."""
from __future__ import annotations

from pydantic import ValidationError

from ai.gemini import GeminiComputerAgent
from ai.schemas import validate_action_coordinates
from vision.screenshot import capture_screen

TEST_COMMAND = (
    "Look at the current screen and identify a visible UI element that could be "
    "interacted with. Do not perform any action."
)


def main() -> int:
    try:
        screen = capture_screen()
    except Exception as exc:
        print(f"Screenshot error: {exc}")
        return 1

    print("--------------------------------")
    print("CURRENT SCREEN")
    print("--------------------------------")
    print(f"Resolution: {screen.width}x{screen.height}")

    try:
        action = GeminiComputerAgent().analyze_screen(TEST_COMMAND, screen.image)
        validate_action_coordinates(action, screen.width, screen.height)
    except ValidationError as exc:
        print(f"Malformed Gemini action: {exc}")
        return 1
    except ValueError as exc:
        print(f"Validation/configuration error: {exc}")
        return 1
    except RuntimeError as exc:
        print(f"Gemini API error: {exc}")
        return 1

    print("\n--------------------------------")
    print("GEMINI ACTION")
    print("--------------------------------")
    print(f"Action: {action.action.value}")
    for field, label in (("x", "X"), ("y", "Y"), ("text", "Text"), ("key", "Key"), ("keys", "Keys"), ("amount", "Amount")):
        value = getattr(action, field, None)
        if value is not None:
            print(f"{label}: {value}")
    print(f"Reason: {action.reason}")
    print("\n--------------------------------")
    print("VALIDATION")
    print("--------------------------------")
    print("VALID ACTION")
    print("--------------------------------")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
