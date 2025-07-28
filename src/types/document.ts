export interface Document {
  doc_id: string;
  title: string;
  category: string;
  chunks_count: number;
  file_size?: number;
  file_type?: string;
  upload_date?: string;
  is_active?: boolean;
}

export interface DocumentInfo {
  doc_id: string;
  file_name: string;
  file_path: string;
  category: string;
  chunks_count: number;
  file_size: number;
  processed_at: string;
}

export interface UploadResponse {
  success: boolean;
  message?: string;
  doc_info?: DocumentInfo;
  error?: string;
}

export interface DocumentsResponse {
  documents: Document[];
  total_count: number;
}

export interface DeleteDocumentResponse {
  success: boolean;
  message: string;
}

export interface ReindexResponse {
  success: boolean;
  message: string;
}