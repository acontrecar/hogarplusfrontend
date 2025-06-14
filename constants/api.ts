import Constants from 'expo-constants';

interface EnvConfig {
  API_URL: string;
  API_URL_IOS?: string;
  API_URL_ANDROID?: string;
}

interface Env {
  development: EnvConfig;
  production: EnvConfig;
}

const ENV: Env = {
  development: {
    API_URL: 'https://hogarplusbackend.onrender.com/api',
    API_URL_IOS: 'https://hogarplusbackend.onrender.com/api',
    API_URL_ANDROID: 'https://hogarplusbackend.onrender.com/api'
  },
  production: {
    API_URL: 'https://hogarplusbackend.onrender.com/api'
  }
};

const getEnvVars = (env: keyof Env = 'development') => {
  const environment = ENV[env];

  if (Constants.platform?.ios) {
    return {
      API_URL: environment.API_URL_IOS
    };
  } else if (Constants.platform?.android) {
    return {
      API_URL: environment.API_URL_ANDROID
    };
  }
  return {
    API_URL: environment.API_URL
  };
};

export default getEnvVars;
