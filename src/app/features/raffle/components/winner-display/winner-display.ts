import {Component, input} from '@angular/core';
import {Stargazer} from '../../../../core/interfaces/stargazer.interface';

@Component({
  selector: 'app-winner-display',
  imports: [],
  templateUrl: './winner-display.html',
  styleUrl: './winner-display.css',
})
export class WinnerDisplay {
  winner = input<Stargazer | null>();
  isAnimating = input<boolean>(false);

  copied = false;

  async copyToClipboard() {
    const username = this.winner()?.login;
    if (!username) return;

    try {
      await navigator.clipboard.writeText(username);
      this.copied = true;
      setTimeout(() => this.copied = false, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }
}
