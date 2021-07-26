import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIResponse, Game } from 'src/app/models';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public sort: string = '';
  public games: Array<Game> = [];
  subscriptions: Subscription[] = [];
  constructor(
    private httpService: HttpService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.activatedRoute.params.subscribe((params: Params) => {
        if (params['game-search']) {
          this.searchGames('metacrit', params['game-search']);
        } else {
          this.searchGames('metacrit');
        }
      })
    );
  }

  searchGames(sort: string, search?: string) {
    this.subscriptions.push(
      this.httpService
        .getGameList(sort, search)
        .subscribe((gameList: APIResponse<Game>) => {
          this.games = gameList.results;
          console.log(gameList);
        })
    );
  }

  openGameDetails(game: any): void {
    this.router.navigate(['details', game.id]);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
