const SERVER_PORT = process.env.REACT_APP_SERVER_PORT;

const production = {
  url: `https://usepopcorn-creynolds.netlify.app/`,
};

const development = {
    url: `http://localhost:${SERVER_PORT}/`
}

export const config = process.env.NODE_ENV === 'development' ? development : production