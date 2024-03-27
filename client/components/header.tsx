import Link from 'next/link';
import { use, cache } from 'react'

interface Props {
    currentUser: {
        id: string;
        email: string;
    } | null
}

export default function Header ({ currentUser }: Props) {
    const links = [
        !currentUser && { label: 'Sign Up', href: '/auth/signup' },
        !currentUser && { label: 'Sign In', href: '/auth/signin' },
        currentUser && { label: 'Sign Out', href: '/auth/signout' },
    ]
        .filter((linkConfig): linkConfig is {label: string;href: string} => !!linkConfig)
        .map(({ label, href }) => {
            return (
                <li key={href} className="nav-item">
                    <Link className="nav-link" href={href}>
                        {label}
                    </Link>
                </li>
            );
        });

    return (
        <nav className="navbar navbar-light bg-light">
            <Link className="navbar-brand" href="/">
                GitTix
            </Link>

            <div className="d-flex justify-content-end">
                <ul className="nav d-flex align-items-center">{links}</ul>
            </div>
        </nav>
    );
};
