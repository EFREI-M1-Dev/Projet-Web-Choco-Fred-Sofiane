import {Button} from "../../components/Button/Button";

const Home = () => {
    // const [inputValue, setInputValue] = useState<string>("")

    return (
        <div className="Home">
           <Button
                value={"click me"}
                onClick={() => console.log("Button clicked")}
           />
        </div>
    )
}

export default Home
