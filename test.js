fetch('http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser', {

}).then(data => console.log(data))

