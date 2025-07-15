import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  currentVideo: Video | null = null;
  showPlayer = false;
  safeVideoUrl: SafeResourceUrl | null = null;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

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
    
    // Abrir en nueva pestaña como alternativa
    const videoUrl = video.url_video.replace('/view?usp=drive_link', '/preview');
    window.open(videoUrl, '_blank');
    
    // Opcional: mantener modal con mensaje
    this.currentVideo = video;
    this.showPlayer = true;
  }

  // Convertir URL de Google Drive para reproducción
  getVideoUrl(url: string): string {
    if (url.includes('drive.google.com')) {
      const fileId = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (fileId) {
        return `https://drive.google.com/file/d/${fileId[1]}/preview`;
      }
    }
    return url;
  }

  closePlayer() {
    this.showPlayer = false;
    this.currentVideo = null;
    this.safeVideoUrl = null;
  }

  // Método para manejar errores del video
  onVideoError(event: any) {
    console.error('Error reproduciendo video:', event);
    alert('Error al cargar el video. Verifica que el archivo sea público y accesible.');
  }

  // Método para obtener URL de descarga directa
  getDirectDownloadUrl(url: string): string {
    if (url.includes('drive.google.com')) {
      const fileId = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (fileId) {
        // Usar formato que bypassa la verificación de virus
        return `https://drive.google.com/uc?export=download&id=${fileId[1]}&confirm=t`;
      }
    }
    return url;
  }
}
