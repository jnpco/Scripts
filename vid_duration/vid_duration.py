'''
Install pymediainfo w/ pip install pymediainfo.
Run script to check combined duration of all videos in a directory and it's sub directory.
'''

import os
import sys
import datetime
from pymediainfo import MediaInfo

duration = 0
print(sys.argv)
for arg in sys.argv[1:]:
    for root, dirs, files in os.walk(arg):
        for file in files:
            vid_info = MediaInfo.parse(os.path.join(root, file))
            for track in vid_info.tracks:
                if track.track_type == 'Video':
                    duration += track.duration
                    print(file, "\t Duration: {} secs".format(
                        track.duration / 1000))

mins, secs = divmod(duration / 1000, 60)
hours, mins = divmod(mins, 60)
days, hours = divmod(hours, 24)

print('\nTotal duration (D:H:M:S): {}:{}:{}:{}'.format(int(days),
                                                       int(hours), int(mins), int(secs)))
