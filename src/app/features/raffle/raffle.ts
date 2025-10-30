import {Component, signal} from '@angular/core';
import {Stargazer} from '../../core/interfaces/stargazer.interface';
import {RepoInfo} from '../../core/interfaces/repo-info.interface';
import {RaffleResult} from '../../core/interfaces/raffle-result.interface';
import {GithubService} from '../../core/services/github.service';
import {DatePipe} from '@angular/common';
import {WinnerDisplay} from './components/winner-display/winner-display';
import {ParticipantsList} from './components/participants-list/participants-list';
import {RepoInput} from './components/repo-input/repo-input';

@Component({
  selector: 'app-raffle',
  imports: [
    DatePipe,
    WinnerDisplay,
    ParticipantsList,
    RepoInput
  ],
  templateUrl: './raffle.html',
  styleUrl: './raffle.css',
})
export class Raffle {
  repoUrl = signal('');
  githubToken = signal('');
  stargazers = signal<Stargazer[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  repoInfo = signal<RepoInfo | null>(null);
  currentWinner = signal<Stargazer | null>(null);
  raffling = signal(false);
  raffleHistory = signal<RaffleResult[]>([]);

  constructor(private githubService: GithubService) {}

  async onLoadParticipants(event: { repoUrl: string; token: string }) {
    const parsed = this.githubService.parseRepoUrl(event.repoUrl);

    if (!parsed) {
      this.error.set('Invalid repository format. Use: owner/repo or full URL');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.stargazers.set([]);
    this.currentWinner.set(null);

    try {
      // Load repo info
      const info = await this.githubService
        .getRepoInfo(parsed.owner, parsed.repo, event.token || undefined)
        .toPromise();

      this.repoInfo.set(info!);

      // Load stargazers
      const stargazers = await this.githubService
        .getAllStargazers(parsed.owner, parsed.repo, event.token || undefined)
        .toPromise();

      this.stargazers.set(stargazers || []);

      if (!stargazers || stargazers.length === 0) {
        this.error.set('This repository has no stars yet');
      }
    } catch (err: any) {
      const message = err.error?.message || 'Failed to load stargazers';
      this.error.set(message);

      if (message.includes('rate limit')) {
        this.error.set('Rate limit exceeded. Try adding a GitHub token or wait a moment.');
      }
    } finally {
      this.loading.set(false);
    }
  }

  async startRaffle() {
    const participants = this.stargazers();
    if (participants.length === 0) return;

    this.raffling.set(true);
    this.currentWinner.set(null);

    // Raffle animation
    const duration = 3000;
    const interval = 100;
    const iterations = duration / interval;

    for (let i = 0; i < iterations; i++) {
      const randomIndex = Math.floor(Math.random() * participants.length);
      this.currentWinner.set(participants[randomIndex]);
      await this.sleep(interval);
    }

    // Final winner
    const finalIndex = Math.floor(Math.random() * participants.length);
    const winner = participants[finalIndex];
    this.currentWinner.set(winner);

    // Save to history
    const result: RaffleResult = {
      winner,
      timestamp: new Date(),
      repoName: this.repoInfo()?.full_name || '',
      totalParticipants: participants.length
    };

    this.raffleHistory.update(history => [result, ...history]);
    this.raffling.set(false);
  }

  clearHistory() {
    this.raffleHistory.set([]);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
