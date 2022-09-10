import classNames from "classnames/bind";
import Images from "../public/Images";
import styles from "../styles/Home.module.scss";
import { useEffect, useState } from "react";
import { AiFillCaretDown, AiFillCaretUp, AiOutlineLoading3Quarters } from "react-icons/ai";

import list_item from "../components/ListItem";
import { useOnClickOut } from "../Hooks/useOnClickOut";
import { removeVietnameseTones } from "../components/VNTones";
import { TbTemperatureCelsius } from "react-icons/tb";
const axios = require("axios");
const cx = classNames.bind(styles);
let dates = new Date();
interface WeatherAPI {
  current: {
    condition: {
      icon: string;
      text: string;
    };
    temp_c: string;
    feelslike_c: string;
  };
}

const getRandomItem = (arr) => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  const item = arr[randomIndex];
  return item;
};
export default function Home() {
  const [selecttitle, setSelectTitle] = useState("");
  const [valueinput, setValueInput] = useState("");
  const [dataitem, setDataItem] = useState<any | null>();
  const [hour, setHour] = useState<any | null>("00");
  const [minute, setMinute] = useState<any | null>("00");
  const [AMorPM, setAMorPM] = useState("AM");
  const [newvaluearray, setNewValueArray] = useState([]);
  const [valuearray, setValueArray] = useState([]);
  const [weather, setWeather] = useState<WeatherAPI>();
  const [iconup, setIconUp] = useState(false);
  const [select, setSelect] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const UpdateTime = () => {
      dates = new Date();
      const datess = new Date();
      let hours = datess.getHours();
      let minutes = datess.getMinutes();
      if (hours > 12) {
        setHour(hours - 12);
        setAMorPM("PM");
      } else {
        setHour(hours);
        setAMorPM("AM");
      }
      if (minutes < 10) {
        setMinute("0" + minutes);
      } else {
        setMinute(minutes);
      }
    };

    setInterval(UpdateTime, 1000);
  });

  useEffect(() => {
    setSelectTitle(getRandomItem(list_item.LIST_PROVINCE));
  }, []);

  const _handleRenderItemForecast = () => {
    if (dataitem !== undefined && dataitem.length === 4) {
      return dataitem.map((item, index) => (
        <div key={index} className={cx("forecast-day-container")}>
          {item.day === "CN" ? <span>{item.day}</span> : <span>Thứ {item.day}</span>}
          <img src={item.icon} alt="" />
          <span className={cx("forecast-day-avg")}>{item.avgtemp_c}°</span>
        </div>
      ));
    }
  };

  const _handleRenderItemOption = () => {
    if (valueinput === "") {
      return list_item.LIST_PROVINCE.map((item, index) => (
        <div
          key={index}
          className={cx("option-item", selecttitle === item && "option-active")}
          onClick={() => ActiveProvince(item)}
        >
          <span>{item}</span>
        </div>
      ));
    } else {
      return valuearray.map((item, index) => (
        <div
          key={index}
          className={cx("option-item", selecttitle === item && "option-active")}
          onClick={() => ActiveProvince(item)}
        >
          <span>{item}</span>
        </div>
      ));
    }
  };

  const ActiveProvince = (value) => {
    setLoading(true);
    const count = setTimeout(() => {
      setLoading(false);
      setSelectTitle(value);
      setSelect(false);
      setIconUp(false);
      setValueInput("");
    }, 1200);
    return () => clearTimeout(count);
  };

  const countRef = useOnClickOut(() => {
    setSelect(false);
    setIconUp(false);
    setValueInput("");
  });

  const _handleOpenOptionItem = () => {
    setSelect(!select);
    setIconUp(!iconup);
    setValueInput("");
  };

  useEffect(() => {
    const province = removeVietnameseTones(selecttitle);
    const API_KEY = "4dea35c3744c4d2ca6d93100220909";
    const BASE_URL = "http://api.weatherapi.com";
    axios.get(`${BASE_URL}/v1/current.json?key=${API_KEY}&lang=vi&q=${province}`).then((response) => {
      setWeather(response.data);
    });
  }, [selecttitle]);

  useEffect(() => {
    if (valueinput !== "") {
      setNewValueArray(valueinput.split(""));
    }
  }, [valueinput]);

  useEffect(() => {
    const text = list_item.LIST_PROVINCE.filter((item) => {
      return newvaluearray.every((value) => {
        return item.includes(value);
      });
    });
    setValueArray(text);
  }, [newvaluearray]);

  const text = async () => {
    const [DateToday, MonthToday, YearToday] = dates.toLocaleDateString().split("/");
    const day = new Date(`${MonthToday} ${DateToday}, ${YearToday}`);
    const nextDay = new Date(day);
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const API_KEY = "4dea35c3744c4d2ca6d93100220909";
    const BASE_URL = "http://api.weatherapi.com";
    const dataitem = [];
    const newdataitem = [];
    const datadayweeks = [];
    for (let i = 1; i <= 4; i++) {
      nextDay.setDate(day.getDate() + i);
      const textDay = nextDay.toString().split(" ");
      let dayweek = "";
      if (days.indexOf(textDay[0]) === 6) {
        dayweek = "CN";
        datadayweeks.push(dayweek);
      } else {
        dayweek = `${days.indexOf(textDay[0]) + 2}`;
        datadayweeks.push(dayweek);
      }
      const province = removeVietnameseTones(selecttitle);
      await axios
        .get(`${BASE_URL}/v1/forecast.json?key=${API_KEY}&dt=${textDay[3]}-${textDay[1]}-${textDay[2]}&q=${province}`)
        .then((response) => {
          const item = {
            day: dayweek,
            avgtemp_c: response.data.forecast.forecastday[0].day.avgtemp_c,
            icon: response.data.forecast.forecastday[0].day.condition.icon,
          };
          dataitem.push(item);
        });
    }
    return dataitem;
  };

  text().then((value) => {
    setDataItem(value);
  });

  return (
    <div className={cx("container")}>
      <div className={cx("img-main-wrap")}>
        <div className={cx("img-main-container")}>
          {loading && (
            <>
              <div className={cx("loading-icon-container")}>
                <AiOutlineLoading3Quarters className={cx("loading-icon")} />
              </div>
              <div className={cx("loading-province")} />
            </>
          )}
          {/* <div className={cx("img-background")}></div> */}
          <img className={cx("img-main")} src={Images.Main.src} alt="" />
          <div className={cx("main-container")}>
            <div ref={countRef} className={cx("select-container")}>
              <div className={cx("select-title-container")} onClick={() => _handleOpenOptionItem()}>
                <span className={cx("select-title")}>{selecttitle}</span>
                {!iconup ? (
                  <AiFillCaretDown className={cx("select-icon")} />
                ) : (
                  <AiFillCaretUp className={cx("select-icon")} />
                )}
              </div>
              {select && (
                <div className={cx("option-container")}>
                  <input
                    type="text"
                    placeholder="Nhập tỉnh thành cần tìm..."
                    onChange={(e) => setValueInput(e.target.value)}
                  ></input>
                  {_handleRenderItemOption()}
                </div>
              )}
            </div>
            <div className={cx("day-time-container")}>
              <p>
                Thứ {dates.getDay()} Ngày {dates.getDate()} Tháng {dates.getMonth()} - {hour}:{minute} {AMorPM}
              </p>
            </div>
            <div className={cx("province-title")}>
              <h2>{selecttitle}, Việt Nam</h2>
            </div>
            <div className={cx("temparature-container")}>
              <div className={cx("temparature-background")}></div>
              <div className={cx("temparature-title")}>
                <img src={weather?.current.condition.icon} alt="" />
                <div className={cx("temparature-c")}>
                  <span>{weather?.current.temp_c}</span>
                  <div className={cx("icon-temparature-container")}>
                    <div className={cx("icon-o")} />
                    <span className={cx("icon-c")}>C</span>
                  </div>
                </div>
              </div>
            </div>
            <span className={cx("province-text")} style={{ fontWeight: "500" }}>
              {weather?.current.condition.text}
            </span>
            <span className={cx("province-text")}>CẢM THẤY NHƯ {weather?.current.feelslike_c}°</span>
          </div>
          <div className={cx("nextdayforecast")}>
            <div className={cx("nextdayforecast-wrapper")}>
              <h2>Nhiệt độ trung bình</h2>
              <div className={cx("nextdayforecast-container")}>{_handleRenderItemForecast()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
