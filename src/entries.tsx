export default {
  loadModule: async (id: string) => {
    switch (id) {
      case 'src/routes/page':
        return import('./routes/page');
      default:
        return null;
    }
  },
  getBuildConfig: async () => {
    return {
      '/': {
        elements: [['src/routes/page', {}]],
      },
    };
  },
};