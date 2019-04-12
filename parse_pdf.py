import PyPDF2
import os
import gtts
import re


def extract_text(path, regex=None):
    if(os.path.exists(path) is False):
        return None
    else:
        words = ''
        with open(path, 'rb') as f:
            pdf_file = PyPDF2.PdfFileReader(f)

            for page_no in range(pdf_file.numPages):
                page = pdf_file.getPage(page_no)
                page_content = page.extractText()

                if(regex is not None):
                    words += filter_text(page_content, regex)
                else:
                    words += page_content

        return words


def filter_text(unfiltered, regex=r'[\w .,!?]'):
    filtered = re.findall(regex, unfiltered)
    filtered_text = ''

    for text in filtered:
        filtered_text += text

    return filtered_text


tts = gtts.gTTS(text=extract_text('./test.pdf', r'[\w .,!?]'), lang='en')
tts.save('./test.mp3')
