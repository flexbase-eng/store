var scheduler = typeof setImmediate === 'function' ? setImmediate : setTimeout;

export const flushPromises = () => {
  return new Promise(function (resolve) {
    scheduler(resolve);
  });
};
