import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Video {
  id: number;
  nombre: string;
  url_video: string;
  url_img: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Aleflix';
  videos: Video[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadVideos();
  }

  loadVideos() {
    this.http.get<Video[]>('assets/videos.json').subscribe({
      next: (data) => {
        console.log(data);
        this.videos = data;
      },
      error: (error) => {
        console.error('Error cargando videos:', error);
      }
    });
  }

  playVideo(video: Video) {
    console.log('Reproducir video:', video.nombre);
    
    // Convertir URL de Google Drive para mejor reproducción
    const videoUrl = video.url_video.replace('/view?usp=drive_link', '/preview');
    window.open(videoUrl, '_blank');
  }
}
