import { useEffect, useState } from "react";
import Nav from "./components/header";
import Page from "./components/page";
import Toolbar from "./components/toolbar";
import Loading from "./components/loading";

function App() {

  let [ content, setContent] = useState("");
  let [ home, setHome] = useState(true);
  let [ way, setWay] = useState("file");

  //1.control the whole action here.
  const self={
    page:(ctx,action,force)=>{
      if(ctx==="home"){
        if(force){
          setContent(<Loading />);
          setTimeout(()=>{
            setContent(<Page page={self.page}/>);
            setHome(true);
            setWay("file");
          },500);
        }else{
          setContent(<Page page={self.page}/>);
          setHome(true);
          setWay("file");
        }
      }else{
        setContent(ctx);
        setHome(false);
        if(action) setWay(action); //2.set toolbar way
      }
    },
  }

  useEffect(() => {
    self.page("home");
  }, []);

  return (<div>
    <Nav home={home} page={self.page}/>
    {content}
    <Toolbar way={way} page={self.page}/>
  </div>);
}

export default App;