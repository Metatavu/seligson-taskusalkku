# Getting started with React Native Typescript template

### `Add OpenApi specification file (swagger.yaml)`

File can be added as a Git submodule, which helps the development with different spec versions:

```sh
  git submodule add git@github.com:example-api-spec.git
```

### `Update api spec generator command`

Change the command inside *package.json* to match the added API specification file location

```json
  ...
  "scripts": {
    ...
    "build-client": "... -i example-api-spec/swagger.yaml ..."
  }
```

### `Add environment variables`

To add necessary environment variables, create *.env* file to project root folder and write variables inside it with following syntax:

```
REACT_APP_EXAMPLE_ENVIRONMENT_VARIABLE=variable-value
REACT_APP_EXAMPLE_API_URL=https://example-api.example.com
...
```

Required environment variables can be found from *src/app/config.ts*.

## Available Scripts

In the project directory, you can run:

### `expo start` / `npm run start`

Runs the dev server in the development mode.\
Open [http://localhost:19002](http://localhost:19002) to view it in the browser.\
Download *Expo Go* to phone and connect it to the same WiFi network with the machine that this server runs. *Expo Go* can then be used to read the QR code in the opened Expo server web page to open the project in the phone.

After editing, the app can be reloaded by shaking the phone to open Expo Go in-app menu and selecting *Reload*.

You can debug the running project by opening Expo Go in-app menu and selecting *Debug Remote JS*, which opens new web page, that displays all application logs in developer console.

### `npm run lint`

Fixes all linting problems reported by ESLint in the project.\
**Always confirm the changes afterwards!**

### `npm run build-client`

Generates API client from the provided specification file into *src/generated/client*

## Building the application

TODO: add instructions