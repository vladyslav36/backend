const myPromise = new Promise((res, rej) => {
  setTimeout(()=>res('1000s'),1000)
})

// myPromise.then((msg)=>console.log(msg))
const getPromise = async () => {
  const data = await myPromise
  console.log(data)
}

getPromise()