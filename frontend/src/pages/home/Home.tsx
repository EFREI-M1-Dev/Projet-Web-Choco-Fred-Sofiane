import reactLogo from '../../assets/react.svg'
import viteLogo from '/vite.svg'

const Home = () => {
    return (
        <div className="Home">
            <header className="Home-header">
                <img src={reactLogo} className="Home-logo" alt="logo" />
                <img src={viteLogo} className="Home-logo" alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    className="Home-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    )
}

export default Home
