# Minuteur

**WARNING: This is still a work in progress. You are free to use and poke around with this, but the API/DB Schema may change until we reach 1.0.**

Minuteur is a Timer app built with Electron to solve a simple problem: Easy and simple time tracking.

![](https://www.dropbox.com/s/nrxmjzfg0icylw2/Screen%20Shot%202020-09-26%20at%2008.39.38.png?raw=1)

## API

This app exposes an internal API so you can write your custom integration for it.

Every time you see the `time` fields in the API, it will be in **seconds**.

**Getting a daily summary of hours per project**

```json
curl http://localhost:22507/api/projects/summary/daily | jq
[
  {
    "uuid": "ecfad1da-95a3-4355-b07e-7f205e8ea2ae",
    "client_uuid": "68aae4be-1f24-4268-ad09-f9d9c7588d64",
    "name": "New project",
    "date": "2020-09-25",
    "time": 7202,
    "notes": "Session 1 name, Session 2 name"
  },
  {
    "uuid": "ecfad1da-95a3-4355-b07e-7f205e8ea2ae",
    "client_uuid": "68aae4be-1f24-4268-ad09-f9d9c7588d64",
    "name": "New project",
    "date": "2020-09-26",
    "time": 50055,
    "notes": "Session 1 name, Session 2 name"
  }
]
```

**Deleting all sessions for a given project**

```bash
curl -X DELETE "http://localhost:22507/api/projects/{uuid}/sessions/clear"
```

### Setting up locally

After cloning this repo, simply run:

```
yarn install
knex migrate:latest
yarn electron:serve
```

Make sure `node_modules/.bin` is in your PATH, otherwise you might have to run `node_modules/.bin/knex` instead.

#### Migrations (Dev)

Setting up migrations:

```
knex migrate:latest
```

Rolling back migrations:

```
knex migrate:rollback --all
```

### Building executables

```
yarn build:all
```
