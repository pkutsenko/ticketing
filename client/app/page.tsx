import Image from 'next/image'
import {cookies, headers} from 'next/headers'

interface User {
  currentUser: {
    id: string;
    email: string;
  } | null
}
export default async function Home() {
  console.log('server')
  await new Promise((res) => setTimeout(res, 5000))

  const user = await fetch('http://auth-srv.default.svc.cluster.local:3000/api/users/currentuser', {
    headers: headers()
  })
      .then(response => response.json()) as User;
  console.log(user)
  return <div>{user.currentUser ? <h1>Signed In</h1> : <h1>Not Signed In</h1>}</div>
}
