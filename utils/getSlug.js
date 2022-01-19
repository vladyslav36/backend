const uniqueSlug=require('unique-slug')
const slugify=require('slugify')


exports.getSlug = (string) => {
  // return `${slugify(string.replace(/[-.,;' ']/g,''),{lower:true})}-${uniqueSlug()}`
  return `${slugify((string.match(/[a-zA-Z0-9а-яА-я]/g)||[]).join(''),{lower:true})}-${uniqueSlug()}`
 
 
  
}