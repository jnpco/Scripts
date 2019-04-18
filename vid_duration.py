import os
import sys
import datetime
from pymediainfo import MediaInfo

# Install pymediainfo using pip.
# Download the mediainfo dll, or add to path.
# Run script to check combined duration of all videos in a directory and it's subdirectories.
# TODO Add option to check just one file
# TODO Add option for non-recursive check


def get_vid_duration_dirs(dirs):
    total_duration = 0
    for dir in dirs:
        for root, dirs, files in os.walk(dir):
            for file in files:
                vid_info = MediaInfo.parse(os.path.join(root, file))
                for track in vid_info.tracks:
                    if track.track_type == 'Video':
                        total_duration += track.duration
                        print(file, "\t Duration: {} secs".format(
                            track.duration / 1000))

    mins, secs = divmod(total_duration / 1000, 60)
    hours, mins = divmod(mins, 60)
    days, hours = divmod(hours, 24)

    return (days, hours, mins, secs)


duration = get_vid_duration_dirs(sys.argv[1:])

days, hours, mins, secs = duration

print('\nTotal duration (D:H:M:S): {:0>2}:{:0>2}:{:0>2}:{:0>2}'.format(int(days),
                                                                       int(hours), int(mins), int(secs)))
