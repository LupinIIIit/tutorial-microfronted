import { initFederation } from '@angular-architects/native-federation';

initFederation({
  shell: 'http://localhost:8080/remoteEntry.json',
  products: 'http://localhost:8081/remoteEntry.json',
  cart: 'http://localhost:8082/remoteEntry.json',
  profile: 'http://localhost:8083/remoteEntry.json',
})
  .catch((err) => console.error(err))
  .then((_) => import('./bootstrap'))
  .catch((err) => console.error(err));
