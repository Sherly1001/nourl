# nourl
Shorten your URL, custom, and edit, check [here](https://nourl.tk).
- Just enter URL and alias code
- Sign in to take your codes, so you can custom and manage them

# Service APIs
Checkout api documents [here](https://documenter.getpostman.com/view/14676245/UVyytsrW).
## Databases
Database migrations using [diesel-cli](https://diesel.rs/). Set DATABASE_URL env and run:
```sh
diesel migration run
```
## Environments
Copy content of `.env.example` to `.env` file and replace your key and app ids.
- for github app id check [here](https://docs.github.com/en/rest/guides/basics-of-authentication)
- for google app id check [here](https://developers.google.com/identity/sign-in/web/sign-in)
- for facebook app id check [here](https://developers.facebook.com/docs/facebook-login/)

# Frontend
Build source code with `yarn build` command and serve static files at `frontend/dist`.
