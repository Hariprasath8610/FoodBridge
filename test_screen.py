from google import genai
from PIL import Image
import mss


def main() -> None:
    with mss.MSS() as sct:
        screenshot = sct.grab(sct.monitors[1])
        image = Image.frombytes("RGB", screenshot.size, screenshot.rgb)
    response = genai.Client().models.generate_content(
        model="gemini-3.7-flash",
        contents=[
            "Describe what is currently visible on my screen. "
            "Identify the main application/window and important visible UI elements.",
            image,
        ],
    )
    print("\n--- GEMINI SCREEN ANALYSIS ---\n")
    print(response.text)


if __name__ == "__main__":
    main()
