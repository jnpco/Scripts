import os
import sys
import moviepy.editor as mp


def extract_audio(path, start=0, end=None):
    clip = mp.VideoFileClip(path).subclip(start, end)
    clip.audio.write_audiofile(os.path.splitext(path)[0] + '(audio).mp3')


'''
SAMPLE
for arg in sys.argv[1:]:
    extract_audio(arg, 0, 5)
'''
