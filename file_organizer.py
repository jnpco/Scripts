import os
import shutil

# make json for config and group_config
# if dir not exists create dir
# include option subdirectory -inc. warning
# destination = group_config[config['.csv']['group']] //sample

group_config = {
    'document': {'destination': r'C:\Users\jnpco\Desktop\test\document'},
    'image': {'destination': r'C:\Users\jnpco\Desktop\test\images'},
    'video': {'destination': r'C:\Users\jnpco\Desktop\test\videos'},
    'audio': {'destination': r'C:\Users\jnpco\Desktop\test\music'},
    'compressed': {'destination': r'C:\Users\jnpco\Desktop\test\compressed'},
    'ebook': {'destination': r'C:\Users\jnpco\Desktop\test\ebooks'},
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
    '.txt': {'group': 'document'},
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
