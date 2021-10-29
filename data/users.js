const bcrypt=require('bcrypt')

const users = [
  {
    name: "Vlad",
    email: "vlad@example.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
  },
  {
    name: "John",
    email: "john@example.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: "false",
  },
]

module.exports= users