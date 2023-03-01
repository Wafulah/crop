import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import Info from "./components/Info";
import Nav from "./components/Nav";
import { BsStars } from "react-icons/bs";
import {
  FaTimes,
  FaInstagramSquare,
  FaGithubSquare,
  FaLinkedin,
} from "react-icons/fa";
import { FaSeedling, FaAppleAlt, FaCoins, FaInfo } from "react-icons/fa";

function App() {
  const [state, setState] = useState({
    county: "",
    ha: "",
    cost: "",

    errors: {},
  });

  const [data, setData] = useState([]);

  async function handleInput(e) {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setShowDiv(!showDiv);

    axios
      .post("http://127.0.0.1:8000/predict_status", {
        headers: {
          "Content-Type": "application/json",
        },

        county: state.county,
        ha: state.ha,
        cost: state.cost,
      })
      .then((res) => {
        setState({
          county: "",
          ha: "",
          cost: "",
        });
      })
      .catch((err) => {});
  }

  const getData = async () => {
    const { data } = await axios.get(
      "http://127.0.0.1:8000/predict_status_get"
    );

    setData(data[0]);
  };

  useEffect(() => {
    getData();
  }, []);

  //make div visible/invisible
  const [showDiv, setShowDiv] = useState(false);

  const handleClick = () => {
    setShowDiv(!showDiv);
  };

  return (
    <div>
      <div className="show-div">
        {!showDiv ? (
          <div className="show" onClick={handleClick}>
            <p className="h5-inf"> History </p>
          </div>
        ) : (
          <div className="times" onClick={handleClick}>
            <FaTimes
              size={50}
              style={{ color: "green", filter: "brightness(300%)" }}
            />
          </div>
        )}
      </div>
      {showDiv && (
        <div className="hdn pop-holder">
          <div className="pop">
            {/* <div  className="times"onClick={handleClick} >
				  <FaTimes size={30} style={{ color: 'black' }} />
				  </div> */}
            <div className="holder">
              <div className="crop">
                <div className="headng">
                  <p className="infoa_text">
                    <BsStars size={35} style={{ color: "yellow" }} />
                    Crop
                    <BsStars size={35} style={{ color: "yellow" }} />
                  </p>{" "}
                </div>

                <div className="infdiv">
                  <div className="infdiv-text">
                    <p>Name:</p>
                  </div>
                  <div className="val">
                    <p className="infob_text"> {data.crop} </p>{" "}
                  </div>
                </div>
                <div className="extra-info">
                  This Crops requires medium use of fertilizer. Use DAP twice
                  before weeding. Use moderate manure to avoid acidifying the
                  soil.
                </div>
              </div>
              <div className="yield">
                <div className="headng">
                  <p className="infoa_text">
                    <BsStars size={35} style={{ color: "yellow" }} />
                    Yield
                    <BsStars size={35} style={{ color: "yellow" }} />
                  </p>
                </div>
                <div className="infdiv">
                  <div className="infdiv-text">
                    <p>Amount:</p>
                  </div>
                  <div className="val">
                    <p className="infob_text">
                      {" "}
                      {data.crop_yield} &nbsp; tonnes
                    </p>
                  </div>
                </div>
                <div className="extra-info">
                  This is the amount of yield you'll get in tonnes based on what
                  farmers who planted {data.crop} got in previous years.
                </div>
              </div>
              <div className="profit">
                <div className="headng">
                  <p className="infoa_text">
                    <BsStars size={35} style={{ color: "yellow" }} />
                    Profit
                    <BsStars size={35} style={{ color: "yellow" }} />
                  </p>{" "}
                </div>
                <div className="infdiv">
                  <div className="infdiv-text">
                    <p>Profit:</p>
                  </div>
                  <div className="val">
                    <p className="infob_text">Ksh. {data.profit}</p>{" "}
                  </div>
                </div>
                <div className="extra-info">
                  Total amount of returns you'll get when you plant {data.crop}{" "}
                  in your land. This is the total money you'll get after selling
                  all the {data.crop_yield} tonnes. Substracted invested capital
                  to get profit.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="cover">
        <Nav />
		 <h1 className="heading">Crop recomendation System</h1>
        <div className="hero">
         
		  
          {/*information div*/}
          <div className="about">
            <Info />
          </div>
          {/*form div*/}
          <div className="contain">
            <div className="chld">
              <form className="box" onSubmit={handleSubmit}>
                <br />
                <input
                  type="text"
                  className="inpt"
                  value={state.county}
                  onChange={handleInput}
                  name="county"
                  placeholder="Enter county"
                />
                <br />
                <input
                  type="text"
                  className="inpt"
                  value={state.ha}
                  onChange={handleInput}
                  name="ha"
                  placeholder="Enter ha"
                />
                <br />
                <input
                  type="text"
                  className="inpt"
                  value={state.cost}
                  onChange={handleInput}
                  name="cost"
                  placeholder="Enter cost in Ksh"
                />
                <br />

                <input className="btn" type="submit" />
              </form>
            </div>
          </div>
        </div>
        <hr className="hr_class" />
        <footer>
          <div className="fter">
            <FaInstagramSquare
              size={45}
              style={{ color: "rgb(8, 163, 8)", margin: "2% 10%" }}
            />
            <FaGithubSquare
              size={45}
              style={{ color: "rgb(8, 163, 8)", margin: "2% 10%" }}
            />
            <FaLinkedin
              size={45}
              style={{ color: "rgb(8, 163, 8)", margin: "2% 10%" }}
            />
          </div>
        </footer>
        <div className="rights_div">
          <i className="rights"> @cropify2022 All Rights Preserved </i>
        </div>
        {/* <div className='hdg'>
						<b className='bg'>Your recomended crop is:</b>
						</div> */}
        {/* <div className='info'> */}
        {/* <div className='extra'></div>
						<div className='extra'></div>
						<div className='extra'></div> */}
        {/* <div className='infoa'> */}
        {/* <div className='extra'></div> */}
        {/* <div ><h2>
							
							</h2>
							</div> */}
        {/* <div className='head'>
						 <div className='cont'>
								<div className='name'><p className='infoa_text'>  Crop </p> </div>
								<div className='val'><p className='infob_text'>	{data.crop} </p> </div>
						</div>
						<div className='cont' >
						<div className='name'>
										<p className='infoa_text'> 	Expected yield in tonnes </p>
										</div>
										<div className='val'><p className='infob_text'>	{data.crop_yield} </p></div>
							</div>
							<div className='cont'>
						<div className='name'>
										<p className='infoa_text'> Profit in Ksh </p> </div>
										<div className='val'><p className='infob_text'>		{data.profit} </p> </div>
							</div> 
                 </div>				 */}
        {/* </div>
				</div> */}
      </div>
    </div>
  );
}

export default App;
