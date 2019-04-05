import os
import urllib
import random
import youtube_dl
from selenium import webdriver


def query(search):
    USER_AGENTS = [
        'Mozilla/5.0 (Windows; U; Windows NT 5.1; it; rv:1.8.1.11) Gecko/20071127 Firefox/2.0.0.11',
        'Mozilla/5.0 (iPad; CPU OS 8_4_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12H321 Safari/600.1.4',
        'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)',
        'Mozilla/5.0 (compatible; Konqueror/3.5; Linux) KHTML/3.5.5 (like Gecko) (Kubuntu)',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393'
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:11.0) Gecko/20100101 Firefox/11.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:53.0) Gecko/20100101 Firefox/53.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
    ]

    return 'https://www.youtube.com/results?search_query=' + urllib.parse.quote(search)


def getLinks(search, limit):
    driver = webdriver.Chrome('./chromedriver.exe')
    driver.get(query(search))
    links = driver.find_elements_by_xpath('//*[@id="video-title"]')

    ctr = 0
    data = []

    for link in links:
        if(ctr >= limit):
            break

        if(link.get_attribute('href') is None):
            continue
        else:
            data.append(
                {'title': link.text, 'href': link.get_attribute('href')})
            ctr += 1

    return data


data = getLinks('billie eilish', 5)

for datum in data:
    print(datum)
