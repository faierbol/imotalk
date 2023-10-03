const { onboard } = require('../services/onboarding');

module.exports = {
  async onboard(ctx) {
    const data = ctx.request.body;
    const result = await onboard(data);
    ctx.body = result;
  }
};
