import warnings
import json
import sys
import os

warnings.filterwarnings("ignore")

from music_matching import music_matching
from music_matching.recognize import FileRecognizer
from music_matching.recognize import MicrophoneRecognizer

# load config from a JSON file (or anything outputting a python dictionary)
with open("config.cnf") as f:
    config = json.load(f)

if __name__ == '__main__':

    analyzer = music_matching(config)

    # Fingerprint all the mp3's in the directory we give i
    analyzer.fingerprint_directory("D:/XLTN/music_matching/uploads", [".mp3"])
    # filename = sys.argv[1]
    # print(filename)
    # Recognize audio from a file
    song = analyzer.recognize(FileRecognizer, "./VoiceProcessing/web/controller/music_matching/uploads/emcuangayhomqua.mp3")
    # song = analyzer.recognize(MicrophoneRecognizer)
    print(song)
    # print(song["song_name"].replace("-", " "))