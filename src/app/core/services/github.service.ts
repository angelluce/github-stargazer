import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EMPTY, expand, map, Observable, reduce} from 'rxjs';
import {RepoInfo} from '../interfaces/repo-info.interface';
import {Stargazer, StargazerApiResponse} from '../interfaces/stargazer.interface';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private readonly API_URL = 'https://api.github.com';
  private readonly PER_PAGE = 100;
  private readonly http = inject(HttpClient);

  /**
   * Extrae owner y repo de una URL de GitHub
   * Acepta formatos:
   * - https://github.com/owner/repo
   * - github.com/owner/repo
   * - owner/repo
   */
  parseRepoUrl(url: string): { owner: string; repo: string } | null {
    const patterns = [
      /github\.com\/([^\/]+)\/([^\/]+)/,
      /^([^\/]+)\/([^\/]+)$/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return {
          owner: match[1],
          repo: match[2].replace(/\.git$/, '')
        };
      }
    }
    return null;
  }

  /**
   * Obtiene información básica del repositorio
   */
  getRepoInfo(owner: string, repo: string, token?: string): Observable<RepoInfo> {
    const headers = this.getHeaders(token);

    return this.http.get<any>(
      `${this.API_URL}/repos/${owner}/${repo}`,
      { headers }
    ).pipe(
      map(data => ({
        name: data.name,
        full_name: data.full_name,
        owner: data.owner.login,
        stars: data.stargazers_count
      }))
    );
  }

  /**
   * Obtiene TODOS los stargazers de un repositorio (con paginación automática)
   */
  getAllStargazers(owner: string, repo: string, token?: string): Observable<Stargazer[]> {
    return this.getStargazersPage(owner, repo, 1, token).pipe(
      expand(response =>
        response.hasMore
          ? this.getStargazersPage(owner, repo, response.page + 1, token)
          : EMPTY
      ),
      reduce((acc, response) => [...acc, ...response.stargazers], [] as Stargazer[])
    );
  }

  /**
   * Obtiene una página específica de stargazers
   */
  private getStargazersPage(
    owner: string,
    repo: string,
    page: number,
    token?: string
  ): Observable<{ stargazers: Stargazer[]; hasMore: boolean; page: number }> {
    const headers = this.getHeaders(token);

    return this.http.get<StargazerApiResponse[]>(
      `${this.API_URL}/repos/${owner}/${repo}/stargazers`,
      {
        headers,
        params: {
          per_page: this.PER_PAGE.toString(),
          page: page.toString()
        },
        observe: 'response'
      }
    ).pipe(
      map(response => {
        const apiResponse = response.body || [];

        // Transformar la respuesta de la API al formato Stargazer
        const stargazers: Stargazer[] = apiResponse.map(item => ({
          login: item.user.login,
          id: item.user.id,
          avatar_url: item.user.avatar_url,
          html_url: item.user.html_url,
          starred_at: item.starred_at
        }));

        const linkHeader = response.headers.get('Link');
        const hasMore = linkHeader ? linkHeader.includes('rel="next"') : false;

        return { stargazers, hasMore, page };
      })
    );
  }

  /**
   * Obtiene el rate limit actual
   */
  getRateLimit(token?: string): Observable<any> {
    const headers = this.getHeaders(token);
    return this.http.get(`${this.API_URL}/rate_limit`, { headers });
  }

  /**
   * Genera headers con token opcional
   */
  private getHeaders(token?: string): HttpHeaders {
    let headers = new HttpHeaders({
      'Accept': 'application/vnd.github.v3.star+json'
    });

    // Token es completamente opcional
    // Sin token: 60 requests/hora (suficiente para repos pequeños)
    // Con token: 5000 requests/hora
    if (token) {
      headers = headers.set('Authorization', `token ${token}`);
    }

    return headers;
  }
}
