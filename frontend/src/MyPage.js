import React, { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css"; 
import Leaflet from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios"; 
import { mapOption, getCurrentPosition } from "./leafletCommon";
import { useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from "@mui/material";


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
  //console.log(location);
  const { username } = location.state;
  // キー設定
  const [mapKey, setMapKey] = useState(0);
  // 現在地情報
  const [currentPosition, setCurrentPosition] = useState({
    lat: 0,
    lng: 0,
  });
  // 場所情報
  const [placeData, setPlaceData] = useState([]); // いらなくなった
  const [postVisData, setPostVisData] = useState([]); // 訪問後
  const [preVisData, setPreVisData] = useState([]); // 訪問前

  // 初期処理
  useEffect(() => {
    moveCurrentPosition();
    // getDevidePlaceData();
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
      //console.log(location.coords.latitude, location.coords.longitude);
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
        username: username,
        latitude: lat,
        longitude: lng,
      });
    } catch (error) {
      console.error('Error sending location data:', error);
    }
  };

  // 場所データを取得する関数
  //未訪問の場所だけを取ってくるようにした（訪問済みは取ってこない）
  const fetchPreVisData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/mypage", {params: {username: username}});
      console.log('response', response.data);
      setPreVisData(Array.from(response.data));
      console.log('placedata', Array.from(response.data)); // setPlaceData後のplaceDataは非同期で更新されるため、直接データをログに出力
    } catch (error) {
      console.error('Error fetching place data:', error);
    }
  };
  // 訪問済みを取得
  const fetchPostVisData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/mypage/postvis", { params: {username: username}});
      setPostVisData(response.data);
      //console.log(postVisData);
    } catch (error) {
      console.error('Error fetching place data:', error);
    }
  };
  
  // 訪問済みと訪問前のデータとってくる
  const getPlaceData = async () => {
    await fetchPreVisData();
    await fetchPostVisData();
    // const newPre = placeData.filter((place) => {
    //   if (postVisData.some((postplace) => postplace.id===place.id)) {
    //     return place
    //   }
    // });
    // setPreVisData(newPre);
  };

  // 検索ボタンのハンドラ
  const handleSearchPlaces = () => {
    // 検索画面に遷移させる、またはモーダル出す
    // 検索ボタンの横に入力フォーム必要
    getPlaceData(); // いったん前の仕様を引き継ぐ
  };





  
  useEffect(() => {
    getPlaceData();
  }, []);

    console.log(preVisData, postVisData);
  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {username}さんの世界征服マップ
          </Typography>
          <Button color="inherit" onClick={() => moveCurrentPosition()}>
            現在地
          </Button>
          <Button color="inherit" onClick={() => handleSearchPlaces()}>
            検索
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ height: "90vh", width: "100%", mt: 2 }}>
        <MapContainer
          key={mapKey}
          center={currentPosition}
          zoom={mapOption.startZoom}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright";>OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={mapOption.maxZoom}
            minZoom={mapOption.minZoom}
          />
          <Marker position={currentPosition} icon={currentIcon}>
            <Popup>現在地</Popup>
          </Marker>
          {preVisData.length > 0 &&
            preVisData.map((place) => (
              <Marker key={place.id} position={[place.latitude, place.longitude]} icon={placeIconPreVis}>
                <Popup>{place.placename}</Popup>
              </Marker>
            ))
          }
          {postVisData.length > 0 &&
            postVisData.map((place) => (
              <Marker key={place.id} position={[place.latitude, place.longitude]} icon={placeIconPostVis}>
                <Popup>{place.placename}</Popup>
              </Marker>
            ))
          }
        </MapContainer>
      </Box>
    </Container>
  );
};

export default MyPage;