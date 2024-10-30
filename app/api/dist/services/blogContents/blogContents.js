var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var blogContents_exports = {};
__export(blogContents_exports, {
  blogContent: () => blogContent,
  blogContents: () => blogContents,
  createBlogContent: () => createBlogContent,
  deleteBlogContent: () => deleteBlogContent,
  updateBlogContent: () => updateBlogContent
});
module.exports = __toCommonJS(blogContents_exports);
var import_db = require("../../lib/db");
const blogContents = () => {
  return import_db.db.blogContent.findMany();
};
const blogContent = ({
  id
}) => {
  return import_db.db.blogContent.findUnique({
    where: {
      id
    }
  });
};
const createBlogContent = ({
  input
}) => {
  return import_db.db.blogContent.create({
    data: input
  });
};
const updateBlogContent = ({
  id,
  input
}) => {
  return import_db.db.blogContent.update({
    data: input,
    where: {
      id
    }
  });
};
const deleteBlogContent = ({
  id
}) => {
  return import_db.db.blogContent.delete({
    where: {
      id
    }
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  blogContent,
  blogContents,
  createBlogContent,
  deleteBlogContent,
  updateBlogContent
});
//# sourceMappingURL=blogContents.js.map
