import React, { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css"; 
import Leaflet from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios"; 
import { mapOption, getCurrentPosition } from "./leafletCommon";
import { useLocation } from 'react-router-dom';

// 現在地アイコン
const currentIcon = Leaflet.icon({
  iconUrl: require("./img/CurrentIcon.png"),
  iconSize: [40, 40],
});
// 場所アイコン(訪問前)
const placeIconPreVis = Leaflet.icon({
  iconUrl: require("./img/PreVisIcon.png"),
  iconSize: [40, 40],
});

// 場所アイコン(訪問後)
const placeIconPostVis = Leaflet.icon({
  iconUrl: require("./img/PostVisIcon.png"),
  iconSize: [40, 40],
});

const MyPage = () => {
  // routerでページ遷移したときついでにデータも渡す
  const location = useLocation();
  console.log(location);
  const { username } = location.state;
  // キー設定
  const [mapKey, setMapKey] = useState(0);
  // 現在地情報
  const [currentPosition, setCurrentPosition] = useState({
    lat: 0,
    lng: 0,
  });
  // 場所情報
  const [placeData, setPlaceData] = useState([]);

  // 初期処理
  useEffect(() => {
    moveCurrentPosition();
    fetchPlaceData(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 現在地に移動
  const moveCurrentPosition = async () => {
    try {
      const location = await getCurrentPosition();
      setCurrentPosition({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
      // 現在地のデータをバックエンドに送信
      console.log(location.coords.latitude, location.coords.longitude);
      await sendLocationData(location.coords.latitude, location.coords.longitude);
      // キーを設定して、再表示
      setMapKey(new Date().getTime());
    } catch (error) {
      console.error('Error getting current position:', error);
    }
  };

  // 現在地データをバックエンドに送信する関数
  const sendLocationData = async (lat, lng) => {
    try {
      await axios.post("http://localhost:5000/api/mypage", {
        latitude: lat,
        longitude: lng,
      });
    } catch (error) {
      console.error('Error sending location data:', error);
    }
  };

  // // 場所データを取得する関数
  // const fetchPlaceData = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:5000/api/mypage");
  //     console.log('response', response.data);
  //     setPlaceData(Array.from(response.data));
  //     console.log('placedata', placeData);
  //   } catch (error) {
  //     console.error('Error fetching place data:', error);
  //   }
  // };

  // 場所データを取得する関数
  const fetchPlaceData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/mypage");
      console.log('response', response.data);
      setPlaceData(Array.from(response.data));
      console.log('placedata', Array.from(response.data)); // setPlaceData後のplaceDataは非同期で更新されるため、直接データをログに出力
    } catch (error) {
      console.error('Error fetching place data:', error);
    }
  };

  return (
    <>
      {/* ボタン(機能操作) */}
      <header>
        <a>ようこそ、{username}さん</a>
      </header>
      <div>
        <button onClick={() => moveCurrentPosition()}>現在地</button>
        <button onClick={() => fetchPlaceData()}>検索</button>
      </div>
      {/* 地図表示 */}
      <MapContainer
        key={mapKey}
        center={currentPosition}
        zoom={mapOption.startZoom}
        style={{ height: "90vh", width: "100vw" }}
      >
        {/* 地図のタイル情報 */}
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright";>OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={mapOption.maxZoom}
          minZoom={mapOption.minZoom}
        />
        {/* 現在地情報を出力 */}
        <Marker position={currentPosition} icon={currentIcon}>
          <Popup>現在地</Popup>
        </Marker>
        {/* 場所情報を出力 */}
        {placeData.length > 0
          ? placeData.map((item) => (
              <Marker key={item.id} position={[item.latitude, item.longitude]} icon={placeIconPreVis}>
                <Popup>{item.placename}</Popup>
              </Marker>
            ))
          : null}
      </MapContainer>
    </>
  );
};

export default MyPage;