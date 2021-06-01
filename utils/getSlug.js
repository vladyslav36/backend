const uniqueSlug=require('unique-slug')
const slugify=require('slugify')


exports.getSlug = (string) => {
  return `${slugify(string.toLowerCase())}-${uniqueSlug()}`
  
}