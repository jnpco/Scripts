import re


def filter_text(unfiltered, regex=r'[\w .,!?]'):
    filtered = re.findall(regex, unfiltered)
    filtered_text = ''

    for text in filtered:
        filtered_text += text

    return filtered_text
