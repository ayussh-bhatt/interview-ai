import whisper
import sys
import json

def transcribe(audio_path):
    model = whisper.load_model("base")
    result = model.transcribe(audio_path)
    return result["text"]

if __name__ == "__main__":
    audio_path = sys.argv[1]
    text = transcribe(audio_path)
    print(json.dumps({ "text": text }))
