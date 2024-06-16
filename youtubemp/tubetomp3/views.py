from django.shortcuts import render
from django.http import FileResponse
from pytube import YouTube
from moviepy.editor import VideoFileClip
import os

def index(request):
    return render(request, 'tubetomp3/index.html')


# convert video
def download_youtube_video(url, output_path='tubetomp3/data'):
    yt = YouTube(url)
    video = yt.streams.filter(file_extension='mp4').get_highest_resolution()
    video.download(output_path=output_path)
    
    return f"{output_path}/{video.default_filename}"

def convert_video_to_mp3(file, output_path='tubetomp3/data'):  
    clip = VideoFileClip(file)
    
    audio_file = f'{output_path}/{os.path.basename(file)[:-4]}.mp3'
    clip.audio.write_audiofile(audio_file)
    clip.close()
    return audio_file

def convert(request):
    submittion = request.POST

    url = submittion['url']
    file_type = submittion['type']

    mp4 = True if file_type == 'mp4' else False
    donwloaded_file = download_youtube_video(url)
    converted_file = convert_video_to_mp3(donwloaded_file) if mp4 is False else donwloaded_file

    response = FileResponse(filename=converted_file)
    response['Content-Disposition'] = f'Attachment; filename="{os.path.basename(converted_file)}'

    os.remove(donwloaded_file)  
    if mp4 is False:
        os.remove(converted_file)

    return response




