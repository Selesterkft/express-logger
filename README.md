# @selesterkft/express-logger

Simple wrapper for [winston](https://www.npmjs.com/package/winston) and [morgan](https://www.npmjs.com/package/morgan) for use in Express webapps.

## Installation

If you use `npm`:

```bash
npm install @selesterkft/express-logger
```

Or if you use `yarn`:

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
