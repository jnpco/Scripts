'''
Install pymediainfo w/ pip install pymediainfo.
Run script to check combined duration of all videos in a directory and it's sub directory.
'''

import os
from pymediainfo import MediaInfo

duration = 0

for root, dirs, files in os.walk(''):
    for file in files:
        vid_info = MediaInfo.parse(os.path.join(root, file))
        for track in vid_info.tracks:
            if track.track_type == 'Video':
                duration += track.duration
                print(file, "\t Duration: {} secs".format(track.duration / 1000))

print('\nTotal: {} secs'.format(duration / 1000))
