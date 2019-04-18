import os
import sys
import moviepy.editor as mp

# Install moviepy using pip.


def extract_audio(path, start=0, end=None, output_filepath=None, prefix='', suffix='', filetype='mp3'):
    clip = mp.VideoFileClip(path).subclip(start, end)

    if output_filepath is None:
        output_filepath = os.path.dirname(path)
    output_filename = os.path.basename(path)

    clip.audio.write_audiofile(os.path.join(
        output_filepath, prefix + os.path.splitext(output_filename)[0] + suffix + '.' + filetype))


if __name__ == "__main__":
    for arg in sys.argv[1:]:
        extract_audio(arg, 0, 5)
