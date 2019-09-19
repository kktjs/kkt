import { Configuration } from 'webpack';

// "url" loader works like "file" loader except that it embeds assets
// smaller than specified limit in bytes as data URLs to avoid requests.
// A missing `test` is equivalent to a match.
module.exports = (conf: Configuration) => {
  return [
    {
      test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
      loader: require.resolve('url-loader'),
      options: {
        limit: parseInt(
          process.env.IMAGE_INLINE_SIZE_LIMIT || '10000'
        ),
        name: 'static/media/[name].[hash:8].[ext]',
      },
    }
  ];
};
