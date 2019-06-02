const { mergeSchemas } = require('graphql-tools');
const userSchema = require("./user");

const schemas = [
  userSchema,
]

module.exports = {
  mergedSchema: mergeSchemas({ schemas }),
}
