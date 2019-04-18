import os
import urllib
import random
import youtube_dl
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

# Install youtube-dl and selenium using pip
# Download chrome webdriver in the same directory as this script.


def query(search):
    return 'https://www.youtube.com/results?search_query=' + urllib.parse.quote(search)


def getLinks(links, limit=1):
    ctr = 0
    data = []

    for link in links:
        if(ctr >= limit):
            break

        if(link.get_attribute('href') is None):
            continue
        else:
            data.append(
                {'title': link.text, 'url': link.get_attribute('href')})
            ctr += 1

    print(data)
    return data


def buildOptions(audio):
    ydl_opts = {'outtmpl': os.path.join(os.path.sep, '%(title)s.%(ext)s')}

    if audio == True:
        ydl_opts['format'] = 'bestaudio/best'
        ydl_opts['postprocessors'] = [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192'
        }]

    return ydl_opts


def download(links, audio=False, folder_name=None):
    if folder_name is not None:
        if not os.path.exists(folder_name):
            os.makedirs(folder_name)

    with youtube_dl.YoutubeDL(buildOptions(audio)) as ydl:
        for link in links:
            ydl.download([link['url']])


if __name__ == "__main__":
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

    opts = Options()
    opts.add_argument('user-agent=' + random.choice(USER_AGENTS))
    driver = webdriver.Chrome('./chromedriver.exe', options=opts)
    driver.get(query('mundo 4 of spades'))
    download(getLinks(driver.find_elements_by_xpath(
        '//*[@id="video-title"]')), True)
    driver.quit()
