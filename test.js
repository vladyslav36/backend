// const myPromise = new Promise((res, rej) => {
//   setTimeout(()=>res('1000s'),1000)
// })

// // myPromise.then((msg)=>console.log(msg))
// const getPromise = async () => {
//   const data = await myPromise
//   console.log(data)
// }

// getPromise()

let arr = [{ name: '345', price: 34 }, { name: '2', price: 78 }, { name: '56', price: 123 }]

console.log(arr.sort((a,b)=>a.name-b.name))