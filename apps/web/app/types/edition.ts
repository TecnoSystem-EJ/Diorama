export interface Edition {
  id: string;
  number: string;
  title: string; 
  coverUrl: string;
  pdfUrl: string | null;
  documentsCount: number;
}
