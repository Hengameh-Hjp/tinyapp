
function generateRandomString() {
  const SALTCHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  let strings = SALTCHARS.split("")
  let len_char = 6
  let my_str = ""
  for (let i=0; i<len_char; i++){
    my_str += strings[Math.floor(Math.random()*strings.length)]
  }
  return my_str
};

console.log(generateRandomString())