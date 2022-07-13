export interface CertificateErrorPageProps {
  webContentsId: number;
  browserId: string;
  fingerprint: string;
  reload: () => void;
}
