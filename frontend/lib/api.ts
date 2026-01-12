import axios, { AxiosProgressEvent } from "axios";
import { API_BASE_URL } from "@/config/constants";
import { ImageData } from "@/types";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data"
  }
});

export interface UploadResponse {
  id: string;
  file_url: string;
  filename: string;
  size: number;
  created_at: string;
}

export interface DownloadResponse {
  download_url: string;
  filename: string;
}

export const imageApi = {
  upload: async (
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ImageData> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<UploadResponse>(
      "/images/upload/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total && onProgress) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(progress);
          }
        }
      }
    );

    return response.data;
  },

  download: async (imageId: string): Promise<{ blob: Blob; filename: string }> => {
    try {
      // Paso 1: Obtener la URL de descarga desde Django
      const infoResponse = await apiClient.get<DownloadResponse>(
        `/images/download/${imageId}/`
      );
      
      const { download_url, filename } = infoResponse.data;

      // Paso 2: Descargar el archivo desde Cloudinary
      const fileResponse = await axios.get(download_url, {
        responseType: "blob"
      });

      return {
        blob: fileResponse.data,
        filename: filename
      };
    } catch (error) {
      console.error('Error in download API:', error);
      throw error;
    }
  }
};

export default apiClient;
