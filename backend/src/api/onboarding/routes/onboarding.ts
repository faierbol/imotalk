export default {
  routes: [
    {
      method: 'POST',
      path: '/onboarding',
      handler: 'onboarding.onboard',
      config: {
        policies: [],
        middlewares: ['plugin::users-permissions.rateLimit'],
      },
    },
  ],
};
