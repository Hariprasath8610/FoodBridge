from google import genai


def main() -> None:
    response = genai.Client().models.generate_content(
        model="gemini-3.7-flash", contents="Say hello in one sentence."
    )
    print(response.text)


if __name__ == "__main__":
    main()
