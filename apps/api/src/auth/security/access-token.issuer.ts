export interface AccessTokenIssuer {
  issue(id: string): Promise<string>;
}
