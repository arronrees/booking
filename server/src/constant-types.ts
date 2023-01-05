export interface JsonApiResponse {
  success: boolean;
  data?: [] | {} | string;
  error?: string;
}
