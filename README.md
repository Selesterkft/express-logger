# @selesterkft/express-logger

Simple wrapper for [winston](https://www.npmjs.com/package/winston) and [morgan](https://www.npmjs.com/package/morgan) for use in Express webapps.

## Installation

Install the package with `yarn`:

```bash
yarn add @selesterkft/express-logger
```

## Usage

This package supports three levels of logging, in descending order of severity:

- `logger.error()`
- `logger.info()`
- `logger.debug()`

All of them are called with a single parameter which can be a simple string or a javascript object. Objects will be parsed to JSON. Log files will have a basic format: a JSON entry of any logging event per line.

For logging http calls, use `logger.middleware()` as an Express middleware.

```javascript
import express from 'express';
import logger from '@selesterkft/express-logger';

const app = express();
// Note that we do call the middleware() function.
app.use(logger.middleware());

const PORT = 4000;

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.listen(PORT, () => {
  logger.info(`App is listening on ${PORT}.`);
});
```

```javascript
import logger from '@selesterkft/express-logger';

export default function doSomething() {
  logger.error('Something was done!');
}
```

For logging request and response bodies (only meaningful in debug mode), use `logger.bodyMiddleware()` as a middleware. Do **not** call it, and make sure to use it after parsing the request body.

```javascript
// ...
app.use(express.json());
app.use(logger.middleware());
app.use(logger.bodyMiddleware);
// ...
```

## Log files

Log files will be written to the `logs/` folder, so don't forget to add it to your `.gitignore` file.

```text
# Logs
logs/
```

## Console logging

Express-logger will read `NODE_ENV` to determine the current _node_ environment, and, unless it is `'production'` or `'test'`, will output the logs to the console. Be sure to set the node environment to `'production'` when appropriate to suppress console logging.

Using Jest, for example, should automatically set the environment to `'test'`.
