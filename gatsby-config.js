module.exports = {
  pathPrefix: 'kle-js',
  siteMetadata: {
    siteTitle: `kle-js`,
    defaultTitle: `kle-js`,
    siteTitleShort: `kle-js`,
    siteDescription: `A JavaScript library for interacting with KLE JSON and KLE data structures.`,
    siteUrl: `https://damsenviet.github.io/kle-js/`,
    siteAuthor: `@DamSenviet`,
    siteImage: `/banner.png`,
    siteLanguage: `en`,
    themeColor: `#8257E6`,
    basePath: `/`,
  },
  flags: { PRESERVE_WEBPACK_CACHE: true },
  plugins: [
    {
      resolve: `@rocketseat/gatsby-theme-docs`,
      options: {
        configPath: `src/config`,
        docsPath: `src/docs`,
        repositoryUrl: `https://github.com/DamSenViet/kle-js`,
        baseDir: `.`,
        withMdx: false, // using gatsby-plugin-mdx instead
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: 'gatsby-remark-typedoc-symbol-links',
            options: {
              basePath: '/api/',
              linkTitleMessage(symbolPath, missing) {
                return missing
                  ? `Missing link to '${symbolPath}' docs. We will happily accept a PR to fix this! 🙏`
                  : `View '${symbolPath}' in kle-js API docs.`;
              }
            },
          },
          // oriignal withMdx options
          `gatsby-remark-autolink-headers`,
          `gatsby-remark-embedder`,
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 960,
              withWebp: true,
              linkImagesToOriginal: false,
            },
          },
          `gatsby-remark-responsive-iframe`,
          `gatsby-remark-copy-linked-files`,
        ],
        plugins: [`gatsby-remark-autolink-headers`, `gatsby-remark-images`],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `kle-js`,
        short_name: `kle-js`,
        start_url: `kle-js`,
        background_color: `#ffffff`,
        display: `standalone`,
        icon: `static/favicon.png`,
      },
    },
    `gatsby-plugin-sitemap`,
    // {
    //   resolve: `gatsby-plugin-google-analytics`,
    //   options: {
    //     trackingId: `YOUR_ANALYTICS_ID`,
    //   },
    // },
    `gatsby-plugin-remove-trailing-slashes`,
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: `https://rocketdocs.netlify.app`,
      },
    },
    `gatsby-plugin-offline`,
    {
      resolve: 'gatsby-source-typedoc',
      options: {
        src: [`${__dirname}/package/index.ts`],
        typedoc: {
          tsconfig: `${__dirname}/tsconfig.json`,
          entryPoints: [`${__dirname}/package/index.ts`],
        },
      },
    },
  ],
};
