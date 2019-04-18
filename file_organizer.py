import os
import shutil

# make app with node and electron
# make json for config and group_config
# if dir not exists create dir
# include option subdirectory -inc. warning
# destination = group_config[config['.csv']['group']] //sample

group_config = {
    'document': {'destination': 'C:\\path\\to\\folder'},
    'image': {'destination': 'C:\\path\\to\\folder'},
    'video': {'destination': 'C:\\path\\to\\folder'},
    'audio': {'destination': 'C:\\path\\to\\folder'},
    'compressed': {'destination': 'C:\\path\\to\\folder'},
    'ebook': {'destination': 'C:\\path\\to\\folder'},
}

config = {
    # DOCUMENTS
    '.csv': {'group': 'document'},
    '.txt': {'group': 'document'},
    '.doc': {'group': 'document'},
    '.docx': {'group': 'document'},
    '.ppt': {'group': 'document'},
    '.pptx': {'group': 'document'},
    '.rtf': {'group': 'document'},
    '.vsd': {'group': 'document'},
    '.xls': {'group': 'document'},
    '.xlsx': {'group': 'document'},
    # IMAGE
    '.bmp': {'group': 'image'},
    '.gif': {'group': 'image'},
    '.ico': {'group': 'image'},
    '.jpeg': {'group': 'image'},
    '.jpg': {'group': 'image'},
    '.png': {'group': 'image'},
    '.svg': {'group': 'image'},
    '.tiff': {'group': 'image'},
    '.webp': {'group': 'image'},
    # VIDEO
    '.avi': {'group': 'video'},
    '.flv': {'group': 'video'},
    '.mkv': {'group': 'video'},
    '.mov': {'group': 'video'},
    '.mpeg': {'group': 'video'},
    '.mpg': {'group': 'video'},
    '.mp4': {'group': 'video'},
    '.ogv': {'group': 'video'},
    '.vob': {'group': 'video'},
    '.webm': {'group': 'video'},
    '.wmv': {'group': 'video'},
    '.3gp': {'group': 'video'},
    # AUDIO
    '.aac': {'group': 'audio'},
    '.aa': {'group': 'audio'},
    '.mp3': {'group': 'audio'},
    '.m4a': {'group': 'audio'},
    '.m4b': {'group': 'audio'},
    '.m4p': {'group': 'audio'},
    '.oga': {'group': 'audio'},
    '.wav': {'group': 'audio'},
    '.weba': {'group': 'audio'},
    '.mwa': {'group': 'audio'},
    # COMPRESSED
    '.bz': {'group': 'compressed'},
    '.bz2': {'group': 'compressed'},
    '.rar': {'group': 'compressed'},
    '.zip': {'group': 'compressed'},
    '.7z': {'group': 'compressed'},
    # EBOOK
    '.epub': {'group': 'ebook'},
    '.mobi': {'group': 'ebook'},
    '.pdf': {'group': 'ebook'}
}


def organize(path):
    files = os.listdir(path)
    os.chdir(path)

    for f in files:
        for file_type in config:
            group = config[file_type]['group']
            destination = group_config[group]['destination']
            if f.lower().endswith(file_type):
                print(f + ' -> ' + destination)
                if not os.path.exists(destination):
                    os.makedirs(destination)

                if os.path.isfile(os.path.join(destination, f)):
                    print('file exists')
                else:
                    shutil.move(f, destination)
                break


if __name__ == "__main__":
    organize('C:\\path\\to\\folder')
