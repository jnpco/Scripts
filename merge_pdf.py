import sys
import PyPDF2


def merge_pdf(input_paths, output_path):
    file_merger = PyPDF2.PdfFileMerger()

    for path in input_paths:
        file_merger.append(path)

    with open(output_path, 'wb') as merged:
        file_merger.write(merged)


if __name__ == '__main__':
    paths = ['./pdf_demo/demo.pdf',
             './pdf_demo/demo.pdf',
             './pdf_demo/demo.pdf']
    merge_pdf(paths, './pdf_demo/merged.pdf')
