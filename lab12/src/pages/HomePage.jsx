import HeaderComponent from "../components/HeaderComponent"
import { useNavigate } from "react-router-dom";
import '../App.css';
// ...existing code...

function HomePage(){
      return (
        <>
            <HeaderComponent />
            <div className="container mt-3">
                <div className="border-bottom pb-3 mb-3">
                    <h3>Home</h3>
                </div>
            </div>
        </>
      )
}

export default HomePage