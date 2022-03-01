# @selesterkft/express-logger

Simple wrapper for [winston](https://www.npmjs.com/package/winston) and [morgan](https://www.npmjs.com/package/morgan) for use in Express webapps.

## Installation

Install the package with `yarn`:

```bash
yarn add @selesterkft/express-logger
```

## Usage

This package supports two levels of logging: `logger.info()` and `logger.error()`. Both are called with a message string.

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

## Log files

Log files will be written to the `logs/` folder, so don't forget to add it to your `.gitignore` file.

```text
# Logs
logs/
```

## Console logging

Express-logger will read `NODE_ENV` to determine the current _node_ environment, and, unless it is `'production'` or `'test'`, will output the logs to the console. Be sure to set the node environment to `'production'` when appropriate to suppress console logging.

Using Jest, for example, should automatically set the environment to `'test'`.
