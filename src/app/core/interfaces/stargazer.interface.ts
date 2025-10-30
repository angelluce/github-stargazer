export interface Stargazer {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  starred_at?: string;
}

export interface StargazerApiResponse {
  starred_at: string;
  user: {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
    [key: string]: any; // Para otros campos que no usamos
  };
}
