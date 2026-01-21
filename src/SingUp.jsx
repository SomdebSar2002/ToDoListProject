import { data, Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { useActionState } from "react";
import { useNavigate } from "react-router-dom";
export default function SignUp() {
    const { signUp } = useAuth();
    const navigate = useNavigate();
        const [error,submitAction,isPending] = useActionState(
            async (previousState, formData) => {
                const email = formData.get('email');
                const password = formData.get('password');
                const name = formData.get('name');
                const { success, error: signUpError } = await signUp(email, password, name);
                if (signUpError) {
                    return new Error(signUpError);
                }
                if (success&&data?.session) {
                    navigate('/dashboard');
                    return null;
                }
                return null;
            },
            null
        );
    return (
        <>
            <h1 className="landing-header">TodoList SignUP portal</h1>
            <div className="sign-form-container">
                <form
                    action={submitAction}
                    aria-label="Sign up form"
                    aria-describedby="form-description"
                >
                    <div id="form-description" className="sr-only">
                        Use this form to create a new account. Enter your name, email,
                        and password.
                    </div>

                    <h2 className="form-title">Sign up</h2>
                    <p>
                        Already have an account?{' '}
                        <Link className="form-link" to="/signin">
                            Sign in
                        </Link>
                    </p>

                    <label htmlFor="name">Name</label>
                    <input
                        className="form-input"
                        type="text"
                        name="name"
                        id="name"
                        placeholder=""
                        required
                        aria-required="true"
                        aria-invalid={error ? 'true' : 'false'}
                        aria-describedby={error ? 'signup-error' : undefined}
                        disabled={isPending}
                    />

                    <label htmlFor="email">Email</label>
                    <input
                        className="form-input"
                        type="email"
                        name="email"
                        id="email"
                        placeholder=""
                        required
                        aria-required="true"
                        aria-invalid={error ? 'true' : 'false'}
                        aria-describedby={error ? 'signup-error' : undefined}
                        disabled={isPending}
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        className="form-input"
                        type="password"
                        name="password"
                        id="password"
                        placeholder=""
                        required
                        aria-required="true"
                        aria-invalid={error ? 'true' : 'false'}
                        aria-describedby={error ? 'signup-error' : undefined}
                        disabled={isPending}
                    />

                    <button
                        type="submit"
                        disabled={isPending}
                        className="form-button"
                        aria-busy={isPending}
                    >
                        {isPending ? 'Signing up...' : 'Sign up'}
                    </button>

                    {error && (
                        <div
                            id="signup-error"
                            className="form-error"
                            role="alert"
                            aria-live="assertive"
                        >
                            {error.message}
                        </div>
                    )}
                </form>
            </div>
        </>
    );
}