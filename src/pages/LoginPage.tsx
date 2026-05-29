
import React, { FC, useState } from 'react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const [showRecoveryMsg, setShowRecoveryMsg] = useState(false);
    const [email, setEmail] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        onLoginSuccess();
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full mx-auto">
                <div className="text-3xl font-bold mb-8 flex items-center justify-center text-gray-800">
                    <svg className="w-10 h-10 mr-3 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                    </svg>
                    <span>KBB App</span>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">Bienvenue !</h2>
                    <p className="text-center text-gray-500 mb-6">Connectez-vous à votre compte</p>
                    
                    {showRecoveryMsg && (
                        <div className="mb-5 p-4 bg-green-50 border border-green-200 text-green-850 rounded-xl flex items-start gap-2.5 animate-fadeIn">
                            <span className="text-lg">📧</span>
                            <div className="text-xs">
                                <p className="font-bold">Lien de réinitialisation envoyé</p>
                                <p className="mt-0.5">Un email contenant un lien sécurisé a été envoyé à <strong className="font-semibold">{email || "votre adresse email"}</strong>. Veuillez vérifier votre boîte de réception.</p>
                                <button onClick={() => setShowRecoveryMsg(false)} className="text-green-700 hover:text-green-900 font-bold underline mt-1.5 block">Fermer</button>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse e-mail</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                                    placeholder="vous@exemple.com" 
                                    required 
                                />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                                    <button 
                                        type="button"
                                        onClick={() => setShowRecoveryMsg(true)}
                                        className="text-sm text-indigo-600 hover:underline hover:text-indigo-850 font-medium"
                                    >
                                        Mot de passe oublié ?
                                    </button>
                                </div>
                                <input type="password" name="password" className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="********" required />
                            </div>
                            <div>
                                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 shadow-sm">Se connecter</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
