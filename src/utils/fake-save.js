export default function(model) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({message: 'Saved ' + JSON.stringify(model, null, 2)});
    }, 200);
  });
}
