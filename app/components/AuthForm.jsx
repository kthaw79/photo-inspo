'use client'

import { useState } from "react"
import { supabase } from "../utils/supabaseClient"
import { useRouter } from "next/navigation"

export default function AuthForm() {
    const [isNewUser, setIsNewUser] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSigningIn, setIsSigningIn] = useState(false)
    const [isSigningUp, setIsSigningUp] = useState(false)
    const router = useRouter()

    async function handleLogin(e){
        e.preventDefault();
        setIsSigningIn(true)
        const {data,error} = await supabase.auth.signInWithPassword({
            email, password
        })
        console.log({error, data})
        if (!error){
            router.push('/photos')
        }
        else {
            setIsSigningIn(false)
        }
    }

    async function handleSignUp(e){
        e.preventDefault();
        const {data, error} = await supabase.auth.signUp({
            email,
            password
        })
        if (!error){
            setIsSigningUp(true)
        }
        console.log({data, error});
    }

    let signInMessage = 'Sign In';

    if (isSigningIn) {
        signInMessage = 'Signing In'
    }
    else if (isNewUser) {
        signInMessage = 'Sign Up'
    }

    const signUpMessage = <p className="text-center text-white">Email send! Check your email to confirm sign up.</p>

    return (
        <form onSubmit={isNewUser ? handleSignUp : handleLogin} className="space-y-8">
            <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none rounded relative block w-full px-3 py-2 text-black"
            placeholder="Email"/>
            <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none rounded relative block w-full px-3 py-2 text-black"
            placeholder="Password"/>
            <button 
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border">
                {signInMessage}
            </button>
            <p className="text-center text-white">
                {
                    isNewUser ? (
                        <>
                        Already have an account? {' '}
                        <button 
                        type="button"
                        onClick={() => setIsNewUser(false)}
                        className="text-indigo-400 hover:text-indigo-600">
                            Sign in
                        </button>
                        </>
                    ) : (
                        <>
                        Don't have an account? {' '}
                        <button 
                        type="button"
                        onClick={() => setIsNewUser(true)}
                        className="text-blue-400 hover:text-indigo-600">
                            Sign up
                        </button>
                        </>
                    )
                }
            </p>
            {
                isSigningUp && signUpMessage
            }
        </form>
    )
}