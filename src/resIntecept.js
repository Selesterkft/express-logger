import logger from './logger';
// From https://stackoverflow.com/a/57552408

// Response Interceptor Middleware
export default function resIntercept(request, response, next) {
  try {
    const oldJSON = response.json;
    response.json = (data) => {
      // For Async call, handle the promise and then set the data to `oldJson`
      if (data && data.then != undefined) {
        // Resetting json to original to avoid cyclic call.
        return data
          .then((responseData) => {
            // Custom logic/code.
            logger.debug({
              requestBody: request.body,
              responseBody: response.body,
            });

            response.json = oldJSON;
            return oldJSON.call(response, responseData);
          })
          .catch((error) => {
            next(error);
          });
      } else {
        // For non-async interceptor functions
        // Resetting json to original to avoid cyclic call.
        // Custom logic/code.
        logger.debug({
          requestBody: request.body,
          responseBody: response.body,
        });

        response.json = oldJSON;
        return oldJSON.call(response, finalResponse);
      }

    };
  } catch (error) {
    next(error);
  }
}
