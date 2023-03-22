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

    errors: {},
  });

  const [data, setData] = useState([]);
  const [mainCrop, setMainCrop] = useState({});
  const [counties, setCounties] = useState();
  const [selectedCrop, setSelectedCrop] = useState(null);

  async function handleInput(e) {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  }

  const getData = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/predict_status",
        {
          county: state.county,
          ha: state.ha,
        }
      );
      const data = response.data;

      setData(data);
      setMainCrop(data.crops[0]);
    } catch (error) {
      console.error(error);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setShowDiv(!showDiv);

    try {
      await axios.post("http://127.0.0.1:8000/predict_status", {
        county: state.county,
        ha: state.ha,
      });

      getData();

      setState({
        county: "",
        ha: "",
      });
    } catch (error) {
      console.error(error);
    }
  }

  // useEffect(() => {
  //   getData();

  // }, []);

  //make div visible/invisible
  const [showDiv, setShowDiv] = useState(false);

  const handleClick = () => {
    setShowDiv(!showDiv);
    setData(null);
  };
  //make information div visible/invisible
  const [showInfo, setShowInfo] = useState(false);

  const handleInfoClick = (cropData) => {
    setSelectedCrop(cropData);
  };

  const getCounty = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/counties");
      const data = response.data;

      setCounties(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getCounty();
  }, []);

  console.log(state);

  return (
    <div className="bg_overlay">
    <div className="bgm">
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

      {/* Div for showing crops */}
      {showDiv && (
        <div className="hdn pop-holder">
          <div className="pop">
            {/* loop through data to display */}
            {/* {cropData.crops.map(crop => {
        const cropName = Object.keys(crop)[0];
        const cropInfo = crop[cropName];
        return ( */}

            <div className="main">
              {mainCrop &&
                Object.entries(mainCrop).map(([name, data]) => (
                  <>
                    <div className="mainpic">
                      <img
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "cover",
                        }}
                        src={data.crop_info.image}
                        alt={data.crop_info.name}
                      />
                    </div>
                    <div className="maininfo">
                      <div className="crop_heading">
                        <div className="main_icon">
                          <div className="main_icon_holder">
                            <FaSeedling size={30} style={{ color: "rgba(21, 211, 3, 0.993)" }} />
                          </div>
                        </div>
                        <div className="crop_name_div">
                          <h1 className="crop_name">{name}</h1>
                        </div>
                      </div>

                      <div className="main_overlay">
                        <h1 className="info_name">Crop Info</h1>
                        <div className="data_text">
                          <div>
                            <p className="main_info_text">Yield/ha:</p>
                          </div>
                          <div className="value_div">
                            <p className="value">{data.yield}</p>
                          </div>
                          <div>
                            <p className="main_info_text">Tons</p>
                          </div>
                        </div>
                        <div className="data_text">
                          <div>
                            <p className="main_info_text">Cost/ha:</p>
                          </div>

                          <div className="value_div">
                            <p className="value">{data.crop_info.cost}</p>
                          </div>
                          <div>
                            <p className="main_info_text">Ksh</p>
                          </div>
                        </div>
                        <div className="data_text">
                          <div>
                            <p className="main_info_text">Return/ha:</p>
                          </div>

                          <div className="value_div">
                            <p className="value">{data.profit}</p>
                          </div>
                          <div>
                            <p className="main_info_text">Ksh</p>
                          </div>
                        </div>
                        <button
                          style={{ margin: "15% auto" }}
                          className="main_btn"
                          type="button"
                          onClick={() => handleInfoClick(data)}
                        >
                          Learn More{" "}
                        </button>
                      </div>
                    </div>
                    {/* div for information */}
                    {selectedCrop &&
                      selectedCrop.crop_info.name === data.crop_info.name && (
                        <div
                          key={selectedCrop.crop_info.name}
                          className=" main-info-holder"
                        >
                          {/* {console.log(selectedCrop)} */}
                          <div className="inf">
                            <div
                              className="inf_times"
                              onClick={() => setSelectedCrop(null)}
                            >
                              <FaTimes
                                size={30}
                                style={{
                                  color: "black",
                                  filter: "brightness(100%)",
                                }}
                              />
                            </div>

                            <div className="pic">
                              <img
                                style={{
                                  height: "100%",
                                  width: "100%",
                                  backgroundSize: "cover",
                                  objectFit: "cover",
                                }}
                                src={selectedCrop.crop_info.image}
                                alt={data.crop_info.name}
                              />
                            </div>
                            <div className="infheadng">
                              {/* {console.log(selectedCrop.crop_info.name)} */}
                              <h1 className="inf_text">
                                {selectedCrop.crop_info.name}
                              </h1>{" "}
                            </div>
                            <div className="information">
                              <p className="inf_text_heading">Fertilizer</p>
                              <p className="information_text">
                                {selectedCrop.crop_info.fertilizer}{" "}
                              </p>
                              <p className="inf_text_heading">Variety</p>
                              <p className="information_text">
                                {selectedCrop.crop_info.types}{" "}
                              </p>
                              <p className="inf_text_heading">Condition</p>
                              <p className="information_text">
                                {selectedCrop.crop_info.cond}{" "}
                              </p>
                              <p className="inf_text_heading">Seed Rate</p>
                              <p className="information_text">
                                {selectedCrop.crop_info.seedrate}{" "}
                              </p>
                              <p className="inf_text_heading">Spacing</p>
                              <p className="information_text">
                                {selectedCrop.crop_info.spacing}{" "}
                              </p>
                              <p className="inf_text_heading">
                                Extra Information
                              </p>
                              <p className="information_text">
                                {" "}
                                {selectedCrop.crop_info.info}{" "}
                              </p>
                              <br />
                            </div>
                          </div>
                        </div>
                      )}
                    {/* Div for information end */}
                  </>
                ))}
            </div>
            <div className="holder">
              {data &&
                data.crops &&
                data.crops.slice(1).map((crop) => {
                  const cropName = Object.keys(crop)[0];
                  const cropData = crop[cropName];
                  // {console.log(cropData)}
                  return (
                    <div key={cropName} className="crop">
                      <div className="headng">
                        <div
                          style={{
                            width: "20%",
                            height: "60%",
                            margin: "auto 1% auto 10%",
                            objectFit: "cover",
                            // backgroundColor:"yellow"
                          }}
                        >
                          <img
                            style={{
                              height: "98%",
                              width: "90%",
                              backgroundSize: "cover",
                              borderRadius: "50%",
                              objectFit:"cover"

                            }}
                            src={cropData.crop_info.image}
                            alt={cropData.crop_info.name}
                          />
                        </div>
                        <div className="infoa_text_title">
                          <p className="infoa_text">{cropName}</p>{" "}
                        </div>
                      </div>

                      <div className="infdiv">
                        <div className="infdiv-text">
                          <p className="infob_text">Yield/ha:</p>
                        </div>
                        <div className="val">
                          <p className="infob_text"> {cropData.yield} Tons</p>{" "}
                        </div>
                      </div>
                      <div className="infdiv">
                        <div className="infdiv-text">
                          <p className="infob_text">Cost/ha:</p>
                        </div>
                        <div className="val">
                          <p className="infob_text">
                            {" "}
                            {cropData.crop_info.cost} Ksh{" "}
                          </p>{" "}
                        </div>
                      </div>
                      <div className="infdiv">
                        <div className="infdiv-text">
                          <p className="infob_text">Return/ha:</p>
                        </div>
                        <div className="val">
                          <p className="infob_text"> {cropData.profit} Ksh</p>{" "}
                        </div>
                      </div>
                      <button
                        className="info_btn"
                        type="button"
                        onClick={() => handleInfoClick(cropData)}
                      >
                        Learn More{" "}
                      </button>
                      {/* div for information */}
                      {selectedCrop &&
                        selectedCrop.crop_info.name ===
                          cropData.crop_info.name && (
                          <div
                            key={selectedCrop.crop_info.name}
                            className=" inf-holder"
                          >
                            {/* {console.log(selectedCrop)} */}
                            <div className="inf">
                              <div
                                className="inf_times"
                                onClick={() => setSelectedCrop(null)}
                              >
                                <FaTimes
                                  size={30}
                                  style={{
                                    color: "black",
                                    filter: "brightness(200%)",
                                  }}
                                />
                              </div>

                              <div className="pic">
                                <img
                                  style={{
                                    height: "100%",
                                    width: "100%",
                                    backgroundSize: "cover",
                                    objectFit:"cover"
                                  }}
                                  src={selectedCrop.crop_info.image}
                                  alt={cropData.crop_info.name}
                                />
                              </div>
                              <div className="infheadng">
                                {/* {console.log(selectedCrop.crop_info.name)} */}
                                <h1 className="inf_text">
                                  {selectedCrop.crop_info.name}
                                </h1>{" "}
                              </div>
                              <div className="information">
                                <p className="inf_text_heading">Fertilizer</p>
                                <p className="information_text">
                                  {selectedCrop.crop_info.fertilizer}{" "}
                                </p>
                                <p className="inf_text_heading">Variety</p>
                                <p className="information_text">
                                  {selectedCrop.crop_info.types}{" "}
                                </p>
                                <p className="inf_text_heading">Condition</p>
                                <p className="information_text">
                                  {selectedCrop.crop_info.cond}{" "}
                                </p>
                                <p className="inf_text_heading">Seed Rate</p>
                                <p className="information_text">
                                  {selectedCrop.crop_info.seedrate}{" "}
                                </p>
                                <p className="inf_text_heading">Spacing</p>
                                <p className="information_text">
                                  {selectedCrop.crop_info.spacing}{" "}
                                </p>
                                <p className="inf_text_heading">
                                  Extra Information
                                </p>
                                <p className="information_text">
                                  {" "}
                                  {selectedCrop.crop_info.info}{" "}
                                </p>
                                <br />
                              </div>
                            </div>
                          </div>
                        )}
                      {/* Div for information end */}
                    </div>
                  );
                })}
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
                <br />
                <br />
                <label htmlFor="countySelect">
                  <p
                    style={{ fontSize: "small", paddingTop: "2px" }}
                    className="main_info_text"
                  >
                    Select a County
                  </p>
                </label>
                <select
                  // type="text"

                  // id="countySelect"
                  className="inpt"
                  value={state.county}
                  onChange={(event) =>
                    setState({ ...state, county: event.target.value })
                  }
                  // name="county"
                  // placeholder="Enter county"
                >
                  <option>Select County</option>
                  {counties &&
                    counties.map((county) => (
                      <option key={county.name} value={county.name}>
                        {county.name}
                      </option>
                    ))}
                </select>

                <br />
                <label htmlFor="ha">
                  {" "}
                  <p style={{ fontSize: "small" }} className="main_info_text">
                    Input Hectares
                  </p>
                </label>
                <input
                  type="text"
                  className="inpt"
                  value={state.ha}
                  onChange={handleInput}
                  name="ha"
                  placeholder="Enter ha"
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
      </div>
    </div>
    </div>
  );
}

export default App;
