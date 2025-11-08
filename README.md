# Stargazer

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.5.

# Architecture

```
src/app/
├── core/
│   ├── services/
│   │   └── github.service.ts
│   └── models/
│       └── stargazer.model.ts
│
├── features/
│   └── raffle/
│       ├── raffle.component.ts
│       ├── raffle.component.html
│       ├── raffle.component.css
│       └── components/
│           ├── repo-input/
│           │   ├── repo-input.component.ts
│           │   ├── repo-input.component.html
│           │   └── repo-input.component.css
│           ├── participants-list/
│           ├── raffle-spinner/
│           └── winner-display/
│
└── shared/
    └── components/
        ├── loading-spinner/
        └── error-message/
```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running with Docker

To execute the project with [Docker](https://www.docker.com), use the following command:

```bash
docker compose up -d
```

You can stop the project with:

```bash
docker compose down
```

