const whitelist = ['example.com', 'another-example.com']; // Add allowed domains here
const blacklist = ['blacklisted.com']; // Add disallowed domains here

module.exports = async (ctx, next) => {
  const { email } = ctx.request.body;

  const domain = email.split('@')[1];

  if (whitelist.length && !whitelist.includes(domain)) {
    return ctx.throw(400, 'Email domain not allowed.');
  }

  if (blacklist.includes(domain)) {
    return ctx.throw(400, 'Email domain is blacklisted.');
  }

  await next();
};
