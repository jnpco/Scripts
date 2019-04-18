import gtts
from extract_pdf_text import extract_pdf_text


def extract_pdf_audio(src, output):
    tts = gtts.gTTS(text=extract_pdf_text(src, r'[\w .,!?]'), lang='en')
    tts.save(output)


extract_pdf_audio('./test.pdf', './test.mp3')
