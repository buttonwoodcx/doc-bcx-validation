export default function(model) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({message: 'Saved ' + JSON.stringify(model)});
    }, 500);
  });
}
