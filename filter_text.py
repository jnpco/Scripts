import re


def filter_text(unfiltered, regex=r'[\w .,!?]'):
    filtered = re.findall(regex, unfiltered)
    filtered_text = ''

    for text in filtered:
        filtered_text += text

    return filtered_text


if __name__ == "__main__":
    print(filter_text('@$test$@_ something@$@ @@#12345'))
