import os
import PyPDF2


def split_pdf(path, output_path=''):
    filename = os.path.splitext(os.path.basename(path))[0]
    pdf = PyPDF2.PdfFileReader(path)

    for page in range(pdf.getNumPages()):
        writer = PyPDF2.PdfFileWriter()
        writer.addPage(pdf.getPage(page))

        output_filename = os.path.join(
            output_path, '{}_p{}.pdf'.format(filename, page+1))
        with open(output_filename, 'wb') as page:
            writer.write(page)

        print('Created: {}'.format(output_filename))


if __name__ == '__main__':
    path = './pdf_demo/demo.pdf'
    split_pdf(path)
