import PyPDF2
import os
from filter_text import filter_text

# Todo Add page_start and page_end


def extract_pdf_text(path, regex=None):
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


if __name__ == "__main__":
    print(extract_pdf_text('./test.pdf'))
