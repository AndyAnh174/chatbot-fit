import { API_ENDPOINTS, getAuthHeaders } from '../config';
import { 
  Document, 
  DocumentsResponse, 
  UploadResponse, 
  DeleteDocumentResponse, 
  ReindexResponse 
} from '../types/document';

export class DocumentService {
  static async getDocuments(token?: string): Promise<Document[]> {
    try {
      const response = await fetch(API_ENDPOINTS.ADMIN_DOCUMENTS, {
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }

      const data: DocumentsResponse = await response.json();
      return data.documents;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  }

  static async uploadDocument(
    file: File, 
    category: string = 'RTIC General',
    token?: string
  ): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);

      const response = await fetch(API_ENDPOINTS.ADMIN_UPLOAD, {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: formData,
      });

      const data: UploadResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  static async deleteDocument(docId: string, token?: string): Promise<boolean> {
    try {
      const response = await fetch(API_ENDPOINTS.ADMIN_DELETE_DOCUMENT(docId), {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      const data: DeleteDocumentResponse = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  static async reindexDocuments(token?: string): Promise<boolean> {
    try {
      const response = await fetch(API_ENDPOINTS.ADMIN_REINDEX, {
        method: 'POST',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        throw new Error('Failed to reindex documents');
      }

      const data: ReindexResponse = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error reindexing documents:', error);
      throw error;
    }
  }
}