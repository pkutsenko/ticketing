import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import {headers} from "next/headers";
import Header from "@/components/header";

interface User {
  currentUser: {
    id: string;
    email: string;
  } | null
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const data = await fetch('http://auth-srv.default.svc.cluster.local:3000/api/users/currentuser', {
    headers: headers()
  })
      .then(response => response.json()) as User;
  console.log('template')
  console.log(data)

  return (
    <div>
      <Header currentUser={data.currentUser} />
      <div>{data.currentUser?.email}</div>
      <div>{Math.random()}</div>
      {children}
    </div>
  )
}
