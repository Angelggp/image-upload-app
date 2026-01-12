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

  download: async (filename: string): Promise<Blob> => {
    const response = await apiClient.get(`/images/download/${filename}`, {
      responseType: "blob"
    });
    return response.data;
  }
};

export default apiClient;
