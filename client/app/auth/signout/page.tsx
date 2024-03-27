'use client';

import {FormEvent, useEffect, useState} from "react";
import Router, {useRouter} from 'next/navigation';
import useRequest from "@/hooks/use-request";
import {revalidatePath} from "next/cache";

export default function Signup() {
    const router = useRouter();
    const { doRequest } = useRequest({
        url: '/api/users/signout',
        method: 'post',
        body: {},
        onSuccess: () => {

            router.push('/')
            //router.refresh()

        }
    });

    useEffect(() => {
        doRequest();
    }, []);

    return <div>Signing you out...</div>;
}
