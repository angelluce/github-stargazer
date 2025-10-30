import {Component, model, output} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-repo-input',
  imports: [
    FormsModule
  ],
  templateUrl: './repo-input.html',
  styleUrl: './repo-input.css',
})
export class RepoInput {
// Two-way binding con el componente padre
  repoUrl = model<string>('');
  githubToken = model<string>('');
  loading = model<boolean>(false);

  // Evento para notificar al padre
  loadParticipants = output<{ repoUrl: string; token: string }>();

  onSubmit() {
    if (this.repoUrl().trim()) {
      this.loadParticipants.emit({
        repoUrl: this.repoUrl(),
        token: this.githubToken()
      });
    }
  }
}
