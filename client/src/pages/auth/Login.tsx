import { LoginForm } from '@/components/login-form'
import img from '../../assets/logo.jpg'
const Login = () => {
    return (
        <div className='degra'>
            <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <LoginForm />
                </div>
            </div>
        </div>

    )
}

export default Login